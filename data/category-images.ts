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
