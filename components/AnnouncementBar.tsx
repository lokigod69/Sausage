import type { Branch } from "@/lib/types";

/**
 * Top utility bar — purely informational (hours + location). No CTA here;
 * the header carries the single persistent WhatsApp action so we don't stack
 * duplicate contact buttons above the fold.
 */
export function AnnouncementBar({ branch }: { branch: Branch }) {
  return (
    <div
      className="relative z-30 text-sm"
      style={{
        background: "color-mix(in oklab, var(--bg-2) 92%, black)",
        borderBottom: "1px solid var(--line)",
        color: "var(--muted)",
      }}
    >
      <div className="wrap flex items-center justify-center gap-2.5 py-2 text-center">
        <span
          className="inline-block h-1.5 w-1.5 flex-shrink-0 rounded-full"
          style={{ background: "var(--accent)" }}
        />
        <span>
          <span className="hidden sm:inline">{branch.hours.label} · </span>
          <span style={{ color: "var(--text)" }}>{branch.hours.display}</span>
        </span>
        <span aria-hidden style={{ color: "var(--faint)" }}>
          ·
        </span>
        <span>{branch.locality}</span>
      </div>
    </div>
  );
}
