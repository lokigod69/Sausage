import type { Branch, Product } from "@/lib/types";
import {
  getCategories,
  getFeaturedCategoryCards,
  matchesFeatured,
} from "@/lib/products";
import { CategoryPhoto } from "../CategoryPhoto";
import { ArrowUpRight } from "../icons";

/**
 * Fable Atelier categories: an asymmetric editorial plate grid. The first
 * two categories run wide like gallery pieces; the rest sit in a tighter
 * three-column rhythm. Numbered like a tasting menu, with a copper sweep
 * on hover. Clicking a plate filters the product browser below.
 */
export function CategoriesFable({
  branch,
  products,
}: {
  branch: Branch;
  products: Product[];
}) {
  const cards = getFeaturedCategoryCards(branch, products);
  const productCategories = getCategories(products);
  const resolveTarget = (card: (typeof cards)[number]) =>
    productCategories.filter((c) => matchesFeatured(card, c)).join(",");

  const lead = cards.slice(0, 2);
  const rest = cards.slice(2);

  return (
    <section className="section" aria-label="Product categories">
      <div className="wrap">
        <div
          className="flex flex-wrap items-end justify-between gap-6"
          data-reveal
        >
          <div className="max-w-2xl">
            <p className="eyebrow">The case</p>
            <h2
              className="font-display balance mt-5 text-[clamp(2rem,4.6vw,3.4rem)] font-medium leading-[1.05]"
              style={{ color: "var(--text-strong)" }}
            >
              Choose your provisions.
            </h2>
          </div>
          <a
            href="#products"
            className="group inline-flex items-center gap-2 pb-1 text-sm font-semibold"
            style={{ color: "var(--accent)" }}
          >
            Browse the full list
            <ArrowUpRight
              width={15}
              height={15}
              className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </a>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {lead.map((card, i) => (
            <Plate
              key={card.slug}
              card={card}
              index={i}
              target={resolveTarget(card)}
              large
            />
          ))}
        </div>
        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((card, i) => (
            <Plate
              key={card.slug}
              card={card}
              index={i + lead.length}
              target={resolveTarget(card)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function Plate({
  card,
  index,
  target,
  large = false,
}: {
  card: ReturnType<typeof getFeaturedCategoryCards>[number];
  index: number;
  target: string;
  large?: boolean;
}) {
  return (
    <a
      href="#products"
      data-target-category={target}
      className="fable-plate group"
      data-reveal
      style={
        { "--reveal-delay": `${(index % 3) * 110}ms` } as React.CSSProperties
      }
      aria-label={`${card.label} — ${card.count} items`}
    >
      <span className="relative block">
        <CategoryPhoto
          slug={card.slug}
          label={card.label}
          sizes={
            large
              ? "(min-width: 640px) 50vw, 92vw"
              : "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 92vw"
          }
          priority={index < 2}
          className={`${large ? "aspect-[16/11] sm:aspect-[16/10]" : "aspect-[4/3]"} w-full`}
        />
        {/* Charcoal wash so type sits on the photograph. */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgb(18 16 13 / 0.18), transparent 38%, rgb(18 16 13 / 0.82) 100%)",
          }}
        />
        <span
          aria-hidden
          className="mono absolute left-4 top-4 text-[0.66rem] tracking-[0.22em]"
          style={{ color: "rgb(247 239 225 / 0.85)" }}
        >
          {String(index + 1).padStart(2, "0")}
        </span>

        <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 sm:p-6">
          <span className="min-w-0">
            <span
              className={`font-display block font-medium leading-tight text-[var(--text-strong)] ${
                large ? "text-[clamp(1.5rem,2.6vw,2.1rem)]" : "text-xl"
              }`}
              style={{ color: "#f7efe1" }}
            >
              {card.label}
            </span>
            {large && (
              <span
                className="mt-2 hidden max-w-md text-sm leading-snug sm:block"
                style={{ color: "rgb(232 221 205 / 0.78)" }}
              >
                {card.blurb}
              </span>
            )}
          </span>
          <span
            className="mono flex-shrink-0 whitespace-nowrap text-[0.68rem] uppercase tracking-[0.18em]"
            style={{ color: "var(--accent-strong)" }}
          >
            {card.count} item{card.count === 1 ? "" : "s"}
          </span>
        </span>
      </span>
    </a>
  );
}
