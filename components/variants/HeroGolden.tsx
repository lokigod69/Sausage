import type { Branch } from "@/lib/types";
import { branchLinks, DEFAULT_WA_MESSAGE } from "@/lib/contact";
import { Brand } from "../Brand";
import { OpenStatus } from "../OpenStatus";
import { WhatsAppIcon, MapPinIcon, ArrowUpRight } from "../icons";

/**
 * GOLDEN — warm daily market.
 * Split hero with a soft "sun" arc, big rounded type and an overlapping
 * card-stack on the right (logo plate + floating hours pill + address pill).
 * Sunny, friendly, family-first — but still premium.
 */
export function HeroGolden({ branch }: { branch: Branch }) {
  const links = branchLinks(branch, DEFAULT_WA_MESSAGE);

  return (
    <section id="top" className="relative overflow-hidden pt-12 sm:pt-16">
      {/* sun arc */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 -top-40 h-[34rem] w-[34rem] rounded-full"
        style={{
          background:
            "radial-gradient(circle, color-mix(in oklab, var(--accent) 38%, transparent), transparent 62%)",
        }}
      />
      <div className="wrap relative grid items-center gap-12 lg:grid-cols-[1fr_0.92fr]">
        <div className="reveal">
          <p className="eyebrow mb-5">Your daily market</p>
          <h1
            className="font-display balance text-[clamp(2.6rem,7vw,5rem)] font-semibold leading-[0.98] tracking-tightish"
            style={{ color: "var(--text-strong)" }}
          >
            Good food for{" "}
            <span style={{ color: "var(--accent)" }}>every day</span> in
            Panglao.
          </h1>
          <p
            className="mt-6 max-w-lg text-lg leading-relaxed"
            style={{ color: "var(--muted)" }}
          >
            Sausages, steaks, salmon, hams, bacon, ready meals and fresh bakery —
            all under one roof inside Dason Store, Bolod.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={links.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-wa"
            >
              <WhatsAppIcon width={18} height={18} />
              Message us
            </a>
            <a href="#products" className="btn btn-ghost">
              See what&rsquo;s in store
              <ArrowUpRight width={17} height={17} />
            </a>
          </div>
        </div>

        {/* overlapping card-stack */}
        <div
          className="reveal relative mx-auto w-full max-w-md pb-10 pr-6 sm:pb-12 sm:pr-10"
          style={{ animationDelay: "160ms" }}
        >
          <div className="surface-solid p-6" style={{ boxShadow: "var(--shadow)" }}>
            <div
              className="grid h-44 place-items-center rounded-[var(--radius)]"
              style={{
                background:
                  "linear-gradient(160deg, color-mix(in oklab, var(--accent) 8%, var(--surface)), var(--surface-2))",
                border: "1px solid var(--line)",
              }}
            >
              <Brand size="lg" priority />
            </div>
            <p
              className="mt-5 text-center text-sm"
              style={{ color: "var(--muted)" }}
            >
              {branch.wayfinding}
            </p>
          </div>

          {/* floating hours pill */}
          <div
            className="surface-solid absolute -left-3 bottom-2 flex items-center gap-2 px-4 py-3 text-sm sm:-left-6"
            style={{ boxShadow: "var(--shadow)" }}
          >
            <OpenStatus
              open={branch.hours.open}
              close={branch.hours.close}
              display={branch.hours.display}
            />
          </div>

          {/* floating address pill */}
          <a
            href={links.maps}
            target="_blank"
            rel="noopener noreferrer"
            className="surface-solid absolute -right-2 top-6 flex max-w-[14rem] items-start gap-2 px-4 py-3 text-xs sm:-right-6"
            style={{ boxShadow: "var(--shadow)", color: "var(--text)" }}
          >
            <MapPinIcon
              width={16}
              height={16}
              style={{ color: "var(--accent)", flexShrink: 0, marginTop: 1 }}
            />
            <span>
              Inside Dason Store, Bolod
              <span
                className="mt-0.5 block font-semibold"
                style={{ color: "var(--accent)" }}
              >
                Get directions →
              </span>
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
