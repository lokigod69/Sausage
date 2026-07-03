import Image from "next/image";
import type { Branch } from "@/lib/types";
import { branchLinks, DEFAULT_WA_MESSAGE } from "@/lib/contact";
import { OpenStatus } from "../OpenStatus";
import { WhatsAppIcon, MapPinIcon, StarIcon } from "../icons";

/**
 * Fable Atelier hero. A single full-bleed photograph that dissolves into the
 * charcoal page ground (the photography shares the same palette, so there is
 * no visible seam), with a bottom-anchored editorial masthead and a slow
 * serif provisions ticker underneath.
 */

const TICKER_ITEMS = [
  "Angus ribeye & tenderloin",
  "Pacific salmon",
  "Hand-tied bratwurst",
  "Cooked hams & smoked bacon",
  "Cheese-counter staples",
  "Duck, turkey & poultry",
  "Burgers & franks",
  "Ask for today's specials",
];

export function HeroFable({ branch }: { branch: Branch }) {
  const links = branchLinks(branch, DEFAULT_WA_MESSAGE);

  return (
    <section id="top" aria-label="Welcome">
      <div className="relative overflow-hidden">
        {/* Photograph */}
        <div className="absolute inset-0" aria-hidden>
          {branch.heroImage && (
            <Image
              src={branch.heroImage}
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover object-center"
            />
          )}
          {/* Melt the photo into the page ground — no hard seam. */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgb(18 16 13 / 0.62) 0%, rgb(18 16 13 / 0.18) 34%, rgb(18 16 13 / 0.55) 66%, var(--bg) 98%), linear-gradient(100deg, rgb(18 16 13 / 0.55), transparent 55%)",
            }}
          />
        </div>

        {/* Masthead */}
        {/* Extra bottom padding on md+ keeps the meta rail clear of the
            floating design switcher pinned bottom-left. */}
        <div className="wrap relative flex min-h-[86svh] flex-col justify-end pb-14 pt-28 sm:min-h-[88svh] md:pb-24">
          <div className="max-w-3xl">
            <p className="eyebrow reveal">
              Butcher &amp; Deli — Panglao, Bohol
            </p>
            <h1
              className="font-display balance mt-6 text-[clamp(2.9rem,8.2vw,6.4rem)] font-medium leading-[0.98] text-[var(--text-strong)] reveal"
              style={{ animationDelay: "120ms" }}
            >
              Provisions for{" "}
              <em
                className="font-light italic"
                style={{ color: "var(--accent-strong)" }}
              >
                the good life.
              </em>
            </h1>
            <p
              className="mt-6 max-w-xl text-lg leading-relaxed text-[var(--text)] reveal sm:text-xl"
              style={{ animationDelay: "240ms" }}
            >
              Steaks, Pacific salmon, hand-tied sausages, hams and European
              deli goods — one small counter in Bolod, stocked daily.
            </p>

            <div
              className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center reveal"
              style={{ animationDelay: "360ms" }}
            >
              <a
                href={links.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                <WhatsAppIcon width={18} height={18} />
                Message the counter
              </a>
              <a
                href={links.maps}
                target="_blank"
                rel="noopener noreferrer"
                className="btn"
                style={{
                  color: "var(--text-strong)",
                  borderColor: "color-mix(in oklab, var(--text) 32%, transparent)",
                  background: "color-mix(in oklab, var(--bg) 35%, transparent)",
                  backdropFilter: "blur(6px)",
                  WebkitBackdropFilter: "blur(6px)",
                }}
              >
                <MapPinIcon width={18} height={18} />
                Get directions
              </a>
            </div>
          </div>

          {/* Meta rail */}
          <div
            className="mt-12 flex flex-col gap-4 border-t pt-6 text-sm sm:flex-row sm:items-center sm:justify-between reveal"
            style={{
              borderColor: "color-mix(in oklab, var(--text) 18%, transparent)",
              animationDelay: "480ms",
            }}
          >
            <div
              className="flex flex-wrap items-center gap-x-8 gap-y-3"
              style={{ color: "var(--text)" }}
            >
              <OpenStatus
                open={branch.hours.open}
                close={branch.hours.close}
                display={branch.hours.display}
              />
              {branch.rating && branch.reviewCount && (
                <a
                  href={branch.reviewsUrl ?? "#reviews"}
                  target={branch.reviewsUrl ? "_blank" : undefined}
                  rel={branch.reviewsUrl ? "noopener noreferrer" : undefined}
                  className="inline-flex items-center gap-2"
                >
                  <span
                    className="inline-flex items-center gap-1"
                    style={{ color: "var(--accent)" }}
                    aria-hidden
                  >
                    <StarIcon width={14} height={14} />
                  </span>
                  <span>
                    {branch.rating.toFixed(1)} · {branch.reviewCount} Google
                    reviews
                  </span>
                </a>
              )}
              <span className="hidden lg:inline" style={{ color: "var(--muted)" }}>
                {branch.wayfinding}
              </span>
            </div>
            <div className="hidden items-center gap-3 sm:flex" aria-hidden>
              <span
                className="mono text-[0.62rem] uppercase tracking-[0.28em]"
                style={{ color: "var(--faint)" }}
              >
                Scroll
              </span>
              <span className="fable-scrollcue" />
            </div>
          </div>
        </div>
      </div>

      {/* Provisions ticker */}
      <div className="fable-ticker" role="presentation">
        <div className="fable-ticker-track py-3.5">
          <TickerRun />
          <TickerRun ariaHidden />
        </div>
      </div>
    </section>
  );
}

function TickerRun({ ariaHidden = false }: { ariaHidden?: boolean }) {
  return (
    <span
      className="flex items-center whitespace-nowrap"
      aria-hidden={ariaHidden || undefined}
    >
      {TICKER_ITEMS.map((item) => (
        <span key={item} className="flex items-center">
          <span
            className="font-display px-7 text-[1.05rem] italic"
            style={{ color: "var(--muted)" }}
          >
            {item}
          </span>
          <span
            aria-hidden
            className="inline-block h-1 w-1 rounded-full"
            style={{ background: "var(--accent)" }}
          />
        </span>
      ))}
    </span>
  );
}
