import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getBranch } from "@/data/branches";
import { getBranchCatalog } from "@/lib/catalog";
import { categoryFromSlug, categorySlug, categoryPath } from "@/lib/routes";
import { getCategoryContent } from "@/data/category-content";
import { getCategorySeo } from "@/data/seo";
import { CategoryHero } from "@/components/CategoryHero";
import { CategoryArticle } from "@/components/CategoryArticle";
import { AnnouncementBar } from "@/components/AnnouncementBar";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { StickyContactBar } from "@/components/StickyContactBar";
import { ProductBrowser } from "@/components/ProductBrowser";
import { ArrowUpRight } from "@/components/icons";

const BRANCH_SLUG = "panglao";
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://www.thesausageguy.shop";
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
    },
    twitter: { card: "summary_large_image", title, description },
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

      <main className="pb-24 md:pb-0">
        <CategoryHero
          branch={branch}
          label={label}
          slug={card.slug}
          lede={content?.lede ?? card.blurb}
          count={products.length}
          basePath={BASE_PATH}
        />

        <ProductBrowser
          products={products}
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

        <section className="section">
          <div className="wrap">
            <Link href={BASE_PATH} className="btn btn-ghost">
              Back to all categories
              <ArrowUpRight width={17} height={17} />
            </Link>
          </div>
        </section>
      </main>

      <Footer branch={branch} />
      <StickyContactBar branch={branch} />
    </div>
  );
}
