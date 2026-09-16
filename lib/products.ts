import type {
  Branch,
  FeaturedCategory,
  Product,
  ProductStock,
  RawProductRow,
  StockStatus,
} from "@/lib/types";
import { RAW_PRODUCTS } from "@/data/products";
import {
  getDisplayName,
  getWeightPrice,
  isExcludedProduct,
} from "@/data/pos-overrides";

/**
 * Fallback "running low" threshold when the POS has no per-item setting:
 * 2 kg for weight items, 2 pieces otherwise.
 */
export const DEFAULT_LOW_STOCK = 2;

/**
 * Product access + normalization layer.
 *
 * This is the single chokepoint between private source data (Google Sheet /
 * POS / Airtable / Supabase) and anything the visitor sees. The public site
 * imports ONLY from here, never from data/products.ts directly, so the
 * cost/margin/notes columns physically cannot leak into a component.
 *
 * To swap the source later, replace `loadRawRows` with an async fetch — the
 * rest of the page keeps working because it consumes the normalized `Product`.
 */

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

function firstString(...values: Array<string | null | undefined>): string {
  for (const v of values) {
    if (typeof v === "string" && v.trim().length > 0) return v.trim();
  }
  return "";
}

function toTags(input: RawProductRow["tags"]): string[] | undefined {
  if (!input) return undefined;
  const arr = Array.isArray(input)
    ? input
    : input.split(/[,;|]/).map((t) => t.trim());
  const cleaned = arr.filter((t) => t.length > 0);
  return cleaned.length ? cleaned : undefined;
}

function toFeatured(row: RawProductRow): boolean | undefined {
  // Only an EXPLICIT featured/status field is honored. We never infer
  // "featured" from spreadsheet row colors or price values.
  if (typeof row.featured === "boolean") return row.featured || undefined;
  if (typeof row.featured === "string") {
    const v = row.featured.trim().toLowerCase();
    if (["true", "yes", "y", "1", "featured"].includes(v)) return true;
  }
  if (typeof row.status === "string") {
    const v = row.status.trim().toLowerCase();
    if (["featured", "new", "new arrival", "highlight"].includes(v)) return true;
  }
  return undefined;
}

function toNumber(value: number | string | null | undefined): number | undefined {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "") {
    const n = Number(value.replace(/[^0-9.-]/g, ""));
    if (Number.isFinite(n)) return n;
  }
  return undefined;
}

/**
 * Turn a POS stock count into the badge a visitor sees.
 *
 * "untracked" is not a failure — plenty of deli items are not counted in the
 * POS at all, and claiming "out of stock" for those would be a lie. They get
 * no badge rather than a wrong one.
 */
export function deriveStock(row: RawProductRow): ProductStock | undefined {
  if (row.trackStock !== true) {
    // Nothing counted. Only say so if the row came from the POS at all.
    return row.posVariantId ? { status: "untracked" } : undefined;
  }

  const quantity = toNumber(row.inStock);
  if (quantity === undefined) return { status: "untracked" };

  // A negative count means the POS sold more than it recorded receiving —
  // a bookkeeping gap, not an empty shelf. Claiming "sold out" for a ribeye
  // they actually have would turn a stock-keeping slip into a lost customer,
  // so say nothing instead.
  if (quantity < 0) return { status: "untracked" };

  const threshold = toNumber(row.lowStock) ?? DEFAULT_LOW_STOCK;
  let status: StockStatus;
  if (quantity <= 0) status = "out";
  else if (quantity <= threshold) status = "low";
  else status = "in";

  const stock: ProductStock = {
    status,
    quantity,
    // Refined below in `normalizeProduct` for items priced by the kilo,
    // which the POS counts as individual units but the shelf holds as packs.
    quantityUnit: row.soldByWeight === true ? "kg" : "pcs",
  };

  const updatedAt = firstString(row.stockUpdatedAt);
  if (updatedAt) stock.updatedAt = updatedAt;

  return stock;
}

/** Format a counter price for display, e.g. 690 -> "₱690". */
export function formatPrice(
  price: number | undefined,
  currency: string | undefined,
): string | undefined {
  if (price === undefined || !Number.isFinite(price)) return undefined;
  const code = currency || "PHP";
  try {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: code,
      // Meat prices are whole pesos; cents are noise on a shelf label.
      minimumFractionDigits: Number.isInteger(price) ? 0 : 2,
      maximumFractionDigits: 2,
    }).format(price);
  } catch {
    // Unknown currency code — show the number with the raw code.
    return `${code} ${price}`;
  }
}

/**
 * Convert one private row into a public-safe Product.
 * Cost/margin/notes are simply never read here — they cannot pass through.
 * Price and stock DO pass, but only the POS-sourced public fields, never the
 * sheet's private `sellPrice`/`buyPrice` columns.
 */
