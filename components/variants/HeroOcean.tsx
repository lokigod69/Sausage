import type { Branch } from "@/lib/types";
import { branchLinks, DEFAULT_WA_MESSAGE } from "@/lib/contact";
import { Brand } from "../Brand";
import { OpenStatus } from "../OpenStatus";
import { WhatsAppIcon, ArrowUpRight, MapPinIcon } from "../icons";
import { HeroPhoto } from "../HeroPhoto";

/**
 * OCEAN PEARL — luxury beachside resort pantry & fresh seafood grill.
 * Light teal/seafoam details, floating glassmorphic information card with
 * custom wave animations, and high-impact layouts.
 */
export function HeroOcean({ branch }: { branch: Branch }) {
  const links = branchLinks(branch, DEFAULT_WA_MESSAGE);

  return (
    <section id="top" className="relative overflow-hidden pt-12 pb-24 sm:pt-20 sm:pb-32">
      {/* Decorative ocean ripple backdrop (SVG water ripple effect) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-30"
        style={{
          backgroundImage: `radial-gradient(ellipse at 50% -20%, color-mix(in oklab, var(--accent) 30%, transparent), transparent 70%)`,
        }}
      />

      <div className="wrap relative grid gap-16 items-center lg:grid-cols-[1.1fr_0.9fr]">
        <div className="reveal">
          <div className="mb-6 flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent-2)]" />
            <p className="eyebrow" style={{ color: "var(--accent)" }}>
              Resort delivery &amp; pickup
            </p>
          </div>

          <h1
            className="font-display balance max-w-[11ch] text-[clamp(2.35rem,7.5vw,5.2rem)] font-semibold leading-[0.95] tracking-tightish sm:max-w-none"
            style={{ color: "var(--text-strong)" }}
          >
            Taste the coastal <span style={{ color: "var(--accent)" }}>freshness</span> of Bohol.
          </h1>

          <p
            className="mt-6 max-w-lg text-lg leading-relaxed"
            style={{ color: "var(--muted)" }}
          >
            Premium steaks, cold cuts, deli goods and the freshest seafood —
            inside Dason Store, Bolod.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href={links.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-wa"
            >
              <WhatsAppIcon width={18} height={18} />
              Pre-order via WhatsApp
            </a>
            <a href="#products" className="btn btn-ghost">
              Explore the counter
              <ArrowUpRight width={17} height={17} />
            </a>
          </div>
        </div>

        {/* Floating resort details card */}
        <div className="reveal relative w-full max-w-md mx-auto" style={{ animationDelay: "180ms" }}>
          {/* Decorative glowing sphere representing pearl */}
          <div
            className="absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-60 blur-2xl"
            style={{
              background: "radial-gradient(circle, var(--accent) 0%, transparent 70%)",
            }}
          />
          <div
            className="absolute -left-12 -bottom-12 h-36 w-36 rounded-full opacity-40 blur-3xl"
            style={{
              background: "radial-gradient(circle, var(--accent-2) 0%, transparent 70%)",
            }}
          />

          <div
            className="surface p-6 sm:p-8"
            style={{
              boxShadow: "var(--shadow)",
              position: "relative",
              zIndex: 2,
            }}
          >
            <HeroPhoto
              branch={branch}
              priority
              className="mb-6 aspect-[3/2] rounded-[var(--radius)]"
            />

            <div className="flex justify-between items-start gap-4 mb-6">
              <div>
                <Brand size="lg" />
                <p className="mt-1.5 text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--faint)" }}>
                  Meat &amp; deli store
                </p>
              </div>
              <span
                className="inline-flex rounded-full px-3 py-1 text-xs font-semibold"
                style={{
                  background: "color-mix(in oklab, var(--accent) 15%, transparent)",
                  color: "var(--accent)",
                }}
              >
                Stocked Daily
              </span>
            </div>

            <div className="space-y-5">
              <div className="flex gap-3">
                <MapPinIcon width={18} height={18} className="shrink-0 mt-0.5" style={{ color: "var(--accent)" }} />
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--faint)" }}>Address</h4>
                  <p className="text-sm mt-0.5" style={{ color: "var(--text)" }}>{branch.address}</p>
                  <a
                    href={links.maps}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-semibold mt-1"
                    style={{ color: "var(--accent-2)" }}
                  >
                    Open Google Maps <ArrowUpRight width={12} height={12} />
                  </a>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="shrink-0 mt-0.5" style={{ color: "var(--accent)" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--faint)" }}>Pantry Hours</h4>
                  <div className="text-sm mt-0.5 font-medium">
                    <OpenStatus
                      open={branch.hours.open}
                      close={branch.hours.close}
                      display={branch.hours.display}
                    />
                  </div>
                </div>
              </div>

              <div className="border-t pt-4" style={{ borderColor: "var(--line)" }}>
                <p className="text-xs italic" style={{ color: "var(--muted)" }}>
                  &ldquo;{branch.wayfinding}&rdquo;
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* WAVE DIVIDER at the bottom of the section */}
      <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-none z-10">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-12" style={{ fill: "var(--bg-2)" }}>
          <path
            className="wave-path"
            d="M0,60 C150,100 350,20 500,60 C650,100 850,20 1000,60 C1150,100 1300,60 1400,60 L1400,120 L0,120 Z"
            style={{ opacity: 0.5 }}
          />
          <path
            className="wave-path"
            d="M-100,50 C50,100 200,20 400,50 C600,80 800,20 950,50 C1100,80 1250,50 1350,50 L1350,120 L-100,120 Z"
            style={{ animationDelay: "-3s", animationDuration: "16s" }}
          />
        </svg>
      </div>
    </section>
  );
}
