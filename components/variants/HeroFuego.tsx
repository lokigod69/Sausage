"use client";

import { useEffect, useState } from "react";
import type { Branch } from "@/lib/types";
import { branchLinks, DEFAULT_WA_MESSAGE } from "@/lib/contact";
import { Brand } from "../Brand";
import { OpenStatus } from "../OpenStatus";
import { WhatsAppIcon, ArrowUpRight, MapPinIcon } from "../icons";
import { HeroPhoto } from "../HeroPhoto";

/**
 * FUEGO GRILL — live-fire smokehouse & boutique butcher.
 * Dark volcanic soot styling, heavy industrial borders, block offset shadows,
 * a live-fire specs board, and floating amber sparks rising.
 */
export function HeroFuego({
  branch,
  productCount,
  categoryCount,
}: {
  branch: Branch;
  productCount: number;
  categoryCount: number;
}) {
  const links = branchLinks(branch, DEFAULT_WA_MESSAGE);
  const [embers, setEmbers] = useState<{ id: number; style: React.CSSProperties }[]>([]);

  // Generate random ember variables on mount for visual variety
  useEffect(() => {
    const list = Array.from({ length: 16 }).map((_, i) => {
      const size = Math.floor(Math.random() * 6) + 4; // 4px to 10px
      const animName = `floatUp${(i % 3) + 1}`;
      return {
        id: i,
        style: {
          left: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 8}s`,
          animationDuration: `${7 + Math.random() * 7}s`,
          width: `${size}px`,
          height: `${size}px`,
          opacity: Math.random() * 0.7 + 0.3,
          animationName: animName,
        },
      };
    });
    setEmbers(list);
  }, []);

  return (
    <section id="top" className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-28">
      {/* Floating Ember Particles Backdrop */}
      <div className="ember-container" aria-hidden>
        {embers.map((ember) => (
          <div key={ember.id} className="ember" style={ember.style} />
        ))}
      </div>

      <div className="wrap relative grid gap-12 items-center lg:grid-cols-[1.15fr_0.85fr]">
        <div className="reveal z-10">
          <div className="mb-7">
            <Brand size="lg" />
          </div>
          <div className="mb-5 inline-flex items-center gap-2 border-2 border-[var(--accent)] px-3 py-1 text-xs font-bold uppercase tracking-wider text-[var(--accent)]" style={{ transform: "rotate(-1deg)" }}>
            <span className="h-2 w-2 animate-pulse bg-[var(--accent-2)]" style={{ borderRadius: "2px" }} />
            Live Fire &amp; Smoked Deli
          </div>

          <h1
            className="font-display balance text-[clamp(2.8rem,8vw,5.5rem)] font-black uppercase leading-[0.9] tracking-tighter"
            style={{ color: "var(--text-strong)" }}
          >
            Fresh off the <span style={{ color: "var(--accent)" }}>coals</span>.
          </h1>

          <p
            className="mt-6 max-w-lg text-lg leading-relaxed"
            style={{ color: "var(--muted)" }}
          >
            Wood-smoked sausages, dry-aged steaks, thick-cut bacon and premium
            barbecue provisions — inside Dason Store, Bolod.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
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
              Browse Menu Board
              <ArrowUpRight width={17} height={17} />
            </a>
          </div>
        </div>

        {/* Heavy Grill Board Stats Card */}
        <div className="reveal relative z-10 mx-auto w-full max-w-md" style={{ animationDelay: "180ms" }}>
          <div
            className="surface p-6 sm:p-7"
            style={{
              borderColor: "var(--line-strong)",
              background: "var(--surface)",
              boxShadow: "var(--shadow)",
            }}
          >
            <HeroPhoto
              branch={branch}
              priority
              className="mb-5 aspect-[3/2] rounded-[calc(var(--radius)-2px)]"
            />

            {/* Sizzling Grill Header */}
            <div className="border-b-2 pb-4 mb-5 flex justify-between items-center" style={{ borderColor: "var(--line-strong)" }}>
              <div className="mono text-xs uppercase tracking-widest" style={{ color: "var(--accent)" }}>
                Pit Specifier
              </div>
              <div
                className="mono text-[10px] font-bold px-2 py-0.5"
                style={{
                  background: "var(--accent-2)",
                  color: "#fff",
                }}
              >
                HEATED · 225°F
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-start gap-4">
                <span className="text-xs uppercase font-bold text-[var(--faint)]">WOOD TYPE</span>
                <span className="text-sm font-bold uppercase text-[var(--text-strong)] text-right">Coconut Husk &amp; Cherrywood</span>
              </div>
              <hr className="border-dashed" style={{ borderColor: "var(--line)" }} />
              <div className="flex justify-between items-start gap-4">
                <span className="text-xs uppercase font-bold text-[var(--faint)]">CAPACITY</span>
                <span className="text-sm font-bold uppercase text-[var(--text-strong)] text-right">{productCount} active cuts · {categoryCount} shelves</span>
              </div>
              <hr className="border-dashed" style={{ borderColor: "var(--line)" }} />
              <div className="flex justify-between items-start gap-4">
                <span className="text-xs uppercase font-bold text-[var(--faint)]">SHOP HOURS</span>
                <span className="text-sm font-bold uppercase text-[var(--text-strong)] text-right">
                  <OpenStatus
                    open={branch.hours.open}
                    close={branch.hours.close}
                    display={branch.hours.display}
                  />
                </span>
              </div>
              <hr className="border-dashed" style={{ borderColor: "var(--line)" }} />
              <div className="flex justify-between items-start gap-4">
                <span className="text-xs uppercase font-bold text-[var(--faint)]">WAYFINDING</span>
                <span className="text-sm font-bold uppercase text-[var(--text-strong)] text-right">{branch.locality}</span>
              </div>
            </div>

            {/* Address & Direction button inside the frame */}
            <div className="mt-6 border-t-2 pt-4 flex flex-col gap-3" style={{ borderColor: "var(--line-strong)" }}>
              <div className="flex items-start gap-2.5">
                <MapPinIcon width={16} height={16} className="mt-0.5 shrink-0" style={{ color: "var(--accent)" }} />
                <span className="text-xs" style={{ color: "var(--muted)" }}>
                  {branch.address}
                </span>
              </div>
              <a
                href={links.maps}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost w-full py-2.5 text-center text-xs uppercase font-bold tracking-wider"
                style={{ minHeight: 40 }}
              >
                Google Maps Directions
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
