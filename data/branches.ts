import type { Branch } from "@/lib/types";

/**
 * Branch registry. Adding a new location (e.g. Tagbilaran) is a matter of
 * appending an entry here and adding its products in data/products.ts. The
 * generic branch page reads from this map.
 */
export const BRANCHES: Branch[] = [
  {
    slug: "panglao",
    name: "The Sausage Guy Panglao",
    tagline: "Sausages - Steaks - Hams - Deli",
    address: "Inside Dason Store, Purok 5, Bolod, 6340 Panglao, Bohol",
    locality: "Panglao, Bohol",
    phone: "+63 908 955 4554",
    whatsapp: "+63 908 955 4554",
    hours: {
      label: "Open daily",
      open: "08:00",
      close: "20:00",
      display: "8:00 AM - 8:00 PM",
    },
    facebookUrl: "https://www.facebook.com/thesausageguypanglao",
    // Points to the store's own Google listing, not the host (Dason Store).
    mapQuery: "The Sausage Guy - Meat & Deli Store, Panglao, Bohol",
    heroImage: "/branches/panglao-hero.jpg",
    wayfinding: "Look for The Sausage Guy inside Dason Store.",
    // Read off the live Google listing on 16 Sep 2026. Hand-maintained for
    // now — there is no automated review sync yet.
    rating: 5,
    reviewCount: 18,
    // Addressed by the listing's CID, not by name + coordinates: the old
    // /maps/place/<name>/@<coords> form dropped the name on load and left
    // visitors staring at an empty map pin. A CID resolves to this exact
    // business and survives renames and moves.
    reviewsUrl: "https://maps.google.com/?cid=4915944145284651818",
    /*
     * One card per category, in shopping order: the counter first — what the
     * shop is known for and what someone drives out for — then the shelves.
     *
     * `match` is omitted throughout because the category names produced by
     * data/loyverse-category-map.ts are exactly these labels. If a card ever
     * needs to gather several source categories again, add `match`.
     *
     * `slug` picks the card photo from /public/products/<slug>.jpg. The eight
     * without artwork fall back to a category mark — see CategoryPhoto.
     */
    featuredCategories: [
      // ---- The counter ---------------------------------------------------
      {
        label: "Sausages",
        slug: "sausages",
        blurb: "German and Swiss-style bratwurst, krainer, bangers and franks.",
      },
      {
        label: "Meat & Steaks",
        slug: "steaks-beef",
        blurb: "Brazilian and USDA steaks, ground beef, bacon, lamb and ostrich.",
      },
      {
        label: "Poultry",
        slug: "poultry",
        blurb: "Whole chicken, breast, wings, duck and turkey.",
      },
      {
        label: "Seafood",
        slug: "seafood-salmon",
        blurb: "Salmon, tuna, pompano, squid and scallops.",
      },
      {
        label: "Hams & Cold Cuts",
        slug: "hams-deli",
        blurb: "Cooked hams, salami, mortadella, pastrami and lyoner.",
      },
      {
        label: "Cheese & Dairy",
        slug: "cheese-dairy",
        blurb: "Cut-to-order cheese, butter, yoghurt, milk and ice cream.",
      },

      // ---- The shelves ---------------------------------------------------
      {
        label: "Bakery & Desserts",
        slug: "bakery-desserts",
        blurb: "Sourdough, croissants, pasties, buns, wraps and cakes.",
      },
      {
        label: "Ready Meals",
        slug: "ready-meals",
        blurb: "Lasagna, stew, chili, pies — heat and eat.",
      },
      {
        label: "Breakfast & Cereals",
        slug: "breakfast-cereals",
        blurb: "Granola, muesli, oats and breakfast sausage.",
      },
      {
        label: "Frozen Fruit & Veg",
        slug: "frozen-fruit-veg",
        blurb: "Berries, broccoli, peas, mushrooms and mixed vegetables.",
      },
      {
        label: "Pantry & Preserves",
        slug: "pantry-preserves",
        blurb: "Olives, capers, tomatoes, sauces, mustards and vinegars.",
      },
      {
        label: "Herbs & Spices",
        slug: "herbs-spices",
        blurb: "Seventy single spices, rubs and blends by the sachet.",
      },
      {
        label: "Snacks & Sweets",
        slug: "snacks-sweets",
        blurb: "Nuts, dried fruit, crisps, crackers and chocolate.",
      },
      {
        label: "Drinks",
        slug: "drinks",
        blurb: "Wine, beer, juice, kombucha, coffee and tea.",
      },
    ],
  },
];

export const DEFAULT_BRANCH_SLUG = "panglao";

export function getBranch(slug: string): Branch | undefined {
  return BRANCHES.find((b) => b.slug === slug);
}

export function getAllBranchSlugs(): string[] {
  return BRANCHES.map((b) => b.slug);
}
