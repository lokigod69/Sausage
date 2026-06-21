import type { Branch, Product } from "@/lib/types";
import {
  getCategories,
  getFeaturedCategoryCards,
  matchesFeatured,
} from "@/lib/products";
import { SectionHeading } from "../SectionHeading";
import { ArrowUpRight } from "../icons";
import { CategoryPhoto } from "../CategoryPhoto";

/**
 * GOLDEN — warm market shelves. Friendly horizontal cards (rounded media
 * plate on the left, text on the right), two-up, with soft shadows on hover.
 */
export function CategoriesGolden({
  branch,
  products,
}: {
  branch: Branch;
  products: Product[];
}) {
  const cards = getFeaturedCategoryCards(branch, products);
  const productCategories = getCategories(products);
  const resolveTarget = (card: (typeof cards)[number]) =>
    productCategories.find((c) => matchesFeatured(card, c)) ?? "";

  return (
    <section className="section" aria-label="Product categories">
      <div className="wrap">
        <SectionHeading
          eyebrow="Fresh on the shelves"
          title="Shop by aisle"
          intro="Everything for the week, from sausages and steaks to ready meals and fresh bakery."
        />

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {cards.map((card, i) => (
            <a
              key={card.slug}
              href="#products"
              data-target-category={resolveTarget(card)}
              className="card card-hover group reveal flex items-center gap-4 p-3.5 pr-5"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <CategoryPhoto
                slug={card.slug}
                label={card.label}
                sizes="(min-width: 640px) 112px, 96px"
                priority={i < 2}
                className="aspect-square w-24 flex-shrink-0 rounded-[calc(var(--radius)-2px)] sm:w-28"
              />
              <span className="min-w-0 flex-1">
                <span className="flex items-center justify-between gap-2">
                  <span
                    className="font-display text-xl font-semibold leading-tight"
                    style={{ color: "var(--text-strong)" }}
                  >
                    {card.label}
                  </span>
                  <ArrowUpRight
                    width={17}
                    height={17}
                    className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    style={{ color: "var(--accent)", flexShrink: 0 }}
                  />
                </span>
                <span
                  className="mt-1 block text-sm leading-snug"
                  style={{ color: "var(--muted)" }}
                >
                  {card.blurb}
                </span>
                <span
                  className="mt-2 inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold"
                  style={{
                    background: "color-mix(in oklab, var(--accent) 16%, transparent)",
                    color: "var(--accent-strong)",
                  }}
                >
                  {card.count} item{card.count === 1 ? "" : "s"}
                </span>
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
