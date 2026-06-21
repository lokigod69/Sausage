/**
 * Reusable AI image-generation prompts for future photography.
 *
 * These are NOT generated in code — they're a curated library so every asset
 * stays visually consistent. Generate externally, then drop files at the paths
 * noted in each prompt. See docs/image-generation-prompts.md for the long-form
 * brief, usage notes, and crop specs.
 *
 * Shared house style (append to every prompt):
 *   "premium realistic food photography, dark stone background, warm side
 *    light, appetizing but not fake, shallow depth of field, no text, no
 *    logos, natural color, fine grain"
 */

export const HOUSE_STYLE =
  "premium realistic food photography, dark stone background, warm side light, appetizing but not fake, shallow depth of field, no text baked into image, no logos in frame, natural color, subtle film grain";

export interface ImagePrompt {
  /** Where the generated file should live under /public. */
  path: string;
  /** Recommended crops to export. */
  crops: string[];
  /** The subject-specific prompt (HOUSE_STYLE is appended at use time). */
  prompt: string;
}

export const IMAGE_PROMPTS: Record<string, ImagePrompt> = {
  hero: {
    path: "/branches/panglao-hero.jpg",
    crops: ["3:2", "16:9"],
    prompt:
      "an elegant butcher and deli counter scene, arranged charcuterie board with sausages, a ribeye steak, a salmon fillet and a wedge of cheese on dark slate, brass accents, moody warm light",
  },
  sausages: {
    path: "/products/sausages.jpg",
    crops: ["4:3", "1:1"],
    prompt:
      "a coil of fresh German-style bratwurst and nuremberger sausages on a wooden board with rosemary, raw and uncooked, butcher style",
  },
  "steaks-beef": {
    path: "/products/steaks-beef.jpg",
    crops: ["4:3", "1:1"],
    prompt:
      "a thick raw ribeye steak with marbling on dark stone, sea salt flakes and a sprig of thyme, dry-aged premium beef",
  },
  poultry: {
    path: "/products/poultry.jpg",
    crops: ["4:3", "1:1"],
    prompt:
      "a fresh whole chicken and chicken breast fillets on parchment over dark slate, clean and raw, butcher presentation",
  },
  lamb: {
    path: "/products/lamb.jpg",
    crops: ["4:3", "1:1"],
    prompt:
      "a frenched rack of lamb raw on dark stone with rosemary and cracked pepper, premium butcher cut",
  },
  "hams-cold-cuts": {
    path: "/products/hams-cold-cuts.jpg",
    crops: ["4:3", "1:1"],
    prompt:
      "thinly sliced cured ham, mortadella and salami arranged in folds on dark slate, deli charcuterie board",
  },
  bacon: {
    path: "/products/bacon.jpg",
    crops: ["4:3", "1:1"],
    prompt:
      "thick-cut wood-smoked streaky bacon rashers stacked on parchment over dark stone, raw and rich",
  },
  "seafood-salmon": {
    path: "/products/seafood-salmon.jpg",
    crops: ["4:3", "1:1"],
    prompt:
      "a glistening fresh salmon fillet portion with a lemon wedge and ice on dark wet stone",
  },
  "meals-bakery": {
    path: "/products/meals-bakery.jpg",
    crops: ["4:3", "1:1"],
    prompt:
      "a golden meat pie and a sausage roll beside a flaky croissant on dark slate, warm rustic bakery feel",
  },
  "todays-pick": {
    path: "/products/todays-pick.jpg",
    crops: ["1:1", "4:3"],
    prompt:
      "a single beautifully lit salmon fillet and a ribeye steak side by side on dark slate, the day's fresh picks, brass tag nearby with no text",
  },
};

/** Compose a final prompt string with the shared house style appended. */
export function buildPrompt(key: keyof typeof IMAGE_PROMPTS): string {
  return `${IMAGE_PROMPTS[key].prompt}, ${HOUSE_STYLE}`;
}
