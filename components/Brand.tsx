import Image from "next/image";

/**
 * Brand wordmark — the real logo at /public/brand/logo.png.
 *
 * The asset is a single transparent PNG of the dark line-art lockup. It is
 * recolored per theme in CSS via `.brand-logo` (see globals.css): kept as ink
 * art on the light Golden ground, inverted to bone on the dark Noir/Locker
 * grounds. One asset, three themes, no white box.
 */

// Intrinsic ratio of logo.png (948 x 470).
const RATIO = 948 / 470;

const HEIGHTS = { sm: 36, md: 46, lg: 128 } as const;

export function Brand({
  size = "md",
  showBadge = false,
  priority = false,
}: {
  size?: "sm" | "md" | "lg";
  showBadge?: boolean;
  priority?: boolean;
}) {
  const h = HEIGHTS[size];
  const w = Math.round(h * RATIO);

  return (
    <span className="inline-flex items-center gap-3">
      <Image
        src="/brand/logo.png"
        alt="The Sausage Guy"
        width={w}
        height={h}
        priority={priority}
        className="brand-logo"
        style={{ height: h, width: "auto" }}
      />
      {showBadge && <BranchBadge />}
    </span>
  );
}

export function BranchBadge() {
  return (
    <span
      className="hidden items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold sm:inline-flex"
      style={{
        border: "1px solid var(--line-strong)",
        color: "var(--accent)",
        background: "color-mix(in oklab, var(--surface) 60%, transparent)",
      }}
    >
      <span
        className="inline-block h-1.5 w-1.5 rounded-full"
        style={{ background: "var(--accent)" }}
      />
      Panglao Branch
    </span>
  );
}
