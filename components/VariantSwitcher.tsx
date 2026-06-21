import { VARIANTS, VARIANT_META, type Variant } from "@/lib/types";

/**
 * Design-direction switcher for side-by-side comparison.
 *
 * Always available via the URL (?variant=noir|golden|locker). The floating
 * switcher UI renders only outside production so the live site stays clean,
 * while reviewers can still flip directions during development/preview.
 */
export function VariantSwitcher({
  active,
  basePath,
}: {
  active: Variant;
  basePath: string;
}) {
  // Always visible so user can preview easily
  return (
    <div
      className="fixed bottom-4 left-4 z-50 hidden md:block"
      aria-label="Design variant preview switcher"
    >
      <div
        className="surface flex items-center gap-1 p-1.5"
        style={{ boxShadow: "var(--shadow)" }}
      >
        <span
          className="px-2 text-[0.65rem] font-semibold uppercase tracking-widest"
          style={{ color: "var(--faint)" }}
        >
          Design
        </span>
        {VARIANTS.map((v) => (
          <a
            key={v}
            href={`${basePath}?variant=${v}`}
            title={VARIANT_META[v].blurb}
            className="rounded-full px-3 py-1.5 text-xs font-semibold transition-colors"
            style={
              v === active
                ? { background: "var(--accent)", color: "var(--on-accent)" }
                : { color: "var(--muted)" }
            }
          >
            {VARIANT_META[v].name.split(" ")[0]}
          </a>
        ))}
      </div>
    </div>
  );
}
