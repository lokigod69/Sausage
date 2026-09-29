/**
 * Prompts for the pictures the site is missing: category title images and
 * hero banners.
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

/*
 * Product thumbnails are a different job from the category pictures.
 *
 * They render at 44 pixels, next to a name, a price and a stock badge. At
 * that size a styled scene is mud: the sprig of rosemary is a green smudge,
 * the slate board is a grey smudge, and two different sausages look the same.
 * So these are shot like a catalogue, not like an editorial: one product,
 * filling the frame, plain ground, nothing else in shot, and whatever makes
 * this sausage different from the next one — colour, thickness, the grain of
 * the meat — as the loudest thing in the picture.
 */
export const PRODUCT_STYLE =
  "single product filling the frame on a plain dark slate background, straight-on catalogue product photograph, soft even light, no props, no garnish, no board, no cutlery, no packaging, no text, no logos, sharp throughout, natural colour";

export const HOUSE_STYLE =
  "premium realistic food photography, dark stone background, warm side light, appetizing but not fake, shallow depth of field, no text baked into image, no logos in frame, natural color, subtle film grain";

export interface ImagePrompt {
  /** Where the generated file should live under /public. */
  path: string;
  /** Already shot and wired in? */
  have: boolean;
  /** The subject-specific prompt (HOUSE_STYLE is appended at use time). */
  prompt: string;
  /**
   * Output shape. "card" is the 1200x900 category title image; "banner" is
   * the 1600x1000 hero slide, which is 16/10 on a wide screen and has the
   * copy panel sitting over its left half — so a banner prompt puts its
   * subject right of centre and leaves that side quiet. "product" is the
   * 800x800 square that renders as a 44px thumbnail beside a price.
   * Defaults to "card".
   */
  shape?: "card" | "banner" | "product";
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
    have: true,
    prompt:
      "a rustic loaf of dark rye bread, soft burger buns and a slice of sticky toffee pudding on a wooden board dusted with flour, bakery morning light",
  },
  "ready-meals": {
    path: "/products/ready-meals.jpg",
    have: true,
    prompt:
      "a baked beef lasagne in a white ceramic dish with one portion lifted out, steam rising, fork and linen napkin beside it",
  },
  "breakfast-cereals": {
    path: "/products/breakfast-cereals.jpg",
    have: true,
    prompt:
      "a bowl of rolled oats with honey drizzling in, a jar of muesli and a jug of milk on a linen cloth, soft morning window light",
  },
  "frozen-fruit-veg": {
    path: "/products/frozen-fruit-veg.jpg",
    have: true,
    prompt:
      "frozen berries, garden peas and green beans spilling from a paper bag onto dark slate, visible frost crystals, cold blue-tinged light against warm shadows",
  },
  "pantry-preserves": {
    path: "/products/pantry-preserves.jpg",
    have: true,
    prompt:
      "glass jars of jam, honey and pickles with a jar of peanut butter and a bottle of olive oil on a wooden pantry shelf, warm larder light",
  },
  "herbs-spices": {
    path: "/products/herbs-spices.jpg",
    have: true,
    prompt:
      "small mounds of paprika, black peppercorns, dried oregano and bay leaves on dark slate beside a brass spice spoon, top-down, rich colour",
  },
  "snacks-sweets": {
    path: "/products/snacks-sweets.jpg",
    have: true,
    prompt:
      "a broken bar of dark chocolate, salted pretzels and a handful of roasted nuts scattered on dark stone, evening light",
  },
  drinks: {
    path: "/products/drinks.jpg",
    have: true,
    prompt:
      "a cold bottle of beer with condensation, a glass of iced tea and a bottle of sparkling water on dark slate, backlit so the liquid glows",
  },

  /*
   * Hero banners, keyed by the promo they belong to in data/promos.ts. Wider
   * than the category cards, and composed for copy over the left half.
   *
   * No brand names, no signage, no readable text of any kind in these. The
   * delivery banner in particular must not put a courier's livery on a rider
   * — it is a picture of an order going out, not an endorsement, and an
   * invented logo on a real company's bike would be a small lie in a big
   * frame.
   */
  "banner-delivery": {
    path: "/banners/delivery.jpg",
    have: true,
    shape: "banner",
    prompt:
      "a delivery rider on a small motorbike on a palm-lined tropical island road at golden hour, a plain grey insulated food bag strapped behind the seat, seen from behind and to the right so the left third of the frame is open road and soft sky, no logos, no lettering, no branding on the bag or the bike",
  },
  "banner-pies": {
    path: "/banners/pies.jpg",
    have: true,
    shape: "banner",
    prompt:
      "three golden hand-sized meat pies on dark slate, one broken open to show a thick beef and gravy filling, steam rising, a fork and a linen cloth to the right, the left third of the frame empty dark surface, no packaging, no lettering",
  },
  "banner-ostrich": {
    path: "/banners/ostrich.jpg",
    have: true,
    shape: "banner",
    prompt:
      "two thick dark-red ostrich steaks resting on butcher paper beside a mound of coarse ground ostrich meat, cracked black pepper and a sprig of thyme, the deep burgundy colour of very lean red meat, arranged to the right of the frame with the left third empty dark stone, no packaging, no lettering",
  },

  /*
   * Sausage thumbnails. Each is written so it cannot be mistaken for the one
   * above it at 44 pixels: the Weisswurst is almost white, the merguez almost
   * brick, the Nuremberger finger-sized, the kielbasa a horseshoe. If two
   * prompts here ever start sounding alike, one of them is wrong.
   */
  "item-beef-hotdog": {
    path: "/products/items/beef-hotdog.jpg",
    have: false,
    shape: "product",
    prompt:
      "three smooth skinless beef hot dog sausages side by side, uniform deep reddish-brown, glossy, no casing wrinkles, blunt rounded ends",
  },
  "item-bratwurst-classic": {
    path: "/products/items/bratwurst-classic.jpg",
    have: false,
    shape: "product",
    prompt:
      "two thick pale beige-pink German bratwurst in natural casing, coarse visible meat grain through the skin, plump and slightly curved, raw",
  },
  "item-cervelat": {
    path: "/products/items/cervelat.jpg",
    have: false,
    shape: "product",
    prompt:
      "two short thick Swiss cervelat, smooth taut reddish-brown smoked skin, blunt tied ends, stubby barrel shape",
  },
  "item-cheese-hotdog": {
    path: "/products/items/cheese-hotdog.jpg",
    have: false,
    shape: "product",
    prompt:
      "two hot dog sausages, one split lengthways with bright melted orange cheese visible inside, pale golden-brown skin",
  },
  "item-chicken-chipolata": {
    path: "/products/items/chicken-chipolata.jpg",
    have: false,
    shape: "product",
    prompt:
      "a row of four thin pale chicken chipolatas still linked in a chain, narrow, twisted between each link, very pale cream colour, raw",
  },
  "item-english-bangers": {
    path: "/products/items/english-bangers.jpg",
    have: false,
    shape: "product",
    prompt:
      "three thick pale pink English pork bangers in a linked chain, smooth fine-textured filling, plump, raw",
  },
  "item-frankfurter": {
    path: "/products/items/frankfurter.jpg",
    have: false,
    shape: "product",
    prompt:
      "four long slender frankfurters, smooth taut pale reddish-orange skin, even thickness end to end, glossy",
  },
  "item-hungarian-cheesy": {
    path: "/products/items/hungarian-cheesy.jpg",
    have: false,
    shape: "product",
    prompt:
      "two Hungarian sausages, deep paprika-red coarse filling with clearly visible pale melted cheese pockets through the casing",
  },
  "item-hungarian-spicy": {
    path: "/products/items/hungarian-spicy.jpg",
    have: false,
    shape: "product",
    prompt:
      "two Hungarian sausages, intense dark paprika-red, coarse chunky meat grain visible through a taut casing, dusted red",
  },
  "item-italian-garlic": {
    path: "/products/items/italian-garlic.jpg",
    have: false,
    shape: "product",
    prompt:
      "two pale coarse-ground Italian sausages in natural casing with visible flecks of garlic and green herb through the skin, raw",
  },
  "item-italian-sausage": {
    path: "/products/items/italian-sausage.jpg",
    have: false,
    shape: "product",
    prompt:
      "two pale coarse-ground Italian pork sausages in natural casing with visible whole fennel seeds, raw",
  },
  "item-kielbasa": {
    path: "/products/items/kielbasa.jpg",
    have: false,
    shape: "product",
    prompt:
      "one thick U-shaped Polish kielbasa horseshoe, deep mahogany smoked skin, wrinkled taut casing, generous diameter",
  },
  "item-merguez": {
    path: "/products/items/merguez.jpg",
    have: false,
    shape: "product",
    prompt:
      "a coil of thin deep brick-red merguez lamb sausage wound into a spiral, narrow diameter, spiced red surface",
  },
  "item-nuernberger": {
    path: "/products/items/nuernberger.jpg",
    have: false,
    shape: "product",
    prompt:
      "six very small thin pale Nuremberg sausages in a neat row, finger-sized, fine pale beige filling, marjoram flecks, raw",
  },
  "item-special-hotdog": {
    path: "/products/items/special-hotdog.jpg",
    have: false,
    shape: "product",
    prompt:
      "three plump hot dog sausages, smooth glossy skin in a warm golden-brown, slightly thicker than a frankfurter, blunt ends",
  },
  "item-spicy-italian-fennel": {
    path: "/products/items/spicy-italian-fennel.jpg",
    have: false,
    shape: "product",
    prompt:
      "two coarse-ground Italian sausages in natural casing with visible red chilli flakes and whole fennel seeds through the pale filling, raw",
  },
  "item-thueringer": {
    path: "/products/items/thueringer.jpg",
    have: false,
    shape: "product",
    prompt:
      "three long slim Thuringian bratwurst, greyish-pink fine filling, noticeably longer and thinner than a classic bratwurst, raw",
  },
  "item-veal-bratwurst": {
    path: "/products/items/veal-bratwurst.jpg",
    have: false,
    shape: "product",
    prompt:
      "two very pale cream-coloured veal bratwurst, smooth fine-textured filling with no visible grain, plump, raw",
  },
  "item-weisswurst": {
    path: "/products/items/weisswurst.jpg",
    have: false,
    shape: "product",
    prompt:
      "two plump very pale grey-white Bavarian Weisswurst, smooth skin, tied ends, almost no colour, raw",
  },
  "item-wienerli": {
    path: "/products/items/wienerli.jpg",
    have: false,
    shape: "product",
    prompt:
      "a pair of slender Swiss Wienerli joined at one end, smooth pale reddish-tan skin, thin and even, glossy",
  },
};

/**
 * Compose a final prompt, with the style that suits the shape appended — the
 * editorial house style for a category picture or a banner, the flat
 * catalogue style for a product thumbnail.
 */
export function buildPrompt(key: keyof typeof IMAGE_PROMPTS): string {
  const spec = IMAGE_PROMPTS[key];
  const style = spec.shape === "product" ? PRODUCT_STYLE : HOUSE_STYLE;
  return `${spec.prompt}, ${style}`;
}

/** Slugs still waiting on a picture — category cards and banners alike. */
export function missingImages(): string[] {
  return Object.entries(IMAGE_PROMPTS)
    .filter(([, p]) => !p.have)
    .map(([slug]) => slug);
}
