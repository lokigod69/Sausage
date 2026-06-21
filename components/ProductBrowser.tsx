"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Branch, Product } from "@/lib/types";
import {
  getCategories,
  groupByCategory,
  searchProducts,
  slugify,
} from "@/lib/products";
import { SearchIcon, ChevronDown } from "./icons";
import { SectionHeading } from "./SectionHeading";

/**
 * Product browser: search + category chips + collapsible category sections.
 *
 * Public-safe by construction — it only ever receives normalized `Product`
 * objects (name + category + optional unit/image/tags). No prices anywhere.
 * Designed to stay responsive with 300+ items: filtering is a single pass and
 * each category renders a lightweight list, collapsed by default past the
 * first few so the page never feels like a spreadsheet.
 */

const ALL = "All";

export function ProductBrowser({
  products,
  mode = "sections",
}: {
  branch?: Branch;
  products: Product[];
  /** "sections" = collapsible accordions; "grid" = flat dense locker inventory. */
  mode?: "sections" | "grid";
}) {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<string>(ALL);
  const rootRef = useRef<HTMLDivElement>(null);

  const categories = useMemo(() => getCategories(products), [products]);

  // Let the featured CategoryGrid drive this filter. We attach listeners to
  // any element carrying data-target-category (rendered server-side).
  useEffect(() => {
    const nodes = Array.from(
      document.querySelectorAll<HTMLElement>("[data-target-category]"),
    );
    const handler = (e: Event) => {
      const target = (e.currentTarget as HTMLElement).dataset.targetCategory;
      setQuery("");
      setActive(target && categories.includes(target) ? target : ALL);
    };
    nodes.forEach((n) => n.addEventListener("click", handler));
    return () => nodes.forEach((n) => n.removeEventListener("click", handler));
  }, [categories]);

  // Let the Locker hero's search field drive this browser.
  useEffect(() => {
    const onSearch = (e: Event) => {
      const detail = (e as CustomEvent<string>).detail ?? "";
      setActive(ALL);
      setQuery(detail);
    };
    window.addEventListener("sg:search", onSearch as EventListener);
    return () =>
      window.removeEventListener("sg:search", onSearch as EventListener);
  }, []);

  const filtered = useMemo(() => {
    const byQuery = searchProducts(products, query);
    return active === ALL
      ? byQuery
      : byQuery.filter((p) => p.category === active);
  }, [products, query, active]);

  const groups = useMemo(() => groupByCategory(filtered), [filtered]);

  return (
    <section id="products" className="section scroll-mt-20" ref={rootRef}>
      <div className="wrap">
        <SectionHeading
          eyebrow="The full list"
          title="Everything we carry"
          intro="Stock changes daily — message us to confirm what's in today."
        />

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
            data-active={active === ALL}
            onClick={() => setActive(ALL)}
          >
            All
            <span style={{ opacity: 0.7 }}>{products.length}</span>
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              className="chip"
              data-active={active === cat}
              onClick={() => setActive(cat)}
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
                  defaultOpen={i < 3 || active !== ALL || query.length > 0}
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
      </span>
    </li>
  );
}

function ProductCard({ product }: { product: Product }) {
  return (
    <li
      className="flex items-center gap-3 rounded-[12px] px-3.5 py-3 transition-colors"
      style={{
        background: "color-mix(in oklab, var(--bg-2) 55%, transparent)",
        border: "1px solid var(--line)",
      }}
    >
      <span
        aria-hidden
        className="grid h-9 w-9 flex-shrink-0 place-items-center rounded-md font-display text-sm font-semibold"
        style={{
          background: "color-mix(in oklab, var(--accent) 16%, transparent)",
          color: "var(--accent)",
        }}
      >
        {product.productName.charAt(0)}
      </span>
      <span className="min-w-0">
        <span
          className="block truncate text-sm font-medium"
          style={{ color: "var(--text-strong)" }}
        >
          {product.productName}
        </span>
        {product.unit && (
          <span className="block text-xs" style={{ color: "var(--faint)" }}>
            {product.unit}
          </span>
        )}
      </span>
    </li>
  );
}
