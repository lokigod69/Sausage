import Image from "next/image";
import type { Branch } from "@/lib/types";
import { CategoryPhoto } from "../CategoryPhoto";

const CRAFTED_ITEMS = [
  {
    label: "Steaks & Beef",
    src: "/silhouettes/noir-beef.svg",
    bullets: ["Angus counter cuts", "Ribeye and tenderloin", "Ask what landed today"],
  },
  {
    label: "Sausages",
    src: "/silhouettes/noir-sausages.svg",
    bullets: ["German-style links", "Franks and bangers", "Freezer-ready packs"],
  },
  {
    label: "Poultry",
    src: "/silhouettes/noir-poultry.svg",
    bullets: ["Chicken, duck and turkey", "Daily pantry cuts", "Simple meal prep"],
  },
  {
    label: "Seafood & Salmon",
    src: "/silhouettes/noir-seafood.svg",
    bullets: ["Pacific salmon", "Whole and portioned", "Frozen for island stock"],
  },
  {
    label: "Hams & Deli",
    src: "/silhouettes/noir-deli.svg",
    bullets: ["Ham, bacon and salami", "Cold-cut favorites", "Charcuterie basics"],
  },
  {
    label: "Cheese & Dairy",
    src: "/silhouettes/noir-cheese.svg",
    bullets: ["Cheese-counter staples", "Pairings for deli goods", "Limited stock changes"],
  },
];

export function NoirProvisionsStory({ branch }: { branch: Branch }) {
  return (
    <section className="section pt-12 sm:pt-16" aria-label="Noir provisions story">
      <div className="wrap">
        <div className="mx-auto max-w-3xl text-center">
          <p className="font-display text-[clamp(1.25rem,2.5vw,1.7rem)] font-semibold leading-tight" style={{ color: "var(--text-strong)" }}>
            Premium meats. Deli goods. Ready in {branch.locality}.{" "}
            <span className="italic" style={{ color: "var(--accent)" }}>
              Daily.
            </span>
          </p>
        </div>

        <div className="mt-14 space-y-14 sm:mt-20 sm:space-y-20">
          <StoryRow
            slug="todays-pick"
            label="Today's pick"
            eyebrow="Your local counter"
            title="Butcher-shop stock without the warehouse look."
          >
            The page stays informational, but the experience should feel like a
            premium provisions counter: clear categories, honest availability,
            and one quick message before visiting Dason Store.
          </StoryRow>

          <StoryRow
            slug="steaks-beef"
            label="Steaks and beef"
            eyebrow="Handled for everyday cooking"
            title="Steaks, sausages, seafood and deli staples in one run."
            reverse
          >
            We keep the visual language calm and product-led: real food
            photography, warm paper, charcoal silhouettes, and no fake labels
            fighting for attention on mobile cards.
          </StoryRow>
        </div>

        <div className="mt-16 text-center sm:mt-20">
          <p className="eyebrow mb-3">Butcher-crafted</p>
          <h2 className="font-display text-[clamp(1.9rem,4vw,3rem)] font-semibold leading-tight tracking-tightish" style={{ color: "var(--text-strong)" }}>
            Panglao-approved provisions.
          </h2>
        </div>

        <div className="mx-auto mt-10 grid max-w-4xl gap-x-10 gap-y-8 sm:grid-cols-2">
          {CRAFTED_ITEMS.map((item) => (
            <article key={item.label} className="grid grid-cols-[5.25rem_1fr] items-center gap-5">
              <span className="relative grid h-20 w-20 place-items-center">
                <Image
                  src={item.src}
                  alt=""
                  width={120}
                  height={86}
                  className="h-auto w-full object-contain"
                />
              </span>
              <span>
                <h3 className="text-base font-semibold" style={{ color: "var(--text-strong)" }}>
                  {item.label}
                </h3>
                <ul className="mt-2 space-y-1 text-sm leading-snug" style={{ color: "var(--muted)" }}>
                  {item.bullets.map((bullet) => (
                    <li key={bullet} className="flex gap-2">
                      <span aria-hidden style={{ color: "var(--accent)" }}>
                        /
                      </span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function StoryRow({
  slug,
  label,
  eyebrow,
  title,
  children,
  reverse = false,
}: {
  slug: string;
  label: string;
  eyebrow: string;
  title: string;
  children: React.ReactNode;
  reverse?: boolean;
}) {
  return (
    <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
      <div className={reverse ? "lg:order-2" : undefined}>
        <CategoryPhoto
          slug={slug}
          label={label}
          sizes="(min-width: 1024px) 520px, 92vw"
          className="mx-auto aspect-[5/4] max-w-[520px] rounded-[var(--radius-lg)] shadow-[var(--shadow)]"
        />
      </div>
      <div className={reverse ? "lg:order-1" : undefined}>
        <p className="eyebrow mb-3">{eyebrow}</p>
        <h2 className="font-display max-w-lg text-[clamp(1.7rem,3.6vw,2.65rem)] font-semibold leading-tight tracking-tightish" style={{ color: "var(--text-strong)" }}>
          {title}
        </h2>
        <p className="mt-4 max-w-xl text-base leading-relaxed sm:text-lg" style={{ color: "var(--muted)" }}>
          {children}
        </p>
      </div>
    </div>
  );
}
