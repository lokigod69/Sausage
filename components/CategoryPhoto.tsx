import Image from "next/image";
import { hasCategoryPhoto } from "@/data/category-images";

export function categoryImageSrc(slug: string): string {
  return `/products/${slug}.jpg`;
}

/**
 * Stand-in for a category the shop has no photograph of yet — eight of the
 * fourteen. A tinted panel in the variant's own accent, which reads as a
 * considered placeholder rather than a broken image. The card prints the
 * label and count over it, so it is never a blank tile.
 */
function CategoryFallback({
  label,
  className,
}: {
  label: string;
  className: string;
}) {
  return (
    <span
      className={`relative grid place-items-center overflow-hidden ${className}`}
      style={{
        background:
          "linear-gradient(160deg, color-mix(in oklab, var(--accent) 14%, var(--surface)), var(--surface))",
      }}
      aria-hidden
    >
      <span className="sr-only">{label}</span>
    </span>
  );
}

export function CategoryPhoto({
  slug,
  label,
  className = "",
  sizes,
  priority = false,
}: {
  slug: string;
  label: string;
  className?: string;
  sizes: string;
  priority?: boolean;
}) {
  if (!hasCategoryPhoto(slug)) {
    return <CategoryFallback label={label} className={className} />;
  }

  return (
    <span
      className={`relative block overflow-hidden bg-[var(--surface-2)] ${className}`}
      aria-hidden
    >
      <Image
        src={categoryImageSrc(slug)}
        alt=""
        fill
        priority={priority}
        sizes={sizes}
        className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
      />
      <span
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgb(0 0 0 / 0.02), rgb(0 0 0 / 0.28))",
        }}
      />
      <span className="sr-only">{label}</span>
    </span>
  );
}
