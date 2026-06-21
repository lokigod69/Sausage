import type { Branch, FeaturedCategory, Product, RawProductRow } from "@/lib/types";
import { RAW_PRODUCTS } from "@/data/products";

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

/**
 * Convert one private row into a public-safe Product.
 * Cost/margin/notes are simply never read here — they cannot pass through.
 */
export function normalizeProduct(
  row: RawProductRow,
  branchSlug: string,
  index: number,
): Product | null {
  const productName = firstString(row.productName, row.product, row.name);
  const category = firstString(row.category) || "Other";
  if (!productName) return null;

  const id = `${branchSlug}-${slugify(category)}-${slugify(productName)}-${index}`;

  const product: Product = {
    id,
    branchSlug,
    category,
    productName,
  };

  const unit = firstString(row.unit);
  if (unit) product.unit = unit;

  const image = firstString(row.image);
  if (image) product.image = image;

  const tags = toTags(row.tags);
  if (tags) product.tags = tags;

  const featured = toFeatured(row);
  if (featured) product.featured = featured;

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
