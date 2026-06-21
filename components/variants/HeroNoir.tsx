import Image from "next/image";
import type { Branch } from "@/lib/types";
import { branchLinks, DEFAULT_WA_MESSAGE } from "@/lib/contact";
import { OpenStatus } from "../OpenStatus";
import { WhatsAppIcon, ArrowUpRight, MapPinIcon } from "../icons";

export function HeroNoir({ branch }: { branch: Branch }) {
  const links = branchLinks(branch, DEFAULT_WA_MESSAGE);

  return (
    <section id="top" className="relative">
      <div className="relative min-h-[430px] overflow-hidden bg-[var(--accent-2)] sm:min-h-[500px]">
        {branch.heroImage && (
          <Image
            src={branch.heroImage}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        )}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, rgb(23 17 12 / 0.76), rgb(23 17 12 / 0.42) 48%, rgb(23 17 12 / 0.08)), linear-gradient(180deg, rgb(23 17 12 / 0.05), rgb(23 17 12 / 0.22))",
          }}
        />

        <div className="wrap relative z-10 flex min-h-[430px] items-center pb-16 pt-14 sm:min-h-[500px]">
          <div className="w-full max-w-2xl reveal">
            <p className="eyebrow" style={{ color: "#f5d7ba" }}>
              Boutique butcher &amp; European deli
            </p>
            <h1 className="font-display balance mt-5 max-w-[13ch] text-[clamp(2.65rem,7.8vw,6.1rem)] font-semibold leading-[0.94] tracking-tightish text-[#fff8ee]">
              Premium provisions in Panglao.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-[#f7eadb] sm:text-xl">
              Steaks, salmon, sausages, hams, bacon and deli favorites inside
              Dason Store, Bolod.
            </p>
            <div className="mt-7 grid gap-3 sm:flex sm:flex-wrap">
              <a
                href={links.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary w-full sm:w-auto"
              >
                <WhatsAppIcon width={18} height={18} />
                Ask today&apos;s stock
              </a>
              <a
                href={links.maps}
                target="_blank"
                rel="noopener noreferrer"
                className="btn w-full sm:w-auto"
                style={{
                  color: "#fff8ee",
                  borderColor: "rgb(255 248 238 / 0.38)",
                  background: "rgb(255 248 238 / 0.12)",
                }}
              >
                <MapPinIcon width={18} height={18} />
                Get directions
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="wrap relative z-10 -mt-12">
        <div
          className="grid gap-px overflow-hidden rounded-[var(--radius-lg)] reveal sm:grid-cols-3"
          style={{
            background: "var(--line)",
            border: "1px solid var(--line)",
            boxShadow: "var(--shadow)",
            animationDelay: "140ms",
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
      className="min-w-0 px-5 py-5 sm:px-6 sm:py-6"
      style={{ background: "var(--surface)" }}
    >
      <p
        className="mb-2 text-xs font-semibold uppercase tracking-widest"
        style={{ color: "var(--faint)" }}
      >
        {label}
      </p>
      <div className="min-w-0 break-words text-sm leading-relaxed">{children}</div>
    </div>
  );
}
