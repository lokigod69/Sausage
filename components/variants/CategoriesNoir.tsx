import type { Branch, Product } from "@/lib/types";
import {
  getCategories,
  getFeaturedCategoryCards,
  matchesFeatured,
} from "@/lib/products";
import { SectionHeading } from "../SectionHeading";
import { ArrowUpRight } from "../icons";
import { CategoryPhoto } from "../CategoryPhoto";

export function CategoriesNoir({
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
    <section className="section pt-8" aria-label="Product categories">
      <div className="wrap">
        <SectionHeading
          eyebrow="Browse the counter"
          title="Choose your provisions"
          intro="Jump into sausages, beef, poultry, salmon, deli goods and today's limited stock."
          align="center"
        />

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((card, i) => (
            <a
              key={card.slug}
              href="#products"
              data-target-category={resolveTarget(card)}
              className="group overflow-hidden rounded-[var(--radius)] transition-transform duration-300 hover:-translate-y-1"
              style={{
                background: "var(--surface)",
                border: "1px solid var(--line)",
                boxShadow: "var(--shadow)",
              }}
            >
              <CategoryPhoto
                slug={card.slug}
                label={card.label}
                sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 92vw"
                priority={i < 4}
                className="aspect-[4/3] w-full"
              />
              <span className="block p-4">
                <span className="flex items-start justify-between gap-3">
                  <span
                    className="font-display text-xl font-semibold leading-tight tracking-tightish"
                    style={{ color: "var(--text-strong)" }}
                  >
                    {card.label}
                  </span>
                  <span
                    className="mt-0.5 text-xs font-semibold tabular-nums"
                    style={{ color: "var(--accent)" }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </span>
                <span
                  className="mt-2 block min-h-[3.25rem] text-sm leading-snug"
                  style={{ color: "var(--muted)" }}
                >
                  {card.blurb}
                </span>
                <span
                  className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold"
                  style={{ color: "var(--accent)" }}
                >
                  {card.count} item{card.count === 1 ? "" : "s"}
                  <ArrowUpRight
                    width={14}
                    height={14}
                    className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </span>
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
