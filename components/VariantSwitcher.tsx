import { VARIANTS, VARIANT_META, type Variant } from "@/lib/types";

/**
 * Design-direction switcher, available on every breakpoint.
 *
 * Zero-JS: a <details> popover that opens a list of all variants, each with
 * a two-tone swatch (page ground / accent). Selecting one navigates with
 * ?variant=, which closes the popover naturally. On mobile it floats above
 * the sticky contact bar; on desktop it sits bottom-left.
 */

const SWATCHES: Record<Variant, { bg: string; accent: string }> = {
  fable: { bg: "#12100d", accent: "#cf9d5c" },
  noir: { bg: "#f7f2e9", accent: "#a94313" },
  golden: { bg: "#f5f2ed", accent: "#d97757" },
  locker: { bg: "#0e120f", accent: "#cda250" },
  ocean: { bg: "#051416", accent: "#2dd4bf" },
  fuego: { bg: "#0c0908", accent: "#ff6b00" },
};

export function VariantSwitcher({
  active,
  basePath,
}: {
  active: Variant;
  basePath: string;
}) {
  return (
    <div
      className="vswitch fixed left-3 z-50 bottom-[calc(4.9rem+env(safe-area-inset-bottom))] md:bottom-4 md:left-4"
      aria-label="Design variant switcher"
    >
      <details className="relative">
        <summary
          className="surface flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-semibold"
          style={{ boxShadow: "var(--shadow)", color: "var(--text)" }}
          aria-label={`Change design — current: ${VARIANT_META[active].name}`}
        >
          <Swatch variant={active} />
          <span
            className="uppercase tracking-widest"
            style={{ color: "var(--faint)" }}
          >
            Design
          </span>
          <span style={{ color: "var(--text-strong)" }}>
            {VARIANT_META[active].name.split(" ")[0]}
          </span>
        </summary>

        <div
          className="vswitch-panel surface"
          style={{ boxShadow: "var(--shadow)" }}
        >
          {VARIANTS.map((v) => (
            <a
              key={v}
              href={`${basePath}?variant=${v}`}
              title={VARIANT_META[v].blurb}
              className="vswitch-option"
              data-active={v === active}
            >
              <Swatch variant={v} />
              {VARIANT_META[v].name}
            </a>
          ))}
        </div>
      </details>
    </div>
  );
}

function Swatch({ variant }: { variant: Variant }) {
  const s = SWATCHES[variant];
  return (
    <span
      aria-hidden
      className="vswitch-swatch"
      style={{
        background: `linear-gradient(135deg, ${s.bg} 50%, ${s.accent} 50%)`,
      }}
    />
  );
}
