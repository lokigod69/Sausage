import type { Branch, Product } from "@/lib/types";
import {
  getCategories,
  getFeaturedCategoryCards,
  matchesFeatured,
} from "@/lib/products";
import { SectionHeading } from "../SectionHeading";
import { CategoryPhoto } from "../CategoryPhoto";

/**
 * FUEGO GRILL — hot coals iron-grate board.
 * Bold, industrial tiles structured with thick frames and strong borders.
 * Sharp-corners, red/orange active glows on hover, and stencil lettering.
 */
export function CategoriesFuego({
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
      {/* Decorative charcoal soot glows */}
      <div
        className="pointer-events-none absolute bottom-0 right-10 h-72 w-72 rounded-full opacity-10 blur-3xl"
        style={{
          background: "radial-gradient(circle, var(--accent-2) 0%, transparent 70%)",
        }}
      />

      <div className="wrap relative">
        <SectionHeading
          eyebrow="Pit Divisions"
          title="On the Grate"
          intro="Smoked meats, deli items, and steaks cataloged by category. Select a section to show all items."
        />

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card, i) => (
            <a
              key={card.slug}
              href="#products"
              data-target-category={resolveTarget(card)}
              className="card card-hover group reveal flex min-h-[260px] flex-col justify-between"
              style={{
                animationDelay: `${i * 50}ms`,
                background: "var(--surface)",
                borderColor: "var(--line-strong)",
                borderWidth: "2px",
                borderRadius: "var(--radius)",
                boxShadow: "4px 4px 0px color-mix(in oklab, var(--line) 40%, black)",
              }}
            >
              <CategoryPhoto
                slug={card.slug}
                label={card.label}
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                priority={i < 2}
                className="aspect-[16/9] w-full"
              />
              <div className="flex flex-1 flex-col justify-between p-5 sm:p-6">
              <div className="flex justify-between items-start">
                <span
                  className="mono text-sm font-black border-b-2 pb-0.5 leading-none"
                  style={{
                    borderColor: "var(--accent)",
                    color: "var(--accent)",
                  }}
                >
                  #{String(i + 1).padStart(2, "0")}
                </span>
                <span
                  className="mono text-xs px-2 py-0.5 font-bold"
                  style={{
                    background: "color-mix(in oklab, var(--accent) 14%, transparent)",
                    color: "var(--accent-strong)",
                    border: "1px solid var(--line-strong)",
                  }}
                >
                  {String(card.count).padStart(2, "0")} items
                </span>
              </div>

              <div className="mt-4">
                <span
                  className="font-display block text-xl font-bold uppercase tracking-tight transition-colors group-hover:text-[var(--accent)]"
                  style={{ color: "var(--text-strong)" }}
                >
                  {card.label}
                </span>
                <span
                  className="mt-1 block text-sm leading-snug"
                  style={{ color: "var(--muted)" }}
                >
                  {card.blurb}
                </span>
              </div>

              <div className="mt-4 pt-3 flex justify-end">
                <span
                  className="mono text-[10px] font-black uppercase tracking-widest text-[var(--faint)] group-hover:text-[var(--accent)] transition-colors"
                >
                  OPEN SECTION &raquo;
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
