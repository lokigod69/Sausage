import { slugify } from "@/lib/products";

/**
 * URLs for the per-category landing pages.
 *
 * The slug drops the ampersand rather than transliterating it, so
 * "Cheese & Dairy" becomes /cheese-dairy and not /cheese-and-dairy — shorter,
 * and it matches the card slugs already used for artwork.
 */
export function categorySlug(label: string): string {
  return slugify(label.replace(/&/g, " "));
}

export function categoryPath(basePath: string, label: string): string {
  return `${basePath}/${categorySlug(label)}`;
}

/** Find the category whose slug matches, for resolving a page's params. */
export function categoryFromSlug(
  slug: string,
  categories: string[],
): string | undefined {
  return categories.find((c) => categorySlug(c) === slug);
}
