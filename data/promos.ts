/**
 * Hero banner slides.
 *
 * The first slide is the shop itself and always leads. Anything after it is a
 * promotion, shown in order and rotated automatically. Adding one means
 * adding an entry here — no component changes.
 *
 * `image` points at a file under /public. A slide with no image still works:
 * it falls back to the warm gradient, so a promo can go live before the
 * photograph exists.
 *
 * `href` is optional. When the promo is about products the site already
 * lists, point it at that category page rather than inventing a landing page.
 */
export interface HeroSlide {
  /** Small line above the headline, e.g. "New in". */
  eyebrow?: string;
  headline: string;
  body: string;
  image?: string;
  /** Alt text — required whenever `image` is set. */
  imageAlt?: string;
  cta?: { label: string; href: string };
}

export const HERO_SLIDES: HeroSlide[] = [
  {
    eyebrow: "Butcher & deli — Panglao, Bohol",
    headline: "Provisions for the good life.",
    body: "Steaks, Pacific salmon, hand-tied sausages, hams and European deli goods — one small counter in Bolod, stocked daily.",
    image: "/branches/panglao-hero.jpg",
    imageAlt:
      "The Sausage Guy counter: ribeye, cheese, charcuterie and sausages on dark slate",
    cta: { label: "See everything we carry", href: "#products" },
  },
  {
    eyebrow: "New in",
    headline: "Ostrich, now at the counter.",
    body: "Lean, iron-rich and genuinely different: choice-cut ostrich steaks by the kilo, and 1kg packs of ground ostrich for burgers and ragù. Limited supply from Big Bird.",
    // No photograph yet — the slide renders on the gradient until one exists.
    cta: { label: "See the ostrich cuts", href: "/panglao/meat-steaks" },
  },
];
