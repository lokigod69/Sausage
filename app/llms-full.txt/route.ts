import { BRANCHES } from "@/data/branches";
import { getBranchCatalog } from "@/lib/catalog";
import { getCategoryContent } from "@/data/category-content";
import { categorySlug } from "@/lib/routes";
import { branchLinks } from "@/lib/contact";

/**
 * /llms-full.txt — the same map as /llms.txt, with the actual content inline.
 *
 * The convention pairs a short index (llms.txt) with a full expansion, so an
 * assistant can decide whether it needs the summary or the substance. This is
 * the substance: every category's article, every product with its price, in
 * one plain-text document that needs no crawling and no JavaScript.
 *
 * It is large — around 16,000 words of editorial plus the catalogue — which
 * is the point. A model answering "how do I cook a Weisswurst" or "what is
 * Asin Tibuok" should be able to do it from one fetch.
 */

export const revalidate = 3600;

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://www.thesausageguy.shop";

export async function GET() {
  const branch = BRANCHES[0];
  const links = branchLinks(branch);
  const catalog = await getBranchCatalog(branch);

  const byCategory = new Map<string, typeof catalog.products>();
  for (const p of catalog.products) {
    const list = byCategory.get(p.category) ?? [];
    list.push(p);
    byCategory.set(p.category, list);
  }

  const sections = branch.featuredCategories.map((card) => {
    const items = byCategory.get(card.label) ?? [];
    const content = getCategoryContent(card.label);
    const url = `${SITE_URL}/${branch.slug}/${categorySlug(card.label)}`;

    const productLines = items
      .map((p) => {
        const price =
          p.price !== undefined
            ? `₱${p.price.toLocaleString("en-PH")}`
            : p.variablePrice
              ? "priced by weight at the counter"
              : "price on request";
        return `- ${p.productName}${p.unit ? ` (${p.unit})` : ""} — ${price}`;
      })
      .join("\n");

    const article = content
      ? content.sections
          .map((s) => `### ${s.heading}\n\n${s.paragraphs.join("\n\n")}`)
          .join("\n\n")
      : "_No article for this category yet._";

    return `## ${card.label}

URL: ${url}
Products: ${items.length}
Summary: ${content?.lede ?? card.blurb}

### Products

${productLines || "_No products listed right now._"}

${article}`;
  });

  const body = `# The Sausage Guy — ${branch.locality} — full content

> Complete text of ${SITE_URL}/${branch.slug}: every category, every product
> with its current counter price, and the full editorial for each category.
> Generated from the shop's point-of-sale system and regenerated hourly.

## Shop

- Name: ${branch.name}
- Address: ${branch.address}
- Hours: ${branch.hours.label}, ${branch.hours.display}
- Phone: ${branch.phone}
- Messenger (preferred contact): ${links.messenger}
- WhatsApp: ${links.whatsapp}
- Facebook: ${links.facebook}
- Google Maps: ${links.maps}
- Rating: ${branch.rating ?? "—"} from ${branch.reviewCount ?? 0} Google reviews
- Products listed: ${catalog.products.length}
- Currency: PHP (₱)

Prices below are the shop's real counter prices, read from its point-of-sale
system. Stock levels are not included here because they change hourly — check
the live page or message the shop.

${sections.join("\n\n---\n\n")}
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
