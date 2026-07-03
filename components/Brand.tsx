import Image from "next/image";
import type { CSSProperties } from "react";

/**
 * Brand wordmark. The site ships explicit transparent dark and light lockups
 * so the logo stays crisp on both parchment and dark editorial themes.
 * Both render (CSS picks one per variant), but only the visible tone is
 * allowed to preload — otherwise two 1800px PNGs fight for priority.
 */
const DARK_SRC = "/brand/logo-lockup-dark.png";
const LIGHT_SRC = "/brand/logo-lockup-light.png";

// Intrinsic ratio of logo-lockup-*.png (1800 x 679).
const RATIO = 1800 / 679;

const HEIGHTS = { sm: 46, md: 64, header: 92, lg: 150, hero: 190 } as const;

export function Brand({
  size = "md",
  showBadge = false,
  priority = false,
  tone,
}: {
  size?: keyof typeof HEIGHTS;
  showBadge?: boolean;
  priority?: boolean;
  /** Which lockup the active variant displays (for preload targeting). */
  tone?: "dark" | "light";
}) {
  const h = HEIGHTS[size];
  const w = Math.round(h * RATIO);
  const style = {
    "--brand-w": `${w}px`,
  } as CSSProperties;

  return (
    <span
      className={`brand-lockup brand-lockup--${size} inline-flex items-center gap-3`}
      role="img"
      aria-label="The Sausage Guy"
    >
      <span className="brand-logo-frame" style={style} aria-hidden="true">
        <Image
          src={DARK_SRC}
          alt=""
          fill
          sizes={`${w}px`}
          priority={priority && tone !== "light"}
          loading={tone === "light" ? "lazy" : undefined}
          className="brand-logo brand-logo--dark"
        />
        <Image
          src={LIGHT_SRC}
          alt=""
          fill
          sizes={`${w}px`}
          priority={priority && tone !== "dark"}
          loading={tone === "dark" ? "lazy" : undefined}
          className="brand-logo brand-logo--light"
        />
      </span>
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
