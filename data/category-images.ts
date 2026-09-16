/**
 * Artwork for categories: which have a photograph, and which fall back to a
 * silhouette.
 *
 * Silhouettes are deliberately iconographic rather than photographic. At the
 * 44px product thumbnail a stock photo of sausages sitting beside a named
 * product reads as a picture of *that* product; a silhouette reads as what it
 * is. On the big category cards they stand in for the photos the shop has not
 * shot yet, and look like a choice rather than a gap.
 */

/** Categories with a real photo at /public/products/<slug>.jpg. */
export const CATEGORY_PHOTO_SLUGS = new Set([
  "sausages",
  "steaks-beef",
  "poultry",
  "seafood-salmon",
  "hams-deli",
  "cheese-dairy",
  "bakery-desserts",
  "ready-meals",
  "breakfast-cereals",
  "frozen-fruit-veg",
  "pantry-preserves",
  "herbs-spices",
  "snacks-sweets",
  "drinks",
]);

export function hasCategoryPhoto(slug: string): boolean {
  return CATEGORY_PHOTO_SLUGS.has(slug);
}

/**
 * Category -> silhouette, used for product thumbnails with no POS photo and
 * for category cards with no photograph.
 *
 * Categories with no honest match keep a plain tinted panel: inventing a mark
 * for "Pantry & Preserves" out of a sausage outline would be worse than none.
 */
export const CATEGORY_SILHOUETTES: Record<string, string> = {
  Sausages: "/silhouettes/noir-sausages.svg",
  "Meat & Steaks": "/silhouettes/noir-beef.svg",
  Poultry: "/silhouettes/noir-poultry.svg",
  Seafood: "/silhouettes/noir-seafood.svg",
  "Cheese & Dairy": "/silhouettes/noir-cheese.svg",
  "Hams & Cold Cuts": "/silhouettes/noir-deli.svg",
};

export function getCategorySilhouette(category: string): string | undefined {
  return CATEGORY_SILHOUETTES[category];
}

/**
 * What each category's title image actually shows.
 *
 * Written per category rather than templated. An alt of "Sausages" on a page
 * headed "Sausages" tells a screen-reader user nothing they did not already
 * have; these describe the photograph, which is the point of alt text — and
 * they are also the only description a search engine gets of a picture it
 * cannot see.
 *
 * Keyed by the category label, not the slug, because that is what the
 * components have in hand.
 */
export const CATEGORY_PHOTO_ALT: Record<string, string> = {
  Sausages:
    "Fresh bratwurst and Nürnberger sausages coiled on a wooden board with rosemary",
  "Meat & Steaks":
    "A thick marbled ribeye and a tenderloin steak on butcher paper with cracked pepper",
  Poultry:
    "Raw chicken breast fillets and a whole trussed chicken on a light wooden board",
  Seafood:
    "A raw salmon fillet beside prawns and a whole fish on crushed ice with lemon",
  "Hams & Cold Cuts":
    "Folded slices of honey ham, black forest ham and salami fanned on a slate board",
  "Cheese & Dairy":
    "A wedge of aged gouda, a block of cheddar and a ball of mozzarella with a jug of milk",
  "Bakery & Desserts":
    "A dark rye loaf, soft burger buns and a slice of sticky toffee pudding on a floured board",
  "Ready Meals":
    "A baked beef lasagne in a white dish with one portion lifted out, steam rising",
  "Breakfast & Cereals":
    "A bowl of rolled oats with honey pouring in, beside a jar of muesli and a jug of milk",
  "Frozen Fruit & Veg":
    "Frozen strawberries, raspberries, blackberries and blueberries spilling from a paper bag, with broccoli, green beans and peas behind them, frost still on everything",
  "Pantry & Preserves":
    "Four glass jars on a wooden table — sauerkraut, pickled onions with bay and peppercorns, whole gherkins with dill, and red cabbage",
  "Herbs & Spices":
    "Paprika, turmeric, chilli flakes, coarse salt, black and white peppercorns, dried oregano, bay leaves and star anise on dark slate with a brass spice scoop",
  "Snacks & Sweets":
    "Broken dark chocolate on dark stone, with bowls of salted pretzels, mixed nuts, dried fruit, cookies and sugared jellies around it",
  Drinks:
    "A frosted bottle of beer beside a tall glass of iced tea with lemon and mint, a bottle of sparkling water and glasses of juice, on a wet dark counter with ice",
};

/**
 * Alt text for a category's title image.
 *
 * When there is no photograph yet the picture is a tinted panel, and the
 * honest description of a tinted panel is that the photograph is coming — not
 * a description of food that is not in the frame.
 */
export function getCategoryAlt(category: string, slug: string): string {
  if (!hasCategoryPhoto(slug)) {
    return `${category} at The Sausage Guy Panglao — photo coming soon`;
  }
  const described = CATEGORY_PHOTO_ALT[category];
  return described
    ? `${described} — ${category} at The Sausage Guy Panglao`
    : `${category} at The Sausage Guy Panglao`;
}
