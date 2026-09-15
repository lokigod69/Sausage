"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Branch, Product, StockStatus } from "@/lib/types";
import {
  formatPrice,
  getCategories,
  groupByCategory,
  searchProducts,
  slugify,
} from "@/lib/products";
import Image from "next/image";
import { getCategorySilhouette } from "@/data/category-images";
import { SearchIcon, ChevronDown } from "./icons";
import { SectionHeading } from "./SectionHeading";

/**
 * Product browser: search + category chips + collapsible category sections.
 *
 * Public-safe by construction — it only ever receives normalized `Product`
 * objects. Those now carry the counter sell price and a stock reading synced
 * from Loyverse; they still never carry cost or margin (see lib/types.ts).
 * Designed to stay responsive with 300+ items: filtering is a single pass and
 * each category renders a lightweight list, collapsed by default past the
 * first few so the page never feels like a spreadsheet.
 */

const ALL = "All";

const STOCK_LABEL: Record<StockStatus, string> = {
  in: "In stock",
  low: "Low stock",
  out: "Sold out",
  untracked: "",
};

const STOCK_COLOR: Record<StockStatus, string> = {
  in: "var(--stock-in)",
  low: "var(--stock-low)",
  out: "var(--stock-out)",
  untracked: "var(--faint)",
};

/**
 * Round the POS quantity for display. Weight items come back as e.g.
 * 4.2315 kg — a shelf does not need four decimals, and neither does a
 * visitor deciding whether to drive over.
 */
function formatQuantity(quantity: number, unit: string | undefined): string {
  const rounded =
    unit === "kg" ? Math.round(quantity * 10) / 10 : Math.round(quantity);
  // "kg" reads the same either way; the counted units need their singular.
  let label = unit;
  if (unit === "pack" && rounded !== 1) label = "packs";
  else if (unit === "pcs" && rounded === 1) label = "pc";
  return `${rounded} ${label ?? ""}`.trim();
}

/**
 * The product photo synced from the POS, falling back to the initial when an
 * item has none — about a quarter of the catalog. Both render at the same
 * size so a mixed list keeps one rhythm rather than looking half-finished.
 */
function ProductThumb({ product, size }: { product: Product; size: number }) {
  if (product.image) {
    return (
      <Image
        src={product.image}
        alt=""
        width={size}
        height={size}
        className="flex-shrink-0 rounded-md object-cover"
        style={{ width: size, height: size, background: "var(--bg-2)" }}
        // Below the fold behind an accordion; never worth blocking paint.
        loading="lazy"
      />
    );
  }

  const silhouette = getCategorySilhouette(product.category);

  return (
    <span
      aria-hidden
      className="grid flex-shrink-0 place-items-center rounded-md font-display font-semibold"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.4,
        background: "color-mix(in oklab, var(--accent) 16%, transparent)",
        color: "var(--accent)",
      }}
    >
      {silhouette ? (
        // Masked rather than an <img>: the source SVGs are a fixed dark fill,
        // which would vanish on the four dark variants. As a mask they take
        // the theme's accent colour in all six.
        <span
          style={{
            width: size * 0.64,
            height: size * 0.64,
            background: "var(--accent)",
            WebkitMaskImage: `url(${silhouette})`,
            maskImage: `url(${silhouette})`,
            WebkitMaskRepeat: "no-repeat",
            maskRepeat: "no-repeat",
            WebkitMaskPosition: "center",
            maskPosition: "center",
            WebkitMaskSize: "contain",
            maskSize: "contain",
          }}
        />
      ) : (
        product.productName.charAt(0)
      )}
    </span>
  );
}

/** "In stock · 4.2 kg" — badge plus the real number behind it. */
function StockBadge({ product }: { product: Product }) {
  const stock = product.stock;
  if (!stock || stock.status === "untracked") return null;

  const label = STOCK_LABEL[stock.status];
  const quantity =
    stock.status !== "out" && stock.quantity !== undefined
      ? formatQuantity(stock.quantity, stock.quantityUnit)
      : undefined;

  return (
    <span
      className="mono inline-flex items-center gap-1.5 text-[0.65rem] uppercase tracking-wider"
      style={{ color: STOCK_COLOR[stock.status] }}
    >
      <span
        aria-hidden
        className="inline-block h-1.5 w-1.5 flex-shrink-0 rounded-full"
        style={{ background: "currentColor" }}
      />
      {label}
      {quantity && (
        <span style={{ color: "var(--faint)" }}>· {quantity}</span>
      )}
    </span>
  );
}

/**
 * Counter price, right-aligned so a column of cards stays scannable.
 *
 * Sausages, premium steaks and the cheese counter are weighed and priced at
 * the till, so the POS holds no number for them. Those say "by weight" — an
 * honest answer, and the WhatsApp CTA is right there for the exact figure.
 */
