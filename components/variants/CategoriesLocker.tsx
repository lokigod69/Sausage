import type { Branch, Product } from "@/lib/types";
import {
  getCategories,
  getFeaturedCategoryCards,
  matchesFeatured,
} from "@/lib/products";
import { SectionHeading } from "../SectionHeading";

/**
 * LOCKER — compartment grid. Dense, sharp-cornered tiles laid out like locker
 * doors, with mono item counts and a hover "OPEN" cue. Utilitarian.
 */
export function CategoriesLocker({
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
          eyebrow="Browse the locker"
          title="Compartments"
          intro="Ten counters, stocked daily. Open a compartment to see everything inside."
        />

        <div className="mt-9 grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4">
          {cards.map((card, i) => (
            <a
              key={card.slug}
              href="#products"
              data-target-category={resolveTarget(card)}
              className="card card-hover group relative flex flex-col justify-between p-4 reveal"
              style={{ minHeight: 132, animationDelay: `${i * 40}ms` }}
            >
              <div className="flex items-start justify-between">
                <span
                  className="mono text-xs"
                  style={{ color: "var(--faint)" }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span
                  className="mono rounded px-1.5 py-0.5 text-xs"
                  style={{
                    background: "color-mix(in oklab, var(--accent) 16%, transparent)",
                    color: "var(--accent-strong)",
                  }}
                >
                  {String(card.count).padStart(2, "0")}
                </span>
              </div>
              <div>
                <span
                  className="font-display block text-lg font-semibold leading-tight"
                  style={{ color: "var(--text-strong)" }}
                >
                  {card.label}
                </span>
                <span
                  className="mono mt-1 block text-[0.68rem] uppercase tracking-wider opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  style={{ color: "var(--accent)" }}
                >
                  Open →
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