export function normalizeProduct(
  row: RawProductRow,
  branchSlug: string,
  index: number,
): Product | null {
  const productName = firstString(row.productName, row.product, row.name);
  const category = firstString(row.category) || "Other";
  if (!productName) return null;
  // Till mechanics ("Delivery Fee") are not things a visitor can buy.
  if (isExcludedProduct(productName)) return null;

  const id = `${branchSlug}-${slugify(category)}-${slugify(productName)}-${index}`;

  const product: Product = {
    id,
    branchSlug,
    category,
    // What the visitor reads. Every lookup below still keys off the POS
    // name in `productName`, so a rename never breaks a price or a stock
    // match — see data/pos-overrides.ts.
    productName: getDisplayName(productName),
  };

  const unit = firstString(row.unit);
  if (unit) product.unit = unit;

  const image = firstString(row.image);
  if (image) product.image = image;

  const tags = toTags(row.tags);
  if (tags) product.tags = tags;

  const featured = toFeatured(row);
  if (featured) product.featured = featured;

  const price = toNumber(row.price);
  if (price !== undefined) {
    product.price = price;
    product.currency = firstString(row.currency) || "PHP";
  } else {
    // The POS weighs these at the till and holds no price, so fall back to
    // the owner's pricelist. Anything still missing stays "By weight".
    const override = getWeightPrice(productName);
    if (override) {
      product.price = override.price;
      product.currency = firstString(row.currency) || "PHP";
      product.unit = override.unit;
    } else if (row.variablePrice === true) {
      product.variablePrice = true;
    }
  }

  const posVariantId = firstString(row.posVariantId);
  if (posVariantId) product.posVariantId = posVariantId;

  const stock = deriveStock(row);
  if (stock) {
    // A bratwurst priced "per kg" is not stocked as loose pieces — the POS
    // counts the packs on the shelf. Say "packs" so the count matches what a
    // customer would actually be handed. Items the POS weighs keep "kg", and
    // genuinely single units (cans, jars, sachets) keep "pcs".
    if (
      stock.quantityUnit === "pcs" &&
      /per\s*kg|pack/i.test(product.unit ?? "")
    ) {
      stock.quantityUnit = "pack";
    }
    product.stock = stock;
  }

  return product;
}

function loadRawRows(branchSlug: string): RawProductRow[] {
  return RAW_PRODUCTS[branchSlug] ?? [];
}

/** All public-safe products for a branch, normalized and de-duplicated by id. */
export function getProductsForBranch(branchSlug: string): Product[] {
  const rows = loadRawRows(branchSlug);
  const out: Product[] = [];
  rows.forEach((row, i) => {
    const p = normalizeProduct(row, branchSlug, i);
    if (p) out.push(p);
  });
  return out;
}

export interface CategoryGroup {
  category: string;
  slug: string;
  products: Product[];
}

/** Group products by their source category, preserving first-seen order. */
export function groupByCategory(products: Product[]): CategoryGroup[] {
  const map = new Map<string, CategoryGroup>();
  for (const p of products) {
    let group = map.get(p.category);
    if (!group) {
      group = { category: p.category, slug: slugify(p.category), products: [] };
      map.set(p.category, group);
    }
    group.products.push(p);
  }
  return [...map.values()];
}

/** Distinct category labels for chips/filters. */
export function getCategories(products: Product[]): string[] {
  return [...new Set(products.map((p) => p.category))];
}

/**
 * Resolve which source categories roll up into a featured card.
 * Falls back to matching the card label itself.
 */
export function matchesFeatured(
  card: FeaturedCategory,
  category: string,
): boolean {
  const targets = card.match ?? [card.label];
  return targets.some((t) => t.toLowerCase() === category.toLowerCase());
}

/** Count of products that fall under a featured category card. */
export function countForFeatured(
  card: FeaturedCategory,
  products: Product[],
): number {
  return products.filter((p) => matchesFeatured(card, p.category)).length;
}

/** Featured products (explicit flag only), capped for display. */
export function getFeaturedProducts(products: Product[], limit = 8): Product[] {
  return products.filter((p) => p.featured).slice(0, limit);
}

/**
 * Lightweight, accent-insensitive substring search across name, category and
 * tags. Designed to stay snappy for 300+ items on a mobile device.
 */
export function searchProducts(products: Product[], query: string): Product[] {
  const q = query.trim().toLowerCase();
  if (!q) return products;
  return products.filter((p) => {
    const haystack = [
      p.productName,
      p.category,
      p.unit ?? "",
      ...(p.tags ?? []),
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(q);
  });
}

/** Build the public category cards for a branch, with live counts. */
export function getFeaturedCategoryCards(branch: Branch, products: Product[]) {
  return branch.featuredCategories.map((card) => ({
    ...card,
    count: countForFeatured(card, products),
  }));
}

/**
 * Strip the fields the browser has no use for before handing a product list
 * to a client component.
 *
 * Every prop of a client component is serialised twice into the document —
 * once as rendered HTML, once as React's flight payload — so a field nobody
 * reads is paid for 443 times. Three qualify:
 *
 *   - `posVariantId` is the POS join key. It is how lib/catalog.ts matches
 *     the live overlay onto the snapshot, which happens on the server. It is
 *     an internal Loyverse identifier with no business in a page source.
 *   - `branchSlug` is the same string on every row of a branch page.
 *   - `stock.updatedAt` is a timestamp per product; the one the page actually
 *     prints is `catalog.syncedAt`, passed separately.
 *
 * Together that is roughly 110 bytes a product, about 49 KB off the document.
 * Call it at the boundary — where products cross into a "use client"
 * component — not earlier, because server components still want the full
 * shape for structured data and the category counts.
 */
export function forClient(products: Product[]): Product[] {
  return products.map(({ branchSlug: _b, posVariantId: _v, stock, ...rest }) => {
    if (!stock) return rest as Product;
    const { updatedAt: _u, ...keptStock } = stock;
    return { ...rest, stock: keptStock } as Product;
  });
}