function PriceTag({ product }: { product: Product }) {
  const price = formatPrice(product.price, product.currency);

  if (!price) {
    if (!product.variablePrice) return null;
    return (
      <span
        className="mono whitespace-nowrap text-[0.65rem] uppercase tracking-wider"
        style={{ color: "var(--muted)" }}
      >
        By weight
      </span>
    );
  }

  return (
    <span
      className="font-display text-sm font-semibold tabular-nums"
      style={{ color: "var(--text-strong)" }}
    >
      {price}
    </span>
  );
}

/** "updated 10 minutes ago" — honest about how fresh the stock reading is. */
function freshness(syncedAt: string | undefined): string | undefined {
  if (!syncedAt) return undefined;
  const then = new Date(syncedAt).getTime();
  if (!Number.isFinite(then)) return undefined;

  const minutes = Math.max(0, Math.round((Date.now() - then) / 60000));
  if (minutes < 2) return "updated just now";
  if (minutes < 60) return `updated ${minutes} minutes ago`;

  const hours = Math.round(minutes / 60);
  if (hours < 24) return `updated ${hours} hour${hours === 1 ? "" : "s"} ago`;

  const days = Math.round(hours / 24);
  return `updated ${days} day${days === 1 ? "" : "s"} ago`;
}

export function ProductBrowser({
  products,
  mode = "sections",
  syncedAt,
}: {
  branch?: Branch;
  products: Product[];
  /** "sections" = collapsible accordions; "grid" = flat dense locker inventory. */
  mode?: "sections" | "grid";
  /** When the POS reading behind these prices/stock was taken. */
  syncedAt?: string;
}) {
  const [query, setQuery] = useState("");
  // Resolved after mount: a relative time rendered on the server would not
  // match the one the browser computes a moment later.
  const [updated, setUpdated] = useState<string | undefined>(undefined);

  useEffect(() => setUpdated(freshness(syncedAt)), [syncedAt]);
  // Active filter: empty array = All. Featured cards can activate several
  // source categories at once (e.g. "Hams & Deli" = Hams + Bacon + Charcuterie).
  const [active, setActive] = useState<string[]>([]);
  const rootRef = useRef<HTMLDivElement>(null);

  const categories = useMemo(() => getCategories(products), [products]);

  // Let the featured CategoryGrid drive this filter. We attach listeners to
  // any element carrying data-target-category (rendered server-side); the
  // attribute may hold a comma-separated list of source categories.
  useEffect(() => {
    const nodes = Array.from(
      document.querySelectorAll<HTMLElement>("[data-target-category]"),
    );
    const handler = (e: Event) => {
      const raw = (e.currentTarget as HTMLElement).dataset.targetCategory ?? "";
      const targets = raw
        .split(",")
        .map((t) => t.trim())
        .filter((t) => categories.includes(t));
      setQuery("");
      setActive(targets);
    };
    nodes.forEach((n) => n.addEventListener("click", handler));
    return () => nodes.forEach((n) => n.removeEventListener("click", handler));
  }, [categories]);

  // Let the Locker hero's search field drive this browser.
  useEffect(() => {
    const onSearch = (e: Event) => {
      const detail = (e as CustomEvent<string>).detail ?? "";
      setActive([]);
      setQuery(detail);
    };
    window.addEventListener("sg:search", onSearch as EventListener);
    return () =>
      window.removeEventListener("sg:search", onSearch as EventListener);
  }, []);

  const filtered = useMemo(() => {
    const byQuery = searchProducts(products, query);
    return active.length === 0
      ? byQuery
      : byQuery.filter((p) => active.includes(p.category));
  }, [products, query, active]);

  const groups = useMemo(() => groupByCategory(filtered), [filtered]);

  return (
    <section id="products" className="section scroll-mt-20" ref={rootRef}>
      <div className="wrap">
        <SectionHeading
          eyebrow="The full list"
          title="Everything we carry"
          intro="Prices and stock come straight from the counter — message us to set anything aside."
        />

        {updated && (
          <p
            className="mono mt-3 text-[0.68rem] uppercase tracking-wider"
            style={{ color: "var(--faint)" }}
          >
            Stock {updated}
          </p>
        )}

        {/* Search */}
        <div className="relative mt-7 max-w-xl">
          <SearchIcon
            width={18}
            height={18}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2"
            style={{ color: "var(--faint)" }}
          />
          <input
            type="search"
            inputMode="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search ribeye, salmon, bratwurst…"
            aria-label="Search products"
            className="w-full rounded-full py-3.5 pl-11 pr-4 text-base outline-none"
            style={{
              background: "var(--surface)",
              border: "1px solid var(--line-strong)",
              color: "var(--text-strong)",
            }}
          />
        </div>

        {/* Category chips */}
        <div className="no-scrollbar mt-4 flex gap-2 overflow-x-auto pb-1">
          <button
            type="button"
            className="chip"
            data-active={active.length === 0}
            onClick={() => setActive([])}
          >
            {ALL}
            <span style={{ opacity: 0.7 }}>{products.length}</span>
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              className="chip"
              data-active={active.includes(cat)}
              onClick={() => setActive([cat])}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Results */}
        <div className="mt-8 space-y-4">
          {groups.length === 0 && (
            <div
              className="surface-solid p-8 text-center"
              style={{ color: "var(--muted)" }}
            >
              <p className="font-display text-lg" style={{ color: "var(--text-strong)" }}>
                No matches for &ldquo;{query}&rdquo;
              </p>
              <p className="mt-2 text-sm">
                Try a different term, or message us — we may have it behind the
                counter.
              </p>
            </div>
          )}

          {mode === "grid"
            ? groups.length > 0 && (
                <ul className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4">
                  {filtered.map((p) => (
                    <LockerCell key={p.id} product={p} />
                  ))}
                </ul>
              )
            : groups.map((group, i) => (
                <CategorySection
                  key={group.category}
                  category={group.category}
                  products={group.products}
                  defaultOpen={i < 3 || active.length > 0 || query.length > 0}
                />
              ))}
        </div>
      </div>
    </section>
  );
}

