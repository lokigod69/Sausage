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
    rating: 5,
    reviewCount: 16,
    reviewsUrl:
      "https://www.google.com/maps/place/The+Sausage+Guy+-+Meat+%26+Deli+Store/@9.5690154,123.7897527,17z/",
    featuredCategories: [
      {
        label: "Sausages",
        slug: "sausages",
        blurb: "German and Swiss-style bratwurst, krainer, bangers and franks.",
        match: ["Sausages"],
      },
      {
        label: "Steaks & Beef",
        slug: "steaks-beef",
        blurb: "Brazilian and US Angus cuts - ribeye, tenderloin, chuck eye.",
        match: ["Beef"],
      },
      {
        label: "Poultry",
        slug: "poultry",
        blurb: "Whole chicken, breast, wings, duck and whole turkey.",
        match: ["Poultry"],
      },
      {
        label: "Seafood & Salmon",
        slug: "seafood-salmon",
        blurb: "Smoked and frozen Pacific salmon - whole and portioned.",
        match: ["Seafood"],
      },
      {
        label: "Cheese & Dairy",
        slug: "cheese-dairy",
        blurb: "Cheese-counter favorites and deli dairy pairings.",
        match: ["Bakery & Pies"],
      },
      {
        label: "Hams & Deli",
        slug: "hams-deli",
        blurb: "Cooked hams, salami, mortadella, bacon and charcuterie.",
        match: ["Hams & Cold Cuts", "Charcuterie", "Bacon"],
      },
      {
        label: "Burgers & Hot Dogs",
        slug: "burgers-hot-dogs",
        blurb: "Burger patties, franks, hot dogs and buns for the freezer.",
        match: ["Beef", "Sausages", "Bakery & Pies"],
      },
      {
        label: "Specials",
        slug: "specials",
        blurb: "Ask what is new, limited or especially good at the counter.",
        match: ["Sausages", "Beef", "Seafood", "Hams & Cold Cuts"],
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
