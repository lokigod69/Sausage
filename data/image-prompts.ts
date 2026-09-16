/**
 * Prompts for the category title images.
 *
 * These are NOT generated in code — they are a curated brief so every picture
 * on the site looks like it came from the same shoot. Generate externally,
 * then drop the file at the `path` below and add the slug to
 * CATEGORY_PHOTO_SLUGS in data/category-images.ts. Until then the category
 * page falls back to a tinted panel, which is deliberate and looks fine.
 *
 * Keys are the category slugs from data/branches.ts, so the list here and the
 * fourteen categories on the site stay in step. `have: true` means the file
 * already exists in /public.
 *
 * Every image is 1200x900 (4:3). The category hero crops wide on desktop and
 * the same file is the page's Open Graph image, where Facebook and Messenger
 * want roughly 1.91:1 and crop the top and bottom — so keep the subject
 * centred and leave air at the edges.
 *
 * See docs/image-generation-prompts.md for the long-form brief.
 */

export const HOUSE_STYLE =
  "premium realistic food photography, dark stone background, warm side light, appetizing but not fake, shallow depth of field, no text baked into image, no logos in frame, natural color, subtle film grain";

export interface ImagePrompt {
  /** Where the generated file should live under /public. */
  path: string;
  /** Already shot and wired in? */
  have: boolean;
  /** The subject-specific prompt (HOUSE_STYLE is appended at use time). */
  prompt: string;
}

/** Keyed by category slug — see featuredCategories in data/branches.ts. */
export const IMAGE_PROMPTS: Record<string, ImagePrompt> = {
  hero: {
    path: "/branches/panglao-hero.jpg",
    have: true,
    prompt:
      "an elegant butcher and deli counter scene, arranged charcuterie board with sausages, a ribeye steak, a salmon fillet and a wedge of cheese on dark slate, brass accents, moody warm light",
  },
  sausages: {
    path: "/products/sausages.jpg",
    have: true,
    prompt:
      "a coil of fresh German-style bratwurst and nuremberger sausages on a wooden board with rosemary, raw and uncooked, butcher style",
  },
  "steaks-beef": {
    path: "/products/steaks-beef.jpg",
    have: true,
    prompt:
      "a thick marbled ribeye and a tenderloin steak on butcher paper with cracked pepper and a sprig of thyme, raw, dry-aged look",
  },
  poultry: {
    path: "/products/poultry.jpg",
    have: true,
    prompt:
      "raw chicken breast fillets and a whole trussed chicken on a light wooden board with herbs, clean and fresh",
  },
  "seafood-salmon": {
    path: "/products/seafood-salmon.jpg",
    have: true,
    prompt:
      "a glistening raw salmon fillet beside prawns and a whole fish on crushed ice with a lemon half, fishmonger counter",
  },
  "hams-deli": {
    path: "/products/hams-deli.jpg",
    have: true,
    prompt:
      "folded slices of honey ham, black forest ham and salami fanned on a slate board with cornichons, deli counter",
  },
  "cheese-dairy": {
    path: "/products/cheese-dairy.jpg",
    have: true,
    prompt:
      "a wedge of aged gouda, a block of cheddar and a ball of mozzarella on a marble slab with walnuts and grapes",
  },

  // The eight still outstanding. Each one is a category landing page that
  // currently opens on a tinted panel instead of a photograph.
  "bakery-desserts": {
    path: "/products/bakery-desserts.jpg",
    have: false,
    prompt:
      "a rustic loaf of dark rye bread, soft burger buns and a slice of sticky toffee pudding on a wooden board dusted with flour, bakery morning light",
  },
  "ready-meals": {
    path: "/products/ready-meals.jpg",
    have: false,
    prompt:
      "a baked beef lasagne in a white ceramic dish with one portion lifted out, steam rising, fork and linen napkin beside it",
  },
  "breakfast-cereals": {
    path: "/products/breakfast-cereals.jpg",
    have: false,
    prompt:
      "a bowl of rolled oats with honey drizzling in, a jar of muesli and a jug of milk on a linen cloth, soft morning window light",
  },
  "frozen-fruit-veg": {
    path: "/products/frozen-fruit-veg.jpg",
    have: false,
    prompt:
      "frozen berries, garden peas and green beans spilling from a paper bag onto dark slate, visible frost crystals, cold blue-tinged light against warm shadows",
  },
  "pantry-preserves": {
    path: "/products/pantry-preserves.jpg",
    have: false,
    prompt:
      "glass jars of jam, honey and pickles with a jar of peanut butter and a bottle of olive oil on a wooden pantry shelf, warm larder light",
  },
  "herbs-spices": {
    path: "/products/herbs-spices.jpg",
    have: false,
    prompt:
      "small mounds of paprika, black peppercorns, dried oregano and bay leaves on dark slate beside a brass spice spoon, top-down, rich colour",
  },
  "snacks-sweets": {
    path: "/products/snacks-sweets.jpg",
    have: false,
    prompt:
      "a broken bar of dark chocolate, salted pretzels and a handful of roasted nuts scattered on dark stone, evening light",
  },
  drinks: {
    path: "/products/drinks.jpg",
    have: false,
    prompt:
      "a cold bottle of beer with condensation, a glass of iced tea and a bottle of sparkling water on dark slate, backlit so the liquid glows",
  },
};

/** Compose a final prompt string with the shared house style appended. */
export function buildPrompt(key: keyof typeof IMAGE_PROMPTS): string {
  return `${IMAGE_PROMPTS[key].prompt}, ${HOUSE_STYLE}`;
}

/** Category slugs still waiting on a photograph. */
export function missingImages(): string[] {
  return Object.entries(IMAGE_PROMPTS)
    .filter(([, p]) => !p.have)
    .map(([slug]) => slug);
}
