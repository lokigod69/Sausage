"use client";

import { useState } from "react";
import type { Branch } from "@/lib/types";
import { branchLinks, DEFAULT_WA_MESSAGE } from "@/lib/contact";
import { Brand } from "../Brand";
import { OpenStatus } from "../OpenStatus";
import { WhatsAppIcon, MapPinIcon, SearchIcon } from "../icons";
import { HeroPhoto } from "../HeroPhoto";

/**
 * LOCKER — utility "what's available today" dashboard.
 * The search is the hero. A compact headline, a big functional search field
 * that drives the product browser (via the `sg:search` event it listens for),
 * a mono stat strip, and small utility actions. Compartment-grid backdrop.
 */
export function HeroLocker({
  branch,
  productCount,
  categoryCount,
}: {
  branch: Branch;
  productCount: number;
  categoryCount: number;
}) {
  const links = branchLinks(branch, DEFAULT_WA_MESSAGE);
  const [q, setQ] = useState("");

  function go(value: string) {
    window.dispatchEvent(
      new CustomEvent("sg:search", { detail: value }),
    );
    document
      .getElementById("products")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <section id="top" className="relative pt-12 sm:pt-16">
      {/* compartment grid backdrop */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-0"
        style={{
          backgroundImage:
            "linear-gradient(var(--line) 1px, transparent 1px), linear-gradient(90deg, var(--line) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage:
            "radial-gradient(110% 80% at 50% 0%, black, transparent 75%)",
          WebkitMaskImage:
            "radial-gradient(110% 80% at 50% 0%, black, transparent 75%)",
          opacity: 0.6,
        }}
      />
      <div className="wrap relative">
        <div className="mx-auto max-w-3xl text-center reveal">
          <div className="mb-8 flex justify-center">
            <Brand size="lg" />
          </div>
          <h1
            className="font-display balance mx-auto max-w-[12ch] text-[clamp(2rem,5.5vw,3.8rem)] font-semibold leading-[1.02] tracking-tightish sm:max-w-none"
            style={{ color: "var(--text-strong)" }}
          >
            What are you stocking up on today?
          </h1>
          <p
            className="mx-auto mt-4 max-w-lg text-base leading-relaxed"
            style={{ color: "var(--muted)" }}
          >
            Frozen salmon, steaks, sausages, hams and deli — search the locker
            below.
          </p>

          {/* functional search */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              go(q);
            }}
            className="relative mx-auto mt-8 max-w-2xl"
          >
            <SearchIcon
              width={20}
              height={20}
              className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2"
              style={{ color: "var(--faint)" }}
            />
            <input
              type="search"
              inputMode="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search ribeye, salmon, bratwurst, bacon…"
              aria-label="Search the locker"
              className="mono w-full rounded-[var(--radius)] py-4 pl-13 pr-32 text-base outline-none"
              style={{
                background: "var(--surface)",
                border: "1px solid var(--line-strong)",
                color: "var(--text-strong)",
                paddingLeft: "3.25rem",
              }}
            />
            <button
              type="submit"
              className="btn btn-primary absolute right-2 top-1/2 -translate-y-1/2"
              style={{ minHeight: 42, paddingBlock: "0.55rem" }}
            >
              Search
            </button>
          </form>

          {/* mono stat strip */}
          <div
            className="mono mx-auto mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs"
            style={{ color: "var(--muted)" }}
          >
            <span style={{ color: "var(--text)" }}>{productCount}+ items</span>
            <span aria-hidden style={{ color: "var(--faint)" }}>
              /
            </span>
            <span style={{ color: "var(--text)" }}>
              {categoryCount} counters
            </span>
            <span aria-hidden style={{ color: "var(--faint)" }}>
              /
            </span>
            <OpenStatus
              open={branch.hours.open}
              close={branch.hours.close}
              display={branch.hours.display}
              compact
            />
          </div>

          {/* utility actions */}
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <a
              href={links.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-wa"
            >
              <WhatsAppIcon width={17} height={17} />
              Message us
            </a>
            <a
              href={links.maps}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost"
            >
              <MapPinIcon width={17} height={17} />
              Directions
            </a>
          </div>

          <HeroPhoto
            branch={branch}
            priority
            className="mx-auto mt-9 aspect-[3/2] max-w-3xl rounded-[var(--radius)]"
          />
        </div>
      </div>
    </section>
  );
}
