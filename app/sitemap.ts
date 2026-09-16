import type { MetadataRoute } from "next";
import { BRANCHES } from "@/data/branches";
import { categorySlug } from "@/lib/routes";
import { SITE_URL } from "@/lib/site";

/**
 * Every page that should be indexed: each branch, and each of its category
 * landing pages. The category pages carry the long-form content and the
 * product data, so they are the ones most likely to answer a search — they
 * are listed at the same priority as the branch page rather than below it.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [];

  for (const branch of BRANCHES) {
    entries.push({
      url: `${SITE_URL}/${branch.slug}`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1,
    });

    for (const card of branch.featuredCategories) {
      entries.push({
        url: `${SITE_URL}/${branch.slug}/${categorySlug(card.label)}`,
        lastModified: now,
        // Stock and prices change daily; the editorial content does not.
        changeFrequency: "daily",
        priority: 0.9,
      });
    }
  }

  /*
   * The accessibility statement. Low priority — nobody searches for it — but
   * it belongs in the sitemap: it is a real page, it is linked from the
   * footer of every other one, and leaving it out would be the one page on
   * the site we quietly did not want found.
   */
  entries.push({
    url: `${SITE_URL}/accessibility`,
    lastModified: now,
    changeFrequency: "yearly",
    priority: 0.3,
  });

  return entries;
}
