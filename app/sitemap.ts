import type { MetadataRoute } from "next";
import { getAllBranchSlugs } from "@/data/branches";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
  return getAllBranchSlugs().map((slug) => ({
    url: `${SITE_URL}/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 1,
  }));
}
