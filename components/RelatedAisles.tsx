import Link from "next/link";
import type { Branch } from "@/lib/types";
import { getRelatedAisles } from "@/data/related-aisles";
import { categoryPath } from "@/lib/routes";
import { CategoryPhoto } from "./CategoryPhoto";
import { ArrowUpRight, MessengerIcon } from "./icons";
import { branchLinks } from "@/lib/contact";

/**
 * "What goes with this" at the foot of a category page.
 *
 * The three links come from data/related-aisles.ts, each with a reason that
 * only makes sense from this page. The delivery line underneath is here
 * because the delivery section lives on the branch page, and someone who has
 * read to the bottom of an article about steaks is exactly the person who
 * needs to know they do not have to drive to Bolod to get one.
 */
export function RelatedAisles({
  branch,
  label,
  basePath,
}: {
  branch: Branch;
  label: string;
  basePath: string;
}) {
  const related = getRelatedAisles(label);
  const links = branchLinks(branch);

  // Match each related label back to its card, for the photo and the slug.
  const cards = related
    .map((item) => {
      const card = branch.featuredCategories.find((c) => c.label === item.label);
      return card ? { ...item, slug: card.slug } : undefined;
    })
    .filter((c): c is NonNullable<typeof c> => c !== undefined);

  return (
    <section className="section" aria-label="Related aisles">
      <div className="wrap">
        <h2
          className="font-display text-[clamp(1.5rem,3vw,2rem)] font-semibold tracking-tightish"
          style={{ color: "var(--text-strong)" }}
        >
          What goes with this
        </h2>

        {cards.length > 0 && (
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {cards.map((card) => (
              <Link
                key={card.label}
                href={categoryPath(basePath, card.label)}
                className="card card-hover group flex gap-4 p-3.5 pr-4"
              >
                <CategoryPhoto
                  slug={card.slug}
                  label={card.label}
                  sizes="88px"
                  showFallbackLabel={false}
                  className="h-[72px] w-[72px] flex-shrink-0 rounded-[calc(var(--radius)-6px)]"
                />
                <span className="min-w-0 self-center">
                  <span
                    className="flex items-center gap-1.5 font-semibold"
                    style={{ color: "var(--text-strong)" }}
                  >
                    {card.label}
                    <ArrowUpRight
                      width={15}
                      height={15}
                      aria-hidden
                      style={{ color: "var(--accent)" }}
                    />
                  </span>
                  <span
                    className="mt-1 block text-sm leading-snug"
                    style={{ color: "var(--muted)" }}
                  >
                    {card.why}
                  </span>
                </span>
              </Link>
            ))}
          </div>
        )}

        <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3">
          <Link href={basePath} className="btn btn-ghost">
            All {branch.featuredCategories.length} aisles
            <ArrowUpRight width={17} height={17} />
          </Link>
          <p className="text-sm" style={{ color: "var(--muted)" }}>
            Can&rsquo;t come to Bolod?{" "}
            <Link
              href={`${basePath}#delivery`}
              style={{ color: "var(--accent-ink)", textDecoration: "underline" }}
            >
              We deliver by Maxim
            </Link>{" "}
            across Panglao, Dauis and Tagbilaran — or just{" "}
            <a
              href={links.messenger}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1"
              style={{ color: "var(--accent-ink)", textDecoration: "underline" }}
            >
              <MessengerIcon width={14} height={14} aria-hidden />
              message us
            </a>
            .
          </p>
        </div>
      </div>
    </section>
  );
}
