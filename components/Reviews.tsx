import type { Branch } from "@/lib/types";
import { getReviewQuotes } from "@/data/reviews";
import { SectionHeading } from "./SectionHeading";
import { StarIcon, ArrowUpRight } from "./icons";

/**
 * Social-proof section. Aggregate rating + count are real (from the Branch).
 * Quote cards come from data/reviews.ts (placeholders until real text is added)
 * and only render if present. Always links out to the live Google listing.
 */
export function Reviews({ branch }: { branch: Branch }) {
  if (!branch.rating || !branch.reviewCount) return null;
  const quotes = getReviewQuotes(branch.slug);
  const reviewsUrl = branch.reviewsUrl ?? "#";

  return (
    <section
      id="reviews"
      className="section scroll-mt-20"
      aria-label="Customer reviews"
    >
      <div className="wrap">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeading eyebrow="Loved locally" title="What our customers say" />
          <div className="flex items-center gap-4">
            <div>
              <div
                className="flex items-center gap-0.5"
                style={{ color: "var(--accent)" }}
                aria-hidden
              >
                {Array.from({ length: 5 }).map((_, i) => (
                  <StarIcon key={i} width={20} height={20} />
                ))}
              </div>
              <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
                <span
                  className="font-semibold"
                  style={{ color: "var(--text-strong)" }}
                >
                  {branch.rating.toFixed(1)}
                </span>{" "}
                · {branch.reviewCount} reviews
              </p>
            </div>
          </div>
        </div>

        {quotes.length > 0 && (
          <div
            className="no-scrollbar mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2"
            style={{ scrollPaddingLeft: "1px" }}
            role="list"
            aria-label="Customer reviews"
          >
            {quotes.map((r, i) => (
              <figure
                key={i}
                role="listitem"
                className="card flex shrink-0 snap-start flex-col p-6"
                style={{ width: "min(85vw, 360px)" }}
              >
                <div
                  className="mb-3 flex items-center gap-0.5"
                  style={{ color: "var(--accent)" }}
                  aria-hidden
                >
                  {Array.from({ length: 5 }).map((_, s) => (
                    <StarIcon key={s} width={15} height={15} />
                  ))}
                </div>
                <blockquote
                  className="font-display flex-1 text-lg leading-snug"
                  style={{ color: "var(--text-strong)" }}
                >
                  &ldquo;{r.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-5">
                  <span
                    className="block text-sm font-semibold"
                    style={{ color: "var(--text)" }}
                  >
                    {r.author}
                  </span>
                  {r.meta && (
                    <span
                      className="block text-xs"
                      style={{ color: "var(--faint)" }}
                    >
                      {r.meta}
                    </span>
                  )}
                </figcaption>
              </figure>
            ))}
          </div>
        )}

        {quotes.length > 0 && (
          <p className="mt-3 text-xs" style={{ color: "var(--faint)" }}>
            Swipe to read more →
          </p>
        )}

        <a
          href={reviewsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-ghost mt-8"
        >
          Read all {branch.reviewCount} reviews on Google
          <ArrowUpRight width={16} height={16} />
        </a>
      </div>
    </section>
  );
}
