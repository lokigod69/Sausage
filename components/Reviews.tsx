import type { Branch } from "@/lib/types";
import { getBranchReviews } from "@/lib/reviews";
import { SectionHeading } from "./SectionHeading";
import { StarIcon, ArrowUpRight } from "./icons";

/**
 * Social-proof section. Rating, count and quotes come from `lib/reviews.ts`:
 * the Google sync when it has run, the hand-kept file otherwise. Quotes from
 * Google are shown verbatim and credited to their author, which is what
 * Google's terms require in exchange for the right to display them.
 */
export function Reviews({ branch }: { branch: Branch }) {
  const { rating, reviewCount, quotes, fromGoogle, ...rest } =
    getBranchReviews(branch);
  if (!rating || !reviewCount) return null;
  const reviewsUrl = rest.reviewsUrl ?? "#";

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
                  {rating.toFixed(1)}
                </span>{" "}
                · {reviewCount} reviews
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
                {/* The stars this reviewer gave, not a decorative five. */}
                <div
                  className="mb-3 flex items-center gap-0.5"
                  style={{ color: "var(--accent)" }}
                  aria-label={`${Math.round(r.rating ?? 5)} out of 5 stars`}
                >
                  {Array.from({ length: Math.round(r.rating ?? 5) }).map((_, s) => (
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
                  {/* Google requires the reviewer to be credited, and linked
                      back to their profile where it gives us one. */}
                  {r.authorUri ? (
                    <a
                      href={r.authorUri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-sm font-semibold underline-offset-2 hover:underline"
                      style={{ color: "var(--text)" }}
                    >
                      {r.author}
                    </a>
                  ) : (
                    <span
                      className="block text-sm font-semibold"
                      style={{ color: "var(--text)" }}
                    >
                      {r.author}
                    </span>
                  )}
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
            {/* Attribution is required whenever Places data is displayed. */}
            {fromGoogle && <span> · Reviews from Google</span>}
          </p>
        )}

        <a
          href={reviewsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-ghost mt-8"
        >
          Read all {reviewCount} reviews on Google
          <ArrowUpRight width={16} height={16} />
        </a>
      </div>
    </section>
  );
}
