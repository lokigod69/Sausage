import type { Branch, Product } from "@/lib/types";
import {
  getCategories,
  getFeaturedCategoryCards,
  matchesFeatured,
} from "@/lib/products";
import { SectionHeading } from "../SectionHeading";
import { ArrowUpRight } from "../icons";

/**
 * NOIR — editorial index. A numbered list (01–08) with big serif names and
 * hairline dividers, like a magazine contents page. No image tiles.
 */
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
    <section className="section" aria-label="Product categories">
      <div className="wrap">
        <SectionHeading
          eyebrow="What we carry"
          title="The counters"
          intro="From German-style sausages to frozen Pacific salmon. Select a counter to jump into the full list."
        />

        <ol className="mt-10" style={{ borderTop: "1px solid var(--line)" }}>
          {cards.map((card, i) => (
            <li key={card.slug}>
              <a
                href="#products"
                data-target-category={resolveTarget(card)}
                className="group grid grid-cols-[auto_1fr_auto] items-center gap-5 py-6 transition-colors sm:gap-8"
                style={{ borderBottom: "1px solid var(--line)" }}
              >
                <span
                  className="font-display text-2xl font-semibold tabular-nums sm:text-3xl"
                  style={{ color: "var(--accent)" }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="min-w-0">
                  <span className="flex flex-wrap items-baseline gap-x-3">
                    <span
                      className="font-display text-2xl font-semibold leading-tight tracking-tightish sm:text-4xl"
                      style={{ color: "var(--text-strong)" }}
                    >
                      {card.label}
                    </span>
                    <span
                      className="text-sm"
                      style={{ color: "var(--faint)" }}
                    >
                      {card.count} item{card.count === 1 ? "" : "s"}
                    </span>
                  </span>
                  <span
                    className="mt-1 block max-w-xl text-sm leading-snug sm:text-base"
                    style={{ color: "var(--muted)" }}
                  >
                    {card.blurb}
                  </span>
                </span>
                <span
                  className="grid h-11 w-11 place-items-center rounded-full transition-all duration-300 group-hover:translate-x-1"
                  style={{
                    border: "1px solid var(--line-strong)",
                    color: "var(--accent)",
                  }}
                >
                  <ArrowUpRight width={18} height={18} />
                </span>
              </a>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