function CategorySection({
  category,
  products,
  defaultOpen,
}: {
  category: string;
  products: Product[];
  defaultOpen: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  // Keep open state in sync when filters change the recommended default.
  useEffect(() => setOpen(defaultOpen), [defaultOpen]);

  return (
    <div
      id={`cat-${slugify(category)}`}
      className="surface-solid scroll-mt-24 overflow-hidden"
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
      >
        <span className="flex items-baseline gap-3">
          <span
            className="font-display text-xl font-semibold"
            style={{ color: "var(--text-strong)" }}
          >
            {category}
          </span>
          <span className="text-sm" style={{ color: "var(--faint)" }}>
            {products.length} item{products.length === 1 ? "" : "s"}
          </span>
        </span>
        <ChevronDown
          width={20}
          height={20}
          className="transition-transform duration-300"
          style={{
            color: "var(--muted)",
            transform: open ? "rotate(180deg)" : "none",
          }}
        />
      </button>

      {open && (
        <div className="px-5 pb-5">
          <ul className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

/** Dense locker-inventory cell (used in grid mode). */
function LockerCell({ product }: { product: Product }) {
  return (
    <li
      className="flex flex-col justify-between gap-3 p-3.5 transition-colors"
      style={{
        background: "var(--surface)",
        border: "1px solid var(--line)",
        borderRadius: "var(--radius)",
        minHeight: 104,
      }}
    >
      <span
        className="mono text-[0.62rem] uppercase tracking-wider"
        style={{ color: "var(--accent)" }}
      >
        {product.category}
      </span>
      <span>
        <span
          className="block text-sm font-medium leading-snug"
          style={{ color: "var(--text-strong)" }}
        >
          {product.productName}
        </span>
        {product.unit && (
          <span
            className="mono mt-1 block text-[0.7rem]"
            style={{ color: "var(--faint)" }}
          >
            {product.unit}
          </span>
        )}
        <span className="mt-1.5 flex flex-wrap items-baseline justify-between gap-x-2 gap-y-1">
          <PriceTag product={product} />
          <StockBadge product={product} />
        </span>
      </span>
    </li>
  );
}

function ProductCard({ product }: { product: Product }) {
  const soldOut = product.stock?.status === "out";

  return (
    <li
      className="flex items-center gap-3 rounded-[12px] px-3.5 py-3 transition-colors"
      style={{
        background: "color-mix(in oklab, var(--bg-2) 55%, transparent)",
        border: "1px solid var(--line)",
        // Sold-out items stay listed — visitors still want to know we carry
        // them — but recede so the available goods lead.
        opacity: soldOut ? 0.62 : 1,
      }}
    >
      <ProductThumb product={product} size={44} />
      <span className="flex min-w-0 flex-1 items-center justify-between gap-3">
        <span className="min-w-0">
          {/*
            Wraps to two lines rather than truncating: POS names carry the
            distinguishing part at the end ("Crunchy Granola 275g (Cacao)"),
            so a single clipped line turns different products into identical
            cards.
          */}
          <span
            className="line-clamp-2 block text-sm font-medium leading-snug"
            style={{ color: "var(--text-strong)" }}
          >
            {product.productName}
          </span>
          <span className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
            {product.unit && (
              <span className="text-xs" style={{ color: "var(--faint)" }}>
                {product.unit}
              </span>
            )}
            <StockBadge product={product} />
          </span>
        </span>
        <PriceTag product={product} />
      </span>
    </li>
  );
}
