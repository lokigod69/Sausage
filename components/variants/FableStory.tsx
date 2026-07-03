import Image from "next/image";
import type { Branch } from "@/lib/types";
import { branchLinks, DEFAULT_WA_MESSAGE } from "@/lib/contact";
import { CategoryPhoto } from "../CategoryPhoto";
import { WhatsAppIcon } from "../icons";

/**
 * Fable Atelier story: an editorial spread — drop-cap narrative beside a
 * gallery-matted photograph with a kraft butcher-paper stamp — followed by
 * a stats rail and the kraft promo banner (the page's slot for weekly
 * promotions; edit PROMO below to run one).
 */

const PROMO = {
  eyebrow: "This week at the counter",
  title: "New arrivals land without warning.",
  body: "Stock changes daily and the best cuts go first. Message us and we'll tell you what's good today — or set something aside for you.",
  cta: "Ask what's in today",
};

export function FableStory({
  branch,
  productCount,
}: {
  branch: Branch;
  productCount: number;
}) {
  const links = branchLinks(branch, DEFAULT_WA_MESSAGE);

  return (
    <section className="section" aria-label="About the counter">
      <div className="wrap">
        <div className="grid items-center gap-14 lg:grid-cols-[1fr_0.92fr] lg:gap-20">
          {/* Narrative */}
          <div data-reveal>
            <p className="eyebrow">Our counter</p>
            <h2
              className="font-display balance mt-5 text-[clamp(2rem,4.6vw,3.4rem)] font-medium leading-[1.05]"
              style={{ color: "var(--text-strong)" }}
            >
              A small shop with{" "}
              <em className="italic" style={{ color: "var(--accent-strong)" }}>
                serious standards.
              </em>
            </h2>
            <p
              className="fable-dropcap mt-7 max-w-xl text-base leading-[1.8] sm:text-lg"
              style={{ color: "var(--text)" }}
            >
              The rule at our counter is simple: if we wouldn&rsquo;t serve it
              at our own table, it doesn&rsquo;t go in the case. Steaks and
              Angus cuts trimmed properly. Pacific salmon kept properly cold.
              German-style sausages, hams, bacon and cheese — sourced
              carefully, handled right, priced fairly.
            </p>
            <p
              className="mt-5 max-w-xl text-base leading-[1.8] sm:text-lg"
              style={{ color: "var(--muted)" }}
            >
              You&rsquo;ll find us inside Dason Store in Bolod — a quick stop
              on the way to the beach, and worth the trip on its own.
            </p>
            <p
              className="font-display mt-8 text-lg italic"
              style={{ color: "var(--accent)" }}
            >
              — The Sausage Guy, {branch.locality}
            </p>
          </div>

          {/* Matted photograph + kraft stamp */}
          <div
            className="relative pb-8 pr-4 sm:pr-0"
            data-reveal
            style={{ "--reveal-delay": "140ms" } as React.CSSProperties}
          >
            <div className="fable-frame">
              <CategoryPhoto
                slug="todays-pick"
                label="Today's pick at the counter"
                sizes="(min-width: 1024px) 540px, 92vw"
                className="aspect-[4/5] w-full rounded-[var(--radius-lg)] shadow-[var(--shadow)] sm:aspect-[5/6]"
              />
            </div>
            <div className="fable-paper absolute -bottom-2 -left-3 w-[15.5rem] max-w-[70vw] rotate-[-2deg] p-5 shadow-[var(--shadow)] sm:-left-8">
              <Image
                src="/brand/logo-mark-dark.png"
                alt=""
                width={1280}
                height={555}
                sizes="200px"
                className="h-auto w-40 object-contain"
              />
              <p
                className="mono mt-2 text-[0.6rem] uppercase tracking-[0.24em]"
                style={{ color: "var(--on-paper)", opacity: 0.75 }}
              >
                Butcher &amp; Deli — {branch.locality}
              </p>
            </div>
          </div>
        </div>

        {/* Stats rail */}
        <div
          className="mt-20 grid grid-cols-1 gap-y-8 border-t pt-9 sm:grid-cols-3"
          style={{ borderColor: "var(--line-strong)" }}
          data-reveal
        >
          <Stat
            value={branch.rating ? branch.rating.toFixed(1) : "5.0"}
            label={`Google rating · ${branch.reviewCount ?? ""} reviews`}
          />
          <Stat value={`${productCount}+`} label="items behind the counter" />
          <Stat
            value={branch.hours.display.replace(/:00/g, "")}
            label={`${branch.hours.label} — pickup & delivery`}
          />
        </div>

        {/* Kraft promo banner */}
        <div
          className="fable-paper mt-20 grid items-center gap-8 p-8 sm:p-12 lg:grid-cols-[1fr_auto]"
          data-reveal
        >
          <div>
            <p
              className="mono text-[0.66rem] font-medium uppercase tracking-[0.3em]"
              style={{ color: "var(--accent-2)" }}
            >
              {PROMO.eyebrow}
            </p>
            <p
              className="font-display balance mt-3 text-[clamp(1.6rem,3.4vw,2.5rem)] font-medium leading-tight"
              style={{ color: "var(--on-paper)" }}
            >
              {PROMO.title}
            </p>
            <p
              className="mt-3 max-w-2xl text-base leading-relaxed"
              style={{ color: "color-mix(in oklab, var(--on-paper) 78%, transparent)" }}
            >
              {PROMO.body}
            </p>
          </div>
          <a
            href={links.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="btn justify-self-start lg:justify-self-end"
            style={{
              background: "var(--on-paper)",
              color: "var(--paper)",
              boxShadow: "0 14px 30px -14px rgb(0 0 0 / 0.55)",
            }}
          >
            <WhatsAppIcon width={18} height={18} />
            {PROMO.cta}
          </a>
        </div>
      </div>
    </section>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="sm:px-6 sm:first:pl-0 sm:[&:not(:first-child)]:border-l" style={{ borderColor: "var(--line)" }}>
      <p
        className="font-display text-[2.6rem] font-medium leading-none"
        style={{ color: "var(--text-strong)" }}
      >
        {value}
      </p>
      <p
        className="mono mt-2.5 text-[0.66rem] uppercase tracking-[0.22em]"
        style={{ color: "var(--muted)" }}
      >
        {label}
      </p>
    </div>
  );
}
