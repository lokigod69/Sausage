import type { Branch } from "@/lib/types";
import { branchLinks, DEFAULT_WA_MESSAGE } from "@/lib/contact";
import { WhatsAppIcon, PhoneIcon, MapPinIcon } from "./icons";

/**
 * Mobile-only sticky contact bar. Always one tap from the three core actions.
 * Hidden on >= md where the header CTA and contact section are already visible.
 */
export function StickyContactBar({ branch }: { branch: Branch }) {
  const links = branchLinks(branch, DEFAULT_WA_MESSAGE);

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 md:hidden"
      style={{
        background: "color-mix(in oklab, var(--bg) 86%, transparent)",
        borderTop: "1px solid var(--line)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      <div className="grid grid-cols-3 gap-2 p-2.5">
        <a
          href={links.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-wa"
          style={{ minHeight: 46, fontSize: "0.85rem" }}
        >
          <WhatsAppIcon width={17} height={17} />
          WhatsApp
        </a>
        <a
          href={links.phone}
          className="btn btn-ghost"
          style={{ minHeight: 46, fontSize: "0.85rem" }}
        >
          <PhoneIcon width={17} height={17} />
          Call
        </a>
        <a
          href={links.maps}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary"
          style={{ minHeight: 46, fontSize: "0.85rem" }}
        >
          <MapPinIcon width={17} height={17} />
          Map
        </a>
      </div>
    </div>
  );
}
