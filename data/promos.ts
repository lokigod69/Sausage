/**
 * Hero banner slides.
 *
 * The first slide is the shop itself and always leads. Everything after it is
 * a promotion. Adding one means adding an entry here — no component changes.
 *
 * The Hero shows slide 0 first and then enters the promo list at a different
 * point each visit, so slide 6 is seen as often as slide 1. That is what lets
 * this list be six promos long instead of two; see components/Hero.tsx.
 *
 * `image` points at a file under /public. A slide with no image still works:
 * it falls back to the warm gradient, so a promo can go live before the
 * photograph exists. `href` is optional — when the promo is about products
 * the site already lists, point it at that category page rather than
 * inventing a landing page.
 *
 * PRICES HERE ARE HAND-WRITTEN. The catalogue below the hero is live from the
 * POS; this is not. They are all phrased "from ₱X" so they stay true when a
 * price rises, but check them when the price list changes — a banner that
 * undercuts the counter is worse than a banner with no number.
 *
 * On the writing: short sentences, ordinary words. A good share of the people
 * reading this speak English as a second or third language, and the copy has
 * to be as easy for a family in Dauis as for a German expat in Bolod.
 *
 * And it has to be true. This is a meat and deli store first. Counter work is
 * real — steaks cut to order, cold cuts sliced to order, ground beef and the
 * burgers made here — but the charcuterie comes from small local and homemade
 * producers and the steaks are imported, so nothing here sells the place as a
 * butcher's shop that cures its own hams.
 */
import { IMAGE_PROMPTS } from "./image-prompts";

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

/**
 * Attach a generated banner, but only once it exists.
 *
 * data/image-prompts.ts already tracks which pictures have been made — the
 * generator flips `have` when it writes the file. Reading that here lets a
 * slide name its banner before the picture exists without shipping a broken
 * image: until then the slide renders on the warm gradient, which is a
 * perfectly good backdrop, and the photograph appears on the next build after
 * `npm run gen:images` without anyone editing this file.
 */
function banner(key: string, alt: string): Partial<HeroSlide> {
  const spec = IMAGE_PROMPTS[key];
  return spec?.have ? { image: spec.path, imageAlt: alt } : {};
}

export const HERO_SLIDES: HeroSlide[] = [
  {
    eyebrow: "Meat & deli store — Panglao, Bohol",
    headline: "Good meat. Fair prices. Every day.",
    body: "Steaks from the US and Brazil, cut to order. Sausages and cold cuts from small local makers, sliced while you wait. Cheese, seafood and the everyday things too — one small store in Bolod, restocked daily.",
    image: "/branches/panglao-hero.jpg",
    imageAlt:
      "The Sausage Guy counter: ribeye, cheese, charcuterie and sausages on dark slate",
    cta: { label: "See everything we carry", href: "#products" },
  },
  {
    eyebrow: "The steak counter",
    headline: "US Choice and Brazilian grass-fed.",
    body: "Brazilian chuck eye from ₱900 a kilo, ribeye from ₱1,200. USDA Choice Black Angus from ₱2,850. We cut it to the thickness you ask for, so a steak for one is not a steak for four.",
    image: "/products/steaks-beef.jpg",
    imageAlt: "A marbled ribeye and a tenderloin steak on butcher paper",
    cta: { label: "See the steaks", href: "/panglao/meat-steaks" },
  },
  {
    eyebrow: "The reason for the name",
    headline: "Twenty-five sausages, by the kilo.",
    body: "Bratwurst, Nürnberger, Weisswurst, cheesekrainer, Landjäger, bangers and Merguez, from ₱850 a kilo. Made by hand by small local producers, to the recipes they came from.",
    image: "/products/sausages.jpg",
    imageAlt: "Fresh German-style bratwurst on a wooden board",
    cta: { label: "See the sausages", href: "/panglao/sausages" },
  },
  {
    eyebrow: "We deliver",
    headline: "Order by Messenger, get it by Maxim.",
    body: "We send orders across Panglao, Dauis, Tagbilaran, Baclayon, Alburquerque and Cortes by Maxim. Message us what you need, we pack it, you pay the rider for the ride.",
    ...banner(
      "banner-delivery",
      "A delivery rider on a palm-lined Panglao road with an insulated food bag",
    ),
    cta: { label: "How delivery works", href: "#delivery" },
  },
  {
    // Zac's Pie House is a separate supplier from the Ready-Cook Expat Meals
    // that are being wound down, so this promo outlives that change — but if
    // the Ready Meals category is ever retired, this href moves with the pies.
    eyebrow: "Dinner, sorted",
    headline: "Twelve pies from Zac's Pie House.",
    body: "Beef and mushroom, beef curry, pulled pork, breakfast, vegetarian — ₱245 each, and ₱215 for apple or choco brownie. Twenty minutes in your oven and it is done.",
    ...banner("banner-pies", "Golden meat pies, one broken open to show the filling"),
    cta: { label: "See the pies", href: "/panglao/ready-meals" },
  },
  {
    eyebrow: "What Bohol doesn't grow",
    headline: "Real berries. Straight from the freezer.",
    body: "Blueberries from ₱120 for 250g, strawberries, raspberries and mixed berries by the kilo. Broccoli, cauliflower, green asparagus and peas too — picked and frozen properly, not dried out.",
    ...banner(
      "banner-frozen",
      "Frosted blueberries, raspberries and strawberries with asparagus and broccoli",
    ),
    cta: { label: "See frozen fruit & veg", href: "/panglao/frozen-fruit-veg" },
  },
  {
    eyebrow: "New in",
    headline: "Ostrich, now at the counter.",
    body: "Lean, high in iron and genuinely different: ostrich steaks at ₱1,750 a kilo, and 1kg packs of ground ostrich at ₱950 for burgers and ragù. Limited supply from Big Bird.",
    ...banner(
      "banner-ostrich",
      "Two dark-red ostrich steaks on butcher paper beside coarse ground ostrich",
    ),
    cta: { label: "See the ostrich cuts", href: "/panglao/meat-steaks" },
  },
];
