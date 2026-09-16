import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBranch } from "@/data/branches";
import { getBranchCatalog } from "@/lib/catalog";
import { categoryFromSlug, categorySlug, categoryPath } from "@/lib/routes";
import { getCategoryContent } from "@/data/category-content";
import { forClient } from "@/lib/products";
import { getCategorySeo } from "@/data/seo";
import { CategoryHero } from "@/components/CategoryHero";
import { CategoryArticle } from "@/components/CategoryArticle";
import { RelatedAisles } from "@/components/RelatedAisles";
import { categoryImageSrc } from "@/components/CategoryPhoto";
import { hasCategoryPhoto } from "@/data/category-images";
import { AnnouncementBar } from "@/components/AnnouncementBar";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { StickyContactBar } from "@/components/StickyContactBar";
import { ProductBrowser } from "@/components/ProductBrowser";
import { SITE_URL } from "@/lib/site";

const BRANCH_SLUG = "panglao";
const BASE_PATH = process.env.NEXT_PUBLIC_PANGLAO_PATH || "/panglao";

type Params = Promise<{ category: string }>;

/** Every category the branch advertises gets a page, built at request time. */
export async function generateStaticParams() {
  const branch = getBranch(BRANCH_SLUG);
  return (branch?.featuredCategories ?? []).map((c) => ({
    category: categorySlug(c.label),
  }));
}

async function resolve(params: Params) {
  const branch = getBranch(BRANCH_SLUG);
  if (!branch) return null;

  const { category: slug } = await params;
  const labels = branch.featuredCategories.map((c) => c.label);
  const label = categoryFromSlug(slug, labels);
  if (!label) return null;

  const card = branch.featuredCategories.find((c) => c.label === label)!;
  const catalog = await getBranchCatalog(branch);
  const products = catalog.products.filter((p) => p.category === label);

  return { branch, label, card, products, catalog };
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const found = await resolve(params);
  if (!found) return {};

  const { label, card, products } = found;
  const path = categoryPath(BASE_PATH, label);

  // Hand-written per category in data/seo.ts — a search result has to say the
  // thing and the place, and a template cannot do that as well as a sentence
  // someone wrote. The fallbacks keep a new category from shipping blank.
  const seo = getCategorySeo(label);
  const title = seo?.title ?? `${label} in Panglao, Bohol`;
  const description =
    seo?.description ??
    `${card.blurb} ${products.length} products at The Sausage Guy in Panglao, Bohol, with counter prices and today's stock.`;

  /*
   * Share image. Where the category has a photograph of its own, use it
   * rather than the shop-wide hero: most traffic here arrives as a link
   * pasted into Messenger, and a link to Sausages that previews as sausages
   * is worth more than the same counter shot fourteen times over.
   */
  const image = hasCategoryPhoto(card.slug)
    ? {
        url: `${SITE_URL}${categoryImageSrc(card.slug)}`,
        width: 1200,
        height: 900,
      }
    : {
        url: `${SITE_URL}/branches/panglao-hero.jpg`,
        width: 1536,
        height: 1024,
      };

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: `${title} | The Sausage Guy`,
      description,
      url: `${SITE_URL}${path}`,
      type: "website",
      locale: "en_PH",
      images: [{ ...image, alt: `${label} at The Sausage Guy, Panglao` }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image.url],
    },
  };
}

export default async function CategoryPage({ params }: { params: Params }) {
  const found = await resolve(params);
  if (!found) notFound();

  const { branch, label, card, products, catalog } = found;
  const content = getCategoryContent(label);
  const path = categoryPath(BASE_PATH, label);

  /*
   * Structured data: a breadcrumb so the category shows its place in search
   * results, and an ItemList of the products with prices and availability.
   * Both describe what is actually on the page — nothing is asserted here
   * that a visitor cannot see.
   */
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: branch.name,
            item: `${SITE_URL}${BASE_PATH}`,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: label,
            item: `${SITE_URL}${path}`,
          },
        ],
      },
      {
        "@type": "ItemList",
        name: `${label} at ${branch.name}`,
        numberOfItems: products.length,
        itemListElement: products.slice(0, 50).map((p, i) => ({
          "@type": "ListItem",
          position: i + 1,
          item: {
            "@type": "Product",
            name: p.productName,
            category: label,
            ...(p.image ? { image: `${SITE_URL}${p.image}` } : {}),
            ...(p.price !== undefined
              ? {
                  offers: {
                    "@type": "Offer",
                    price: p.price,
                    priceCurrency: p.currency ?? "PHP",
                    availability:
                      p.stock?.status === "out"
                        ? "https://schema.org/OutOfStock"
                        : "https://schema.org/InStock",
                    seller: { "@type": "Store", name: branch.name },
                  },
                }
              : {}),
          },
        })),
      },
    ],
  };

  return (
    <div className="atmosphere">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AnnouncementBar branch={branch} />
      <Header branch={branch} basePath={BASE_PATH} />

      <main id="main" className="pb-24 md:pb-0">
        <CategoryHero
          branch={branch}
          label={label}
          slug={card.slug}
          lede={content?.lede ?? card.blurb}
          count={products.length}
          basePath={BASE_PATH}
        />

        <ProductBrowser
          products={forClient(products)}
          syncedAt={catalog.syncedAt}
          showChips={false}
          heading={{
            eyebrow: `${products.length} in ${label.toLowerCase()}`,
            title: `Everything in ${label}`,
            intro:
              "Prices and stock come straight from the counter — message us to set anything aside.",
          }}
        />

        {content && <CategoryArticle label={label} content={content} />}

        <RelatedAisles branch={branch} label={label} basePath={BASE_PATH} />
      </main>

      <Footer branch={branch} basePath={BASE_PATH} />
      <StickyContactBar branch={branch} />
    </div>
  );
}
