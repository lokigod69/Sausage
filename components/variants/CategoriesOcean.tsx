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
 * OCEAN PEARL — beach-lounge horizontal categories.
 * Large card blocks arranged with breezy gaps. Glassmorphic details,
 * pearl-colored drop shadows, and subtle oceanic accent indicators.
 */
export function CategoriesOcean({
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
    <section className="section bg-[var(--bg-2)] relative overflow-hidden" aria-label="Product categories">
      {/* Decorative underwater light beams */}
      <div
        className="absolute top-0 left-1/4 h-[35rem] w-[1px] opacity-20 -rotate-45"
        style={{
          background: "linear-gradient(to bottom, var(--accent) 0%, transparent 100%)",
        }}
      />
      <div
        className="absolute top-10 left-1/3 h-[40rem] w-[2px] opacity-10 -rotate-45"
        style={{
          background: "linear-gradient(to bottom, var(--accent-2) 0%, transparent 100%)",
        }}
      />

      <div className="wrap relative">
        <SectionHeading
          eyebrow="Gourmet Aisles"
          title="Resort Counters"
          intro="Specially curated categories, stocked fresh. Select a counter to browse today's catalog."
        />

        {/* Horizontal scroll container on mobile, flex grid on desktop */}
        <div className="no-scrollbar mt-10 flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory md:grid md:grid-cols-2 lg:grid-cols-3 md:overflow-x-visible">
          {cards.map((card, i) => (
            <a
              key={card.slug}
              href="#products"
              data-target-category={resolveTarget(card)}
              className="card card-hover group reveal flex min-h-[300px] w-[290px] shrink-0 snap-center flex-col justify-between sm:w-auto"
              style={{
                animationDelay: `${i * 60}ms`,
                background: "color-mix(in oklab, var(--surface) 60%, transparent)",
                border: "1px solid var(--line-strong)",
                boxShadow: "0 10px 30px -15px rgb(0 0 0 / 0.3)",
              }}
            >
              <CategoryPhoto
                slug={card.slug}
                label={card.label}
                sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 290px"
                priority={i < 2}
                className="aspect-[4/3] w-full"
              />
              <div className="flex flex-1 flex-col justify-between p-5 sm:p-6">
                <div>
                <div className="mb-4 flex items-center justify-between">
                  <span
                    className="grid h-12 w-12 place-items-center rounded-full font-display text-xl font-bold transition-transform duration-500 group-hover:rotate-[360deg]"
                    style={{
                      background: "radial-gradient(circle, var(--surface-2) 40%, var(--bg) 100%)",
                      border: "1.5px solid var(--accent)",
                      color: "var(--accent)",
                      boxShadow: "0 4px 12px -3px color-mix(in oklab, var(--accent) 50%, transparent)",
                    }}
                  >
                    {card.label.charAt(0)}
                  </span>
                  <span
                    className="rounded-full px-2.5 py-0.5 text-[0.72rem] font-semibold tracking-wider uppercase"
                    style={{
                      background: "color-mix(in oklab, var(--accent-2) 14%, transparent)",
                      color: "var(--accent-2)",
                    }}
                  >
                    {card.count} items
                  </span>
                </div>

                <span
                  className="font-display text-2xl font-semibold leading-tight block tracking-tightish transition-colors group-hover:text-[var(--accent)]"
                  style={{ color: "var(--text-strong)" }}
                >
                  {card.label}
                </span>

                <span
                  className="mt-2 block text-sm leading-relaxed"
                  style={{ color: "var(--muted)" }}
                >
                  {card.blurb}
                </span>
              </div>

              <div className="mt-6 flex items-center justify-between border-t pt-4" style={{ borderColor: "var(--line)" }}>
                <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--faint)" }}>
                  Browse Section
                </span>
                <span
                  className="grid h-8 w-8 place-items-center rounded-full transition-all duration-300 group-hover:translate-x-1 group-hover:bg-[var(--accent)] group-hover:text-[var(--on-accent)]"
                  style={{
                    border: "1px solid var(--line-strong)",
                    color: "var(--accent)",
                  }}
                >
                  <ArrowUpRight width={14} height={14} />
                </span>
              </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
