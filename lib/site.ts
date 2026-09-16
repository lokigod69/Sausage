/**
 * The site's own absolute URL. One definition, used everywhere.
 *
 * This existed seven times, copy-pasted, and two of those copies fell back to
 * "http://localhost:3000" while the other five fell back to the real domain.
 * `NEXT_PUBLIC_SITE_URL` was never set on Vercel, so production shipped with
 * a mix: the sitemap and the category share images had the right host, and
 * every canonical tag on the site pointed at localhost.
 *
 * A canonical pointing at a host the crawler cannot reach is not a cosmetic
 * bug. It tells Google the real page is a duplicate of one it cannot fetch,
 * which is the one instruction on a page that can remove the whole site from
 * search results.
 *
 * So the fallback is the production domain, always, and localhost is used
 * only when Next is actually running in development. A missing environment
 * variable can no longer take the site down quietly; the worst it can do now
 * is publish the right domain.
 */
const PRODUCTION_URL = "https://www.thesausageguy.shop";

function resolve(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (configured) return configured.replace(/\/+$/, "");
  return process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : PRODUCTION_URL;
}

export const SITE_URL = resolve();

/** Absolute URL for a site-relative path, e.g. "/panglao" or "products/x.jpg". */
export function absoluteUrl(path: string): string {
  return `${SITE_URL}/${path.replace(/^\/+/, "")}`;
}
