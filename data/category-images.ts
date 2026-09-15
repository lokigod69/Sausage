/**
 * Category silhouettes, used as the thumbnail for products whose POS entry
 * has no photo.
 *
 * Deliberately iconographic rather than photographic: at 44px a stock photo of
 * sausages sitting beside a named product reads as a picture of *that*
 * product. A silhouette reads as what it is — a category mark — so nothing is
 * implied about the item in the bag.
 *
 * Categories with no honest match (Drinks, Snacks, Spices, Delicatessen,
 * Other) are left out on purpose and keep the lettered tile.
 */
export const CATEGORY_SILHOUETTES: Record<string, string> = {
  Sausages: "/silhouettes/noir-sausages.svg",
  Beef: "/silhouettes/noir-beef.svg",
  Meat: "/silhouettes/noir-beef.svg",
  Poultry: "/silhouettes/noir-poultry.svg",
  Seafood: "/silhouettes/noir-seafood.svg",
  Cheese: "/silhouettes/noir-cheese.svg",
  Dairy: "/silhouettes/noir-cheese.svg",
  "Hams & Cold Cuts": "/silhouettes/noir-deli.svg",
};

export function getCategorySilhouette(category: string): string | undefined {
  return CATEGORY_SILHOUETTES[category];
}
