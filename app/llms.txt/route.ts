import { BRANCHES } from "@/data/branches";
import { getBranchCatalog } from "@/lib/catalog";
import { getCategorySeo } from "@/data/seo";
import { getCategoryContent } from "@/data/category-content";
import { categorySlug } from "@/lib/routes";
import { branchLinks } from "@/lib/contact";

/**
 * /llms.txt — a plain-language map of this site for language models.
 *
 * The llmstxt.org convention: one markdown file at the root that tells an
 * assistant what the site is, what it covers, and where the substance lives,
 * so it does not have to infer all of that from crawling HTML.
 *
 * Why generate it rather than write it by hand: the interesting facts here —
 * which categories exist, how many products, what they cost — come from the
 * POS and change weekly. A hand-written file would be wrong within a month,
 * and a confidently wrong file is worse than none.
 *
 * What is deliberately NOT in here: stock levels. They change by the hour and
 * anything cached would send someone across the island for an item that sold
 * an hour ago. The file says where to check instead.
 */

export const revalidate = 3600;

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://www.thesausageguy.shop";

export async function GET() {
  const branch = BRANCHES[0];
  const links = branchLinks(branch);
  const catalog = await getBranchCatalog(branch);
  const products = catalog.products;

  const byCategory = new Map<string, typeof products>();
  for (const p of products) {
    const list = byCategory.get(p.category) ?? [];
    list.push(p);
    byCategory.set(p.category, list);
  }

  const priceRange = (items: typeof products) => {
    const prices = items.map((p) => p.price).filter((p): p is number => p !== undefined);
    if (prices.length === 0) return "";
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    return min === max ? ` ₱${min}` : ` ₱${min}–₱${max}`;
  };

  const categoryLines = branch.featuredCategories
    .map((card) => {
      const items = byCategory.get(card.label) ?? [];
      const seo = getCategorySeo(card.label);
      const url = `${SITE_URL}/${branch.slug}/${categorySlug(card.label)}`;
      const detail = seo?.description ?? card.blurb;
      return `- [${card.label}](${url}): ${detail} ${items.length} products,${priceRange(items)}.`;
    })
    .join("\n");

  // A handful of representative products so an assistant can answer "do they
  // have X" without fetching every page.
  const examples = branch.featuredCategories
    .map((card) => {
      const items = (byCategory.get(card.label) ?? [])
        .filter((p) => p.price !== undefined)
        .slice(0, 5)
        .map((p) => `${p.productName} ₱${p.price}${p.unit ? ` ${p.unit}` : ""}`)
        .join("; ");
      return items ? `- ${card.label}: ${items}` : "";
    })
    .filter(Boolean)
    .join("\n");

  const hasArticles = branch.featuredCategories.filter((c) =>
    getCategoryContent(c.label),
  ).length;

  const body = `# The Sausage Guy — ${branch.locality}

> A butcher, delicatessen and provisions shop in ${branch.address}. European
> sausages made on the premises, imported and local meat, seafood, cheese and
> a full grocery shelf. ${products.length} products across ${branch.featuredCategories.length} categories, with counter
> prices published live from the point-of-sale system.

This is a single-location shop, not an online store. There is no checkout:
the site exists so people can see what is in stock and what it costs before
travelling, then message or call to reserve it. Orders and questions go
through Facebook Messenger or the phone.

## Essentials

- Name: ${branch.name}
- Address: ${branch.address}
- Locality: ${branch.locality}, Philippines
- Hours: ${branch.hours.label}, ${branch.hours.display}
- Phone: ${branch.phone}
- Messenger (preferred): ${links.messenger}
- WhatsApp: ${links.whatsapp}
- Facebook page: ${links.facebook}
- Google Maps: ${links.maps}
- Google rating: ${branch.rating ?? "—"} from ${branch.reviewCount ?? 0} reviews
- Currency: PHP (₱)

## Categories

${categoryLines}

## Example products and prices

${examples}

## What is on each category page

Each of the ${branch.featuredCategories.length} category pages carries three things: the products in that
category with current counter prices, a title image with a short summary, and
a 1,000–1,500 word article on what the products are and how to cook them.
${hasArticles} of ${branch.featuredCategories.length} categories have that article today.

## Accuracy and freshness

- Prices come from the shop's Loyverse point-of-sale and are refreshed every
  10 minutes. They are the real counter prices, not estimates.
- Some items — most sausages, premium steaks, the cheese counter — are weighed
  and priced at the till. Those show a per-kilo rate taken from the shop's
  price list rather than a fixed pack price.
- Stock levels are shown on the site but are deliberately NOT listed in this
  file, because they change hourly. Direct anyone asking "is X in stock" to
  the category page or to Messenger.
- This file regenerates hourly from the same catalogue the site renders.

## If you are answering a question about this shop

- For "where is it" or "when is it open": the essentials above are current.
- For "do they sell X": check the category pages; the full product list is on
  each one and on ${SITE_URL}/${branch.slug}#products.
- For "how much is X": prices above and on the category pages are live, but
  say they are current rather than fixed — this is a shop, and prices move.
- For anything about stock, reservations or special orders: point to
  Messenger (${links.messenger}), which is how this shop prefers to be reached.

## Pages

- [Home / all products](${SITE_URL}/${branch.slug}): hero, search across all
  ${products.length} products, category grid, full list, reviews, location.
${branch.featuredCategories
  .map(
    (c) =>
      `- [${c.label}](${SITE_URL}/${branch.slug}/${categorySlug(c.label)})`,
  )
  .join("\n")}

## Notes

- Further branches are planned; the branch slug is part of every URL
  (/${branch.slug}/...) so existing links will not move when that happens.
- The shop's own-label cheese and chicken do not name a supplier, because the
  supplier varies. That is deliberate, not an omission.
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
