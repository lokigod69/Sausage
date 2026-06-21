import type { Branch } from "@/lib/types";
import { branchLinks, DEFAULT_WA_MESSAGE } from "@/lib/contact";
import { Brand } from "../Brand";
import { OpenStatus } from "../OpenStatus";
import { WhatsAppIcon, ArrowUpRight } from "../icons";
import { HeroPhoto } from "../HeroPhoto";

/**
 * NOIR — editorial / magazine masthead.
 * Single dominant serif headline, a refined logo mark top-right, and a
 * full-width hairline META RULE beneath (Find us · Hours · The shop) instead
 * of a boxed contact card. Lots of negative space.
 */
export function HeroNoir({ branch }: { branch: Branch }) {
  const links = branchLinks(branch, DEFAULT_WA_MESSAGE);

  return (
    <section id="top" className="relative pt-12 sm:pt-20">
      <div className="wrap">
        {/* masthead top line */}
        <div className="mb-8 flex items-center justify-between gap-4">
          <p className="eyebrow">Boutique butcher &amp; European deli</p>
          <span className="hidden opacity-95 lg:block">
            <Brand size="lg" />
          </span>
        </div>

        {/* giant headline */}
        <h1
          className="font-display balance max-w-[14ch] text-[clamp(2.8rem,9vw,6.5rem)] font-semibold leading-[0.92] tracking-tightish reveal"
          style={{ color: "var(--text-strong)" }}
        >
          Sausages, steaks &amp;{" "}
          <span style={{ color: "var(--accent)" }}>seafood</span>, done
          properly.
        </h1>

        <HeroPhoto
          branch={branch}
          priority
          className="mt-9 aspect-[3/2] rounded-[var(--radius-lg)] reveal"
        />

        <div className="mt-8 grid gap-8 reveal lg:grid-cols-[1.1fr_0.9fr]" style={{ animationDelay: "120ms" }}>
          <p
            className="max-w-xl text-lg leading-relaxed"
            style={{ color: "var(--muted)" }}
          >
            Steaks, salmon, sausages, hams, bacon and deli favorites — inside
            Dason Store, Bolod.
          </p>
          <div className="flex flex-wrap items-start gap-3 lg:justify-end">
            <a
              href={links.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-wa"
            >
              <WhatsAppIcon width={18} height={18} />
              Message us
            </a>
          </div>
        </div>

        {/* full-width meta rule — editorial masthead, not a card */}
        <div
          className="mt-12 grid gap-px overflow-hidden rounded-[var(--radius-lg)] reveal sm:grid-cols-3"
          style={{
            background: "var(--line)",
            border: "1px solid var(--line)",
            animationDelay: "220ms",
          }}
        >
          <MetaCell label="Find us">
            <span className="block" style={{ color: "var(--text)" }}>
              {branch.address}
            </span>
            <a
              href={links.maps}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1.5 inline-flex items-center gap-1 text-sm font-semibold"
              style={{ color: "var(--accent)" }}
            >
              Get directions <ArrowUpRight width={13} height={13} />
            </a>
          </MetaCell>
          <MetaCell label="Hours">
            <span style={{ color: "var(--text)" }}>
              <OpenStatus
                open={branch.hours.open}
                close={branch.hours.close}
                display={branch.hours.display}
              />
            </span>
          </MetaCell>
          <MetaCell label="Look for us">
            <span style={{ color: "var(--text)" }}>{branch.wayfinding}</span>
          </MetaCell>
        </div>
      </div>
    </section>
  );
}

function MetaCell({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="px-5 py-5 sm:px-6 sm:py-6"
      style={{ background: "var(--surface)" }}
    >
      <p
        className="mb-2 text-xs font-semibold uppercase tracking-widest"
        style={{ color: "var(--faint)" }}
      >
        {label}
      </p>
      <div className="text-sm leading-relaxed">{children}</div>
    </div>
  );
}
