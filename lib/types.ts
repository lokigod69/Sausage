/**
 * Shared domain types for the multi-branch discovery microsite.
 *
 * IMPORTANT — public data boundary:
 * The public `Product` type below deliberately does NOT include buy price,
 * sell price, margin, or internal notes. Those live only in `RawProductRow`
 * (the private spreadsheet/POS shape) and are stripped by `normalizeProduct`
 * in `lib/products.ts`. Never widen `Product` to carry cost data.
 */

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
  /** INTERNAL — not rendered for now (prices change often). */
  sellPrice?: number | string | null;
  /** INTERNAL — never rendered. */
  margin?: number | string | null;
  /** INTERNAL — never rendered. */
  notes?: string | null;
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
export type Variant = "noir" | "golden" | "locker" | "ocean" | "fuego";

export const VARIANTS: Variant[] = ["noir", "golden", "locker", "ocean", "fuego"];
export const DEFAULT_VARIANT: Variant = "noir";

export const VARIANT_META: Record<
  Variant,
  { name: string; blurb: string }
> = {
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
