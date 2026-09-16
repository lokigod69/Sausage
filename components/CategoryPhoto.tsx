import Image from "next/image";
import { getCategoryAlt, hasCategoryPhoto } from "@/data/category-images";

export function categoryImageSrc(slug: string): string {
  return `/products/${slug}.jpg`;
}

/**
 * Stand-in for a category the shop has no photograph of yet — eight of the
 * fourteen. A tinted panel in the shop's own accent, with the fact stated
 * rather than left to be guessed: an empty coloured box reads as a broken
 * image, and "Photo coming soon" reads as a shop that has not got round to it
 * yet, which is the truth.
 *
 * The label is hidden at thumbnail sizes, where there is no room for it and
 * the silhouette already does the job; it always reaches a screen reader.
 */
function CategoryFallback({
  label,
  className,
  showLabel,
}: {
  label: string;
  className: string;
  showLabel: boolean;
}) {
  return (
    <span
      className={`relative grid place-items-center overflow-hidden ${className}`}
      style={{
        background:
          "linear-gradient(160deg, color-mix(in oklab, var(--accent) 14%, var(--surface)), var(--surface))",
      }}
      role="img"
      aria-label={`${label} — photo coming soon`}
      title={`${label} — photo coming soon`}
    >
      {showLabel ? (
        /*
          Bottom-right, not centred: on a category page the copy panel covers
          the middle-left of this tile, and a centred line came out as a stray
          fragment peeking from behind it. Down here it reads as a caption.
        */
        <span
          aria-hidden
          className="mono absolute bottom-4 right-5 text-[0.62rem] uppercase tracking-[0.18em]"
          style={{ color: "var(--accent-ink)", opacity: 0.75 }}
        >
          Photo coming soon
        </span>
      ) : (
        /* Too small for the words — the initial, the same mark the product
           thumbnails use, so a mixed grid keeps one rhythm. */
        <span
          aria-hidden
          className="font-display text-[1.4rem] font-semibold"
          style={{ color: "var(--accent-ink)", opacity: 0.55 }}
        >
          {label.charAt(0)}
        </span>
      )}
    </span>
  );
}

export function CategoryPhoto({
  slug,
  label,
  className = "",
  sizes,
  priority = false,
  /** Set false for thumbnails, where the "photo coming soon" line will not fit. */
  showFallbackLabel = true,
}: {
  slug: string;
  label: string;
  className?: string;
  sizes: string;
  priority?: boolean;
  showFallbackLabel?: boolean;
}) {
  const alt = getCategoryAlt(label, slug);

  if (!hasCategoryPhoto(slug)) {
    return (
      <CategoryFallback
        label={label}
        className={className}
        showLabel={showFallbackLabel}
      />
    );
  }

  return (
    <span className={`relative block overflow-hidden bg-[var(--surface-2)] ${className}`}>
      {/*
        A real alt, not an empty one. The card beside it carries the category
        name, so this could have been decorative — but it is the only text a
        search engine ever gets for the picture, and a blind visitor deciding
        whether a shop looks like it knows what it is doing deserves to be
        told what is in the photograph, the same as everyone else.
      */}
      <Image
        src={categoryImageSrc(slug)}
        alt={alt}
        title={alt}
        fill
        priority={priority}
        sizes={sizes}
        className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
      />
      <span
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background:
            "linear-gradient(180deg, rgb(0 0 0 / 0.02), rgb(0 0 0 / 0.28))",
        }}
      />
    </span>
  );
}
