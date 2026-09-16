import type { Branch } from "@/lib/types";
import { branchLinks } from "@/lib/contact";
import { MapPinIcon } from "./icons";

/**
 * Top utility bar — where the shop is, and on a phone, when it is open.
 *
 * It used to print the hours at every width, which on a wide screen put
 * "Open daily · 8:00 AM - 8:00 PM" fifty pixels above the header's status
 * pill saying exactly the same thing. So it splits by width: the phone header
 * shows only "Open now", so the hours belong here; the desktop header carries
 * them already, so this bar spends the room on the thing neither of them says
 * — that the counter is inside somebody else's store, which is the single
 * most common reason a first-time visitor drives past it.
 *
 * No contact CTA here: the header and the sticky bar have that covered, and
 * stacking a third would push the hero off the screen.
 */
export function AnnouncementBar({ branch }: { branch: Branch }) {
  const links = branchLinks(branch);

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
          aria-hidden
        />

        {/* Phones: the hours, which the compact header status omits. */}
        <span className="lg:hidden" style={{ color: "var(--text)" }}>
          {branch.hours.display}
        </span>

        {/* Wide screens: how to find the counter, with a way to get there. */}
        {branch.wayfinding && (
          <span className="hidden lg:inline" style={{ color: "var(--text)" }}>
            {branch.wayfinding}
          </span>
        )}

        <span aria-hidden style={{ color: "var(--faint)" }}>
          ·
        </span>

        <a
          href={links.directions}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 hover:underline"
        >
          <MapPinIcon width={13} height={13} aria-hidden />
          {branch.locality}
        </a>
      </div>
    </div>
  );
}
