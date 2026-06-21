import Image from "next/image";

export function categoryImageSrc(slug: string): string {
  return `/products/${slug}.jpg`;
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
