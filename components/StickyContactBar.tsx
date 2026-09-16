import type { Branch } from "@/lib/types";
import { branchLinks, DEFAULT_WA_MESSAGE } from "@/lib/contact";
import {
  MessengerIcon,
  WhatsAppIcon,
  PhoneIcon,
  MapPinIcon,
} from "./icons";

/**
 * Mobile-only sticky contact bar: Messenger, WhatsApp, a call, directions.
 *
 * Messenger sits first and in the primary style because it is how customers
 * here open a conversation with a shop; WhatsApp follows for the expat half
 * of the customer base. Four is the most that fits at 375px while keeping
 * each target above 44px, which is why the Facebook page is not here — it is
 * in the footer and the Visit section, and it is the one channel nobody
 * needs in a hurry.
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
      <div className="grid grid-cols-4 gap-1.5 p-2">
        <a
          href={links.messenger}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary"
          style={{ minHeight: 46, fontSize: "0.78rem" }}
        >
          <MessengerIcon width={17} height={17} />
          Chat
        </a>
        <a
          href={links.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-wa"
          style={{ minHeight: 46, fontSize: "0.78rem" }}
        >
          <WhatsAppIcon width={17} height={17} />
          WhatsApp
        </a>
        <a
          href={links.phone}
          className="btn btn-ghost"
          style={{ minHeight: 46, fontSize: "0.78rem" }}
        >
          <PhoneIcon width={17} height={17} />
          Call
        </a>
        <a
          href={links.directions}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary"
          style={{ minHeight: 46, fontSize: "0.78rem" }}
        >
          <MapPinIcon width={17} height={17} />
          Map
        </a>
      </div>
    </div>
  );
}
