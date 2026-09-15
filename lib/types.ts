/**
 * Shared domain types for the multi-branch discovery microsite.
 *
 * IMPORTANT — public data boundary:
 * The public `Product` type carries the SELL price and stock level. Those are
 * published deliberately, synced from Loyverse POS, and are the only money
 * fields allowed to cross. Buy price, cost, margin and internal notes must
 * NEVER appear here: they live only in `RawProductRow` (the private sheet
 * shape) and in the POS, and are stripped in two places — `normalizeProduct`
 * in `lib/products.ts` and `mapItem` in `lib/loyverse.ts`. Never widen
 * `Product` to carry cost data.
 */

/** Whether an item is on the shelf right now, per the POS. */
export type StockStatus = "in" | "low" | "out" | "untracked";

/** Public-safe stock reading for one product. */
export interface ProductStock {
  status: StockStatus;
  /** Exact quantity held, when the POS tracks a count for this item. */
  quantity?: number;
  /** Unit for `quantity` — "kg" for weight items, otherwise "pcs". */
  quantityUnit?: string;
  /** ISO timestamp of the POS reading, for the "as of" line. */
  updatedAt?: string;
}

/** A category slug used for chips, anchors, and grouping. */
export type CategorySlug = string;

/** Public-safe product. Anything rendered to a visitor uses this shape. */
export interface Product {
  /** Stable, URL/anchor-safe id. */
  id: string;
  /** Which branch carries this item. */
  branchSlug: string;
  /** Human category label, e.g. "Steaks & Beef". */
  category: string;
  /** Display name shown on the card. */
  productName: string;
  /** Optional, subtle unit hint, e.g. "per kg", "500g". */
  unit?: string;
  /** Optional image path under /public/products/{slug}.jpg. */
  image?: string;
  /** Optional free-form tags for search/filtering (public-safe only). */
  tags?: string[];
  /** Optional explicit feature flag — only honored if the source sets it. */
  featured?: boolean;
  /** Counter sell price, synced from the POS. Never a cost or margin. */
  price?: number;
  /**
   * True when the POS prices this item at the counter by weight, so there is
   * no fixed price to show. The card says so rather than showing a blank.
   */
  variablePrice?: boolean;
  /** ISO currency code for `price`, e.g. "PHP". */
  currency?: string;
  /** Live stock reading, when the POS carries one. */
  stock?: ProductStock;
  /** POS variant id — the join key for the live stock/price overlay. */
  posVariantId?: string;
}

/**
 * The PRIVATE shape that may come from a Google Sheet / POS export.
 * This is the only place cost/margin/notes are allowed to exist in code.
 * It must never be imported into a component or returned to the client.
 */
export interface RawProductRow {
  category?: string | null;
  productName?: string | null;
  product?: string | null; // alternate header spelling
  name?: string | null; // alternate header spelling
  unit?: string | null;
  /** INTERNAL — never rendered. */
  buyPrice?: number | string | null;
  /**
   * INTERNAL — the private sheet's own price column, still never rendered.
   * Public prices come from the POS via `price` below, so that publishing
   * stays an explicit act of the sync rather than a side effect of a
   * spreadsheet column happening to be named the right thing.
   */
  sellPrice?: number | string | null;
  /** INTERNAL — never rendered. */
  margin?: number | string | null;
  /** INTERNAL — never rendered. */
  notes?: string | null;

  // ---- PUBLIC, POS-sourced (written only by scripts/sync-loyverse.ts) ----
  /** Counter sell price from Loyverse. */
  price?: number | null;
  /** POS uses VARIABLE pricing — weighed and priced at the counter. */
  variablePrice?: boolean | null;
  /** ISO currency code for `price`. */
  currency?: string | null;
  /** POS variant id — join key for the live overlay. */
  posVariantId?: string | null;
  /** Quantity on hand at sync time. */
  inStock?: number | null;
  /** Whether the POS keeps a stock count for this item at all. */
  trackStock?: boolean | null;
  /** Weight items are priced per kg and counted in kg. */
  soldByWeight?: boolean | null;
  /** Per-item "running low" threshold set in the POS. */
  lowStock?: number | null;
  /** ISO timestamp of the stock reading. */
  stockUpdatedAt?: string | null;
  /** Optional explicit public fields, if the sheet adds them. */
  featured?: boolean | string | null;
  status?: string | null;
  tags?: string | string[] | null;
  image?: string | null;
}

/** A featured category surfaced as a card in the grid. */
export interface FeaturedCategory {
  /** Matches a product `category` (or maps to several via `match`). */
  label: string;
  /** Anchor-safe slug. */
  slug: CategorySlug;
  /** One-line description used on the category card. */
  blurb: string;
  /**
   * Category labels (as they appear in product data) that roll up into this
   * featured card. Lets a card like "Seafood & Salmon" gather multiple
   * source categories. Defaults to [label] when omitted.
   */
  match?: string[];
}

/** A storefront branch. New branches (e.g. Tagbilaran) drop in here. */
export interface Branch {
  slug: string;
  name: string;
  /** Brand tagline, e.g. the product spread. */
  tagline: string;
  address: string;
  /** Short locality line for badges/announcement bars. */
  locality: string;
  phone: string;
  /** Digits-only or +-prefixed; used to build tel: and wa.me links. */
  whatsapp: string;
  hours: {
    label: string; // e.g. "Open daily"
    open: string; // "08:00"
    close: string; // "20:00"
    display: string; // "8:00 AM – 8:00 PM"
  };
  facebookUrl: string;
  /** Free-text query handed to Google Maps — no API key, no coordinates. */
  mapQuery: string;
  /** Optional hero image under /public/brand or /public/branches. */
  heroImage?: string;
  /** Ordered list of featured category cards. */
  featuredCategories: FeaturedCategory[];
  /** A short "look for us" wayfinding hint shown in Location. */
  wayfinding?: string;
  /** Google rating (e.g. 5) — shown as social proof, not invented. */
  rating?: number;
  /** Number of Google reviews. */
  reviewCount?: number;
  /** Direct link to the Google reviews listing. */
  reviewsUrl?: string;
}

/** Design directions selectable via ?variant= or the dev switcher. */
export type Variant = "fable" | "noir" | "golden" | "locker" | "ocean" | "fuego";

export const VARIANTS: Variant[] = [
  "fable",
  "noir",
  "golden",
  "locker",
  "ocean",
  "fuego",
];
export const DEFAULT_VARIANT: Variant = "fable";

export const VARIANT_META: Record<
  Variant,
  { name: string; blurb: string }
> = {
  fable: {
    name: "Fable Atelier",
    blurb:
      "Charcoal, butcher paper & copper — candlelit editorial atelier for fine provisions.",
  },
  noir: {
    name: "Noir Deli",
    blurb: "Premium black, charcoal & bone — boutique butcher and European deli.",
  },
  golden: {
    name: "Golden Daily",
    blurb: "Warm gold, coffee & parchment — sunny, family-friendly daily market.",
  },
  locker: {
    name: "Island Provision Locker",
    blurb: "Charcoal, deep green & brass — modern provision store and freezer.",
  },
  ocean: {
    name: "Ocean Pearl",
    blurb: "Seafoam, pearl & deep teal — tropical beachside pantry & fresh catches.",
  },
  fuego: {
    name: "Fuego Grill",
    blurb: "Volcanic black, smoke & orange ember — live-fire barbecue & smoked meats.",
  },
};

export function isVariant(value: unknown): value is Variant {
  return (
    typeof value === "string" && (VARIANTS as string[]).includes(value)
  );
}
