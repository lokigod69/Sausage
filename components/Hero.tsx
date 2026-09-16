"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import type { Branch } from "@/lib/types";
import { branchLinks, DEFAULT_WA_MESSAGE } from "@/lib/contact";
import { HERO_SLIDES } from "@/data/promos";
import { OpenStatus } from "./OpenStatus";
import { MessengerIcon, PhoneIcon, ArrowUpRight } from "./icons";

/**
 * Hero banner — a rotating stage for the shop and its promotions.
 *
 * Slides come from data/promos.ts, first one always the shop itself. It
 * advances on its own so a promo is seen without interaction, but stops the
 * moment someone touches the controls: an auto-rotating banner that keeps
 * yanking the content away while you read it is worse than no rotation.
 * Respects prefers-reduced-motion by not rotating at all.
 *
 * With six promos behind the shop slide, a fixed order would mean the last
 * two were seen by almost nobody — at seven seconds a slide, a full cycle is
 * the better part of a minute and most visits are shorter than that. So the
 * rotation enters the promo list at a different point each visit. Slide 0 is
 * still always first and still what the server renders, so the promo list can
 * be as long as the shop wants without the tail going to waste.
 */
const ROTATE_MS = 7000;

export function Hero({ branch }: { branch: Branch }) {
  const links = branchLinks(branch, DEFAULT_WA_MESSAGE);
  const slides = HERO_SLIDES;
  const promoCount = Math.max(slides.length - 1, 1);

  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  /*
   * Where the promo run starts. Zero on the server and on the first paint —
   * a random value during render would not match what the server sent — and
   * chosen once after mount, before the first tick fires.
   */
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    setOffset(Math.floor(Math.random() * promoCount));
  }, [promoCount]);

  useEffect(() => {
    if (paused || slides.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(
      () => setIndex((i) => (i + 1) % slides.length),
      ROTATE_MS,
    );
    return () => clearInterval(id);
  }, [paused, slides.length]);

  /** Position in the slide list for a given step of the rotation. */
  const slideAt = (step: number) =>
    step === 0 ? 0 : 1 + ((step - 1 + offset) % promoCount);

  const current = slideAt(index);
  const slide = slides[current];

  return (
    <section className="relative overflow-hidden pt-8 sm:pt-12">
      {/* Warm arc behind the type — the one bit of the old hero worth keeping. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 -top-40 h-[34rem] w-[34rem] rounded-full"
        style={{
          background:
            "radial-gradient(circle, color-mix(in oklab, var(--accent) 34%, transparent), transparent 62%)",
        }}
      />

      <div className="wrap relative">
        {/*
          The page needs exactly one h1, and it must not change underneath a
          screen reader or a crawler every seven seconds. So the heading is
          the shop, stated once, and each slide's headline is an h2.
        */}
        <h1 className="sr-only">
          {branch.name} — meat and deli store in {branch.locality}
        </h1>

        <div
          className="hero-banner"
          aria-roledescription="carousel"
          aria-live="polite"
          onMouseEnter={() => setPaused(true)}
          onFocusCapture={() => setPaused(true)}
        >
          <div className="hero-banner__media">
            {slide.image ? (
              <Image
                src={slide.image}
                alt={slide.imageAlt ?? ""}
                fill
                priority={index === 0}
                sizes="(min-width: 1024px) 60vw, 100vw"
                className="object-cover"
              />
            ) : (
              <div className="hero-banner__fallback" aria-hidden />
            )}
            <div className="hero-banner__scrim" aria-hidden />
          </div>

          <div className="hero-banner__copy">
            {slide.eyebrow && <p className="eyebrow mb-4">{slide.eyebrow}</p>}
            <h2
              className="font-display balance text-[clamp(2.1rem,5.4vw,3.9rem)] font-semibold leading-[1.02] tracking-tightish"
              style={{ color: "var(--text-strong)" }}
            >
              {slide.headline}
            </h2>
            <p
              className="mt-4 max-w-xl text-base leading-relaxed sm:text-lg"
              style={{ color: "var(--muted)" }}
            >
              {slide.body}
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              {/* Messenger leads: in the Philippines it is the default way
                  people message a shop. Calling is the other half. */}
              <a
                href={links.messenger}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                <MessengerIcon width={18} height={18} />
                Message us
              </a>
              <a href={links.phone} className="btn btn-ghost">
                <PhoneIcon width={18} height={18} />
                Call
              </a>
              {slide.cta && (
                <a href={slide.cta.href} className="btn btn-ghost">
                  {slide.cta.label}
                  <ArrowUpRight width={17} height={17} />
                </a>
              )}
            </div>

            <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2">
              <OpenStatus
            open={branch.hours.open}
            close={branch.hours.close}
            display={branch.hours.display}
          />
              <span
                className="hero-address text-sm"
                style={{ color: "var(--faint)" }}
              >
                {branch.address}
              </span>
            </div>
          </div>

          {slides.length > 1 && (
            <div className="hero-banner__dots" role="tablist" aria-label="Banner slides">
              {slides.map((s, i) => (
                <button
                  key={s.headline}
                  type="button"
                  role="tab"
                  aria-selected={i === current}
                  aria-label={s.headline}
                  onClick={() => {
                    // Clicking a dot means "show me that one", so step to
                    // wherever the shuffled run currently puts it.
                    setIndex(i === 0 ? 0 : 1 + ((i - 1 - offset + promoCount) % promoCount));
                    setPaused(true);
                  }}
                  className="hero-banner__dot"
                  data-active={i === current}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
