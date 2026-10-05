/**
 * Overrides applied to POS rows on their way to the public catalog.
 *
 * Two jobs:
 *   1. WEIGHT_PRICES — counter prices for items Loyverse prices as VARIABLE
 *      (weighed at the till, so the POS holds no number). Taken from the
 *      owner's "Sausage Guy Pricelist" sheet, Sell Price column only.
 *   2. EXCLUDED_PRODUCTS — POS entries that are not products at all.
 *
 * Keys are the EXACT Loyverse item name, including its quirks ("Honey ham",
 * "Mergese Sausage", "Farmers Ham"). Matching is case-insensitive but
 * otherwise literal, so renaming an item in Loyverse drops its override —
 * `npm run sync:loyverse` prints anything left unpriced so the gap shows up
 * on the next sync rather than silently.
 *
 * NOTE: the source sheet also carries Buy Price and Margin columns. Those are
 * deliberately not reproduced here — see the boundary note in lib/types.ts.
 */

/*
 * Relative, with the extension, NOT "@/data/image-prompts".
 *
 * This file is imported by scripts/sync-loyverse.mts and friends, which Node
 * runs directly through type-stripping — and Node does not know the "@/"
 * alias. A value import written that way builds fine in Next and then kills
 * every script with ERR_MODULE_NOT_FOUND, which is how it got in: the app
 * kept working, so nothing complained until someone ran the sync.
 *
 * Type-only imports are safe either way, because type-stripping removes them
 * before the resolver ever sees them — which is why data/branches.ts can say
 * "@/lib/types" and get away with it. Anything that survives to runtime has
 * to be relative.
 */
import { IMAGE_PROMPTS } from "./image-prompts.ts";

export interface WeightPrice {
  /** Counter sell price in PHP. */
  price: number;
  /** Unit this price is quoted for. */
  unit: string;
}

const PER_KG = (price: number): WeightPrice => ({ price, unit: "per kg" });

export const WEIGHT_PRICES: Record<string, WeightPrice> = {
  // ---- Sausages -------------------------------------------------------
  "Thüringerian Bratwurst": PER_KG(850),
  "Bratwurst (Classic)": PER_KG(850), // sheet: "Bratwurst (Standard)"
  "Veal Beef Bratwurst": PER_KG(850),
  "Nuernberger Sausage": PER_KG(850),
  "Mergese Sausage": PER_KG(1150),
  "Hungarian Spicy Sausage": PER_KG(850),
  "Hungarian Cheesy Sausage": PER_KG(850),
  "White Sausage": PER_KG(850),
  "English Bangers": PER_KG(850),
  "Italian Sausage": PER_KG(850), // sheet: "Spicy Italian"
  "Spicy Italian with Fennel": PER_KG(850),
  "Italian Garlic": PER_KG(850),
  Cheesekrainer: PER_KG(900), // sheet: "Cheese Krainer"
  Cervelat: PER_KG(730),
  Kielbasa: PER_KG(950),
  Frankfurter: PER_KG(650),
  "Chicken Chipolata": PER_KG(650),
  Wienerli: PER_KG(750),
  "Beer Sticks": PER_KG(1350),
  Landjaeger: PER_KG(1150),
  "Buure Schueblig": PER_KG(1200),
  "Beef Hotdog": PER_KG(600),
  "Cheese Hotdog": PER_KG(650),
  "Special Hotdog": PER_KG(600),

  // ---- Beef -----------------------------------------------------------
  "Brazilian Chuckeye Steak": PER_KG(900),
  "Brazilian Ribeye Steak": PER_KG(1200),
  "Brazilian Beef Tenderloin Steak": PER_KG(1700),
  "USDA Choice Angus Ribeye (St. Helens)": PER_KG(3300),
  "USDA Choice Black Angus Ribeye(Nebraska)": PER_KG(2850), // "Nebraska Star"
  "USDA Choice Black Angus Ribeye (Demkota)": PER_KG(3150),
  "USDA Prime Excel Chuckeye": PER_KG(1250),
  "USDA Tenderloin": PER_KG(2450),
  "Australian Veal Beef Liver": PER_KG(1000),

  // ---- Poultry --------------------------------------------------------
  "Brazilian Chicken Wings": PER_KG(340),
  "Duck Breast(Dalee)": PER_KG(900),
  "Whole Turkey (Carolina)": PER_KG(550),

  // ---- Lamb & other meat ----------------------------------------------
  "Lamb Shanks": PER_KG(1500),
  "Picnic Bacon": PER_KG(1300),
  "Beef and Lamb Kofta": PER_KG(1350),
  "Ostrich Steak (Big Bird)": PER_KG(1750), // sheet: "Ostrich Choice Cut Steaks"

  // ---- Hams & cold cuts -----------------------------------------------
  "Meat Loaf (Sliced)": PER_KG(900),
  Lyoner: PER_KG(800),
  "Pepperoni Lyoner": PER_KG(850),
  Mortadella: PER_KG(980),
  "Beef Salami": PER_KG(920),
  Florentiner: PER_KG(870),
  "Polish (Beef Cold Cut)": PER_KG(850),
  "Cooked Ham": PER_KG(1050),
  "Chicken Ham": PER_KG(800),
  "Turkey Ham": PER_KG(1100),
  "Beef Pastrami": PER_KG(1050),
  // Farmers, Forest and Honey ham are not priced here: the shop sells them as
  // 200g packs at a fixed price, and those POS entries carry their own price.
  // The kilo variants are hidden — see EXCLUDED_PRODUCTS.

  // ---- Cheese ---------------------------------------------------------
  "Emmenthaler (Emborg)": PER_KG(1350),
  "Gran Amici (Emborg)": PER_KG(1900),
  "Grana Padano (Emborg)": PER_KG(2200),
  "White Cheddar (Emborg)": PER_KG(1100),

  // ---- Seafood --------------------------------------------------------
  Pompano: PER_KG(365),
  "Cream Dory 1kg": PER_KG(195),
  // Portioned/cut salmon. Whole salmon is ₱1500/kg, but the POS carries no
  // whole-salmon item — add one in Loyverse and it can be priced here too.
  "Salmon Fillet": PER_KG(1600),

  // ---- Own-label counter goods ----------------------------------------
  // Sold under the shop's own label; supplier varies (currently Emborg), so
  // the brand is not shown — see DISPLAY_NAMES below. All three prices
  // confirmed by the owner on 16 Sep 2026.
  "Premium Red Cheddar (Sausage Guy)": PER_KG(1120),
  // Priced by the kilo, handed over as a pack: the pack is weighed at the
  // till, so "per kg" is the honest label even though nobody buys a loose kilo.
  "Mozzarella Cheese (Sausage Guy)": PER_KG(745),
};

/**
 * Public-facing names, replacing the POS name on the website.
 *
 * Used where the POS name carries a supplier brand the shop does not want to
 * advertise: cheese and chicken are bought from whoever has stock that week,
 * so naming this week's supplier would turn a substitution into a broken
 * promise. Price lookups above still use the POS name, so renaming here is
 * purely cosmetic.
 */
export const DISPLAY_NAMES: Record<string, string> = {
  // The cheese counter, and the rule for it: a cheese WE repack into household
  // units loses its brand, a sealed pack from the producer keeps it.
  //
  // The two are easy to tell apart and the POS already does. Anything priced
  // PER_KG above is variable weight, which means it was portioned here — those
  // are the ones below. Anything with a gram weight in its name (Castello 100g,
  // Bayernland 100g, Euro Chef 226g, Arla 200g, the 130g burger slices) arrives
  // sealed from the producer, and that brand is part of what is being bought,
  // so it stays on the shelf label and on the site.
  //
  // Why hide ours at all: the supplier behind an own-label cheese can change
  // between visits, and naming this week's would turn a substitution into a
  // broken promise.
  "Premium Red Cheddar (Sausage Guy)": "Premium Red Cheddar",
  "Mozzarella Cheese (Sausage Guy)": "Mozzarella Cheese",
  "White Cheddar (Emborg)": "White Cheddar",

  // Missing space in the POS name; cosmetic only, so it is fixed here
  // rather than by renaming the item someone has to find at the till.
  "Duck Breast(Dalee)": "Duck Breast (Dalee)",
  "Emmenthaler (Emborg)": "Emmenthaler",
  "Gran Amici (Emborg)": "Gran Amici",
  "Grana Padano (Emborg)": "Grana Padano",

};

const displayNames = new Map(
  Object.entries(DISPLAY_NAMES).map(([pos, shown]) => [pos.toLowerCase(), shown]),
);

/** The name to show a visitor, which is the POS name unless overridden. */
export function getDisplayName(productName: string): string {
  return displayNames.get(productName.trim().toLowerCase()) ?? productName;
}

/**
 * Categories for POS items that have none.
 *
 * An item with no category in Loyverse lands in "Other" — a bucket of 55
 * items with no featured card, collapsed by default. The ostrich steaks and
 * the cakes were sitting in there: on the site, but effectively unfindable.
 *
 * Keyed by the Loyverse ITEM name (not the variant), so one entry covers all
 * nine "Cake in a Tub" flavours. Applied ONLY when the POS has no category of
 * its own, so categorising an item in Loyverse — the durable fix — always
 * wins over this list.
 */
export const UNCATEGORISED_CATEGORIES: Record<string, string> = {
  // ---- Meat & steaks ---------------------------------------------------
  "Ostrich Steak (Big Bird)": "Meat & Steaks",
  "Ostrich Ground 1kg (Big Bird)": "Meat & Steaks",
  "Australian Veal Beef Liver": "Meat & Steaks",
  "Beef and Lamb Kofta": "Meat & Steaks",
  "USDA Choice Black Angus Ribeye (Demkota)": "Meat & Steaks",

  // ---- Poultry ---------------------------------------------------------
  "Whole Brazilian Chicken 1.3kg (Seara)": "Poultry",
  "Whole Chicken Leg 2kg (Coopavel)": "Poultry",
  "Chicken Boneless Legs 2kg (Seara)": "Poultry",
  "Frozen Chicken Breast in Halves 2kg (Avivar)": "Poultry",

  // ---- Cold cuts & sausages -------------------------------------------
  // The POS names carry a "(not 200g pack)" suffix; match it exactly.
  "Honey ham(not 200g pack)": "Hams & Cold Cuts",
  "Forest Ham (Not 200g)": "Hams & Cold Cuts",
  Cervelat: "Sausages",

  // ---- Added to the POS without a category, found by the October sync ---
  "Dark Chocolate Pistachio Kunafa": "Bakery & Desserts",
  "Hormel Chili with Beans 425g": "Pantry & Preserves",
  "Olive Oil Mayonnaise 887ml (Kraft)": "Pantry & Preserves",

  // ---- Bakery counter --------------------------------------------------
  "Croissant 2-pack": "Bakery & Desserts",
  "Pain au Chocolate 2-pack": "Bakery & Desserts",
  "Cinnamon Rolls 2-pack": "Bakery & Desserts",
  "Sourdough Bread 2-pack": "Bakery & Desserts",
  "Sausage Roll": "Bakery & Desserts",
  "Cornish Pasty": "Bakery & Desserts",
  "Baked Puff": "Bakery & Desserts",
  "Cake in a Tub": "Bakery & Desserts",

  // ---- Dairy -----------------------------------------------------------
  "Ice Cream": "Cheese & Dairy",
  "Goat Milk Icecream": "Cheese & Dairy",
  "Kefir Homemade": "Cheese & Dairy",

  // ---- Drinks ----------------------------------------------------------
  "Dr Pepper 350ml": "Drinks",
  "Rhodes 1L": "Drinks",
  "Cawarra Cabernet Merlot 750ml (Lindemann)": "Drinks",

  // ---- Sauces & pantry -------------------------------------------------
  "Barbecue Sauce (Sweet Baby Ray's)": "Pantry & Preserves",
  "Original Dijon Mustard 185g(Kühne)": "Pantry & Preserves",
  "Sweet Mustard 260g(Kühne)": "Pantry & Preserves",
  "Organic Apple Cider Vinegar 946ml (Kirkland Signature)":
    "Pantry & Preserves",
  "Cherry Tomatoes 425ml(Mazza)": "Pantry & Preserves",
  "Red Kidney Beans (Dolce Vita)": "Pantry & Preserves",
  "Grünkohl nach Oldenburger Art 660g (Kühne)": "Pantry & Preserves",
  "Peanut Butter Creamy 800g (Member's Value)": "Pantry & Preserves",
  "Peanut Butter Crunchy 800g (Member's Value)": "Pantry & Preserves",

  // ---- Everything else -------------------------------------------------
  "Protein Instant Oatmeal 500G (Picky Farm)": "Breakfast & Cereals",
  "Sunflower Seed ( spiced flavor)": "Snacks & Sweets",
  "Rock Salt 50g": "Herbs & Spices",
  "Sesame Seeds Black 50g (Chef's Cabinet)": "Herbs & Spices",
  "Bambi Spring Roll 200g(Lumpia Wrapper)": "Bakery & Desserts",

  // Deliberately absent: "Delivery Fee" and "No Item (Put Price
  // Individually)". They are till mechanics and are hidden from the site
  // entirely — see EXCLUDED_PRODUCTS below.
};

/**
 * Items whose POS category is simply wrong, corrected even though Loyverse
 * has an opinion — the one place the POS does not win.
 *
 * Each of these is a filing mistake rather than a matter of taste: hotdogs
 * are sausages however early in the day you eat them, and buns are bakery
 * whatever you put in them. Fix them in Loyverse and delete the line here;
 * the result on the site is identical either way.
 */
export const MISFILED_CATEGORIES: Record<string, string> = {
  // Filed under "Breakfast" in the POS.
  "Beef Hotdog": "Sausages",
  "Cheese Hotdog": "Sausages",
  "Special Hotdog": "Sausages",
  "Breakfast Sausage Patty": "Sausages",

  // Filed under "Ready-Cook Expat Meals" in the POS.
  "Burger Buns (Pack of 2)": "Bakery & Desserts",
  "Hotdog Buns 2-pack": "Bakery & Desserts",

  // Filed under "Snacks" in the POS. A spread for bread belongs with the
  // other spreads — and the Member's Value jars of the same thing already
  // sit in Pantry, so leaving these in Snacks split one product across two
  // categories.
  "Peanut Butter Creamy 800g (Herman)": "Pantry & Preserves",
  "Peanut Butter Crunchy 800g (Herman)": "Pantry & Preserves",

  // Oats are breakfast, not a snack — every other oat product is already in
  // Breakfast & Cereals.
  "Rolled Oats 200G (Nature Food)": "Breakfast & Cereals",

  // A pudding is a dessert.
  "Sticky Toffee Pudding": "Bakery & Desserts",
};

const misfiled = new Map(
  Object.entries(MISFILED_CATEGORIES).map(([name, cat]) => [
    name.toLowerCase(),
    cat,
  ]),
);

/** Corrected category for an item the POS has filed in the wrong place. */
export function getMisfiledCategory(itemName: string): string | undefined {
  return misfiled.get(itemName.trim().toLowerCase());
}

/**
 * Categories for single VARIANTS, keyed on the full "Item — Variant" name.
 *
 * UNCATEGORISED_CATEGORIES is keyed on the Loyverse item name, which is right
 * for "Cake in a Tub" — nine flavours, one shelf. It is wrong when one item
 * holds variants belonging to different aisles, and a single entry cannot
 * send them to three places. This is where that case goes.
 *
 * Empty today. It was written for "Slabs/ In Packs", whose fourteen variants
 * span the cold-cut counter, the sausage counter and a side of salmon — and
 * then that item turned out to be a till entry rather than a shelf, so it is
 * hidden by EXCLUDED_PREFIXES instead. The mechanism stays because the
 * problem it solves is real and was not obvious: without it an item is one
 * category, whatever its variants are.
 */
export const VARIANT_CATEGORIES: Record<string, string> = {};

const variantCategories = new Map(
  Object.entries(VARIANT_CATEGORIES).map(([name, cat]) => [
    name.trim().toLowerCase(),
    cat,
  ]),
);

/** Category for one variant, when its item-level answer would be wrong. */
export function getVariantCategory(fullName: string): string | undefined {
  return variantCategories.get(fullName.trim().toLowerCase());
}

const fallbackCategories = new Map(
  Object.entries(UNCATEGORISED_CATEGORIES).map(([name, cat]) => [
    name.toLowerCase(),
    cat,
  ]),
);

/** Category for an item the POS left uncategorised, if we have an opinion. */
export function getFallbackCategory(itemName: string): string | undefined {
  return fallbackCategories.get(itemName.trim().toLowerCase());
}

/**
 * POS entries that are till mechanics, not things a customer buys. They were
 * appearing in the public product list.
 */
export const EXCLUDED_PRODUCTS: string[] = [
  "Delivery Fee",
  "No Item (Put Price Individually)",
  /*
   * "Frozen Chicken Breast in Halves 2kg (Avivar)" used to be hidden here as
   * a duplicate of "Brazilian Chicken Breast 2kg". It has since been merged
   * in Loyverse, so the entry is gone and the exclusion with it — the stock
   * count on the site is whole again.
   */

  /*
   * The by-the-kilo counterparts of three hams the shop normally sells only
   * as 200g packs at a fixed price (owner, 16 Sep 2026). Both entries exist in
   * the POS, so the site was listing each ham twice — once at PHP 220-240 for
   * a pack and once at a per-kilo rate. The fixed-price pack entries stay.
   *
   * If you start selling these by the kilo again, delete the three lines below
   * and add their per-kilo prices to WEIGHT_PRICES.
   */
  "Forest Ham (Not 200g)",
  "Honey ham(not 200g pack)",

  /*
   * An older, sizeless duplicate of "Oregano Flakes 50g (Chef's Cabinet)",
   * which is the product actually stocked (owner, 16 Sep 2026). Its POS stock
   * had drifted to -2, which is what a dead entry looks like. Hidden here;
   * deleting it in Loyverse is the tidier end of the same fix.
   */
];

const excluded = new Set(EXCLUDED_PRODUCTS.map((n) => n.toLowerCase()));

/**
 * Whole POS items to hide, matched on the front of the variant name.
 *
 * "Slabs/ In Packs" is one Loyverse item with fourteen variants — Lyoner,
 * Pastrami, Nuernberger, a side of salmon. It is not a shelf. It is how the
 * counter rings up a whole slab or a bulk pack instead of a sliced order, and
 * the names are written for staff: "O Lyoner", "P Lyoner", "Beef polish".
 * None of them carries a price either, so each one rendered as a product with
 * "BY WEIGHT" and no number.
 *
 * It was hidden by accident before — it sat uncategorised in "Other", which
 * has no card and stays collapsed — and the October sync pass filed those
 * variants into the real aisles, which put fourteen till entries on the
 * sausage and cold-cut pages. Hiding it on purpose now.
 *
 * A prefix rather than fourteen names, because the counter adds variants to
 * this item as the range changes and every one of them belongs behind the
 * till too.
 */
export const EXCLUDED_PREFIXES: string[] = ["Slabs/ In Packs"];

const excludedPrefixes = EXCLUDED_PREFIXES.map((p) => p.trim().toLowerCase());

export function isExcludedProduct(productName: string): boolean {
  const name = productName.trim().toLowerCase();
  return (
    excluded.has(name) || excludedPrefixes.some((p) => name.startsWith(p))
  );
}

const weightPrices = new Map(
  Object.entries(WEIGHT_PRICES).map(([name, v]) => [name.toLowerCase(), v]),
);

export function getWeightPrice(productName: string): WeightPrice | undefined {
  return weightPrices.get(productName.trim().toLowerCase());
}

/**
 * Product photographs we hold ourselves, keyed by the POS name.
 *
 * The real source of product pictures is Loyverse: `npm run sync:loyverse`
 * downloads whatever the shop has uploaded there into
 * public/products/loyverse/, and 261 products are already covered that way.
 * That is the better path, because a photograph in the POS is the actual
 * product and it also shows up on the till.
 *
 * This map is the fallback for items the POS has no picture for. It is only
 * ever consulted when `row.image` is empty, so the moment a real photograph
 * is uploaded to Loyverse it wins and the entry here becomes dead weight —
 * which is the right way round.
 *
 * Keyed on the POS name, not the display name, for the same reason every
 * other lookup in this file is: a rename in the back office must not
 * silently detach a product from its picture.
 */
export const PRODUCT_IMAGES: Record<string, string> = {
  // --- Sausages -------------------------------------------------------
  "Beef Hotdog": "/products/items/beef-hotdog.jpg",
  "Bratwurst (Classic)": "/products/items/bratwurst-classic.jpg",
  Cervelat: "/products/items/cervelat.jpg",
  "Cheese Hotdog": "/products/items/cheese-hotdog.jpg",
  "Chicken Chipolata": "/products/items/chicken-chipolata.jpg",
  "English Bangers": "/products/items/english-bangers.jpg",
  Frankfurter: "/products/items/frankfurter.jpg",
  "Hungarian Cheesy Sausage": "/products/items/hungarian-cheesy.jpg",
  "Hungarian Spicy Sausage": "/products/items/hungarian-spicy.jpg",
  "Italian Garlic": "/products/items/italian-garlic.jpg",
  "Italian Sausage": "/products/items/italian-sausage.jpg",
  Kielbasa: "/products/items/kielbasa.jpg",
  "Mergese Sausage": "/products/items/merguez.jpg",
  "Nuernberger Sausage": "/products/items/nuernberger.jpg",
  "Special Hotdog": "/products/items/special-hotdog.jpg",
  "Spicy Italian with Fennel": "/products/items/spicy-italian-fennel.jpg",
  "Thüringerian Bratwurst": "/products/items/thueringer.jpg",
  "Veal Beef Bratwurst": "/products/items/veal-bratwurst.jpg",
  "White Sausage": "/products/items/weisswurst.jpg",
  Wienerli: "/products/items/wienerli.jpg",
};

const productImages = new Map(
  Object.entries(PRODUCT_IMAGES).map(([name, path]) => [
    name.trim().toLowerCase(),
    path,
  ]),
);

/** Paths in data/image-prompts.ts whose picture has actually been made. */
const madePictures = new Set(
  Object.values(IMAGE_PROMPTS)
    .filter((p) => p.have)
    .map((p) => p.path),
);

/**
 * Our own photograph for a product the POS has none for — but only once the
 * picture exists.
 *
 * The map above is written before the images are, the same way the hero
 * slides name their banners in advance. Without this gate, naming a file that
 * has not been made yet puts a broken image on a product tile, which is worse
 * than the placeholder it was meant to replace. `have` in
 * data/image-prompts.ts is flipped by the generator when it writes the file,
 * so a picture appears on the next build and nothing here has to change.
 */
export function getProductImage(productName: string): string | undefined {
  const path = productImages.get(productName.trim().toLowerCase());
  return path && madePictures.has(path) ? path : undefined;
}

/*
 * The three bacon cures. Each is sold in four pack sizes, and the cure is what
 * changes the flavour — 500g and 5kg of the honey cure taste the same — so one
 * line covers all four sizes of a cure.
 *
 * Nothing here says the shop cured it. The bacon comes from a homemade
 * producer; "Homemade Bacon (Sausage Guy)" is the label on the pack.
 */
const BACON_CURES: Record<string, string> = {
  "Wood Smoked":
    "Pork belly bacon, cured and then smoked over wood. Properly smoky and salty — the deepest flavoured of the three cures.",
  Natural:
    "Pork belly bacon, cured but not smoked. Clean, salty and pork-forward, so the meat itself leads.",
  Honey:
    "Pork belly bacon cured with honey. Salty with a clear sweet edge running through the fat.",
};

const BACON_SIZES = ["500g", "1kg", "3kg+", "5kg+"];

/**
 * Descriptions written here rather than in Loyverse, keyed by the POS name.
 *
 * Loyverse holds its description on the ITEM, and 43 items carry more than
 * one variant — so 146 of the products on the site would share a text with
 * their siblings. For 25 of those that is correct: a 250g and a 1kg pack of
 * the same ground beef want the same sentence, and writing it twice only
 * creates two things to keep in step.
 *
 * The other 121 differ by flavour. Most of them do not need their own line
 * either, because the flavour is already in the name — "Cake in a Tub — Ube
 * Mousse" is not clarified by a paragraph. This map is for the few that do:
 * the three bacon cures taste quite different from each other, the burger
 * patties are seasoned differently, and a customer choosing between them is
 * choosing on exactly the thing a shared text cannot say.
 *
 * Keys are the full product name as the site builds it: the Loyverse item
 * name, an em dash, then the variant. The dash is U+2014, not a hyphen.
 *
 * This WINS over the Loyverse text. Everything else about product data is the
 * other way round — the POS is the source of truth and we defer to it — but a
 * sentence someone wrote here is a deliberate override of a shared one, and
 * being quietly replaced by the item-level text would defeat the point.
 */
export const PRODUCT_DESCRIPTIONS: Record<string, string> = {
  ...Object.fromEntries(
    Object.entries(BACON_CURES).flatMap(([cure, text]) =>
      BACON_SIZES.map((size) => [
        `Homemade Bacon (Sausage Guy) — ${cure} ${size}`,
        text,
      ]),
    ),
  ),

  /*
   * The patties are made in the shop, so these describe the direction of the
   * seasoning rather than claiming a recipe. If the kitchen wants to name the
   * actual spices, they belong here.
   */
  /*
   * From the shop's own recipe sheet. All three share one base — salt, garlic,
   * onion, white and black pepper, oregano — and the quantities stay out of
   * the text: it is the shop's recipe, and a customer wants the taste.
   */
  /*
   * Each stands on its own. They open one at a time in the dialog, so a line
   * that says "the same mix as the US one" leaves whoever tapped Rosemary
   * reading about a burger that is not in front of them.
   */
  "Beef Burger Patties 2-pack — US":
    "Brazilian grass-fed chuck eye with garlic, onion, pepper and a little oregano. Savoury and well rounded — room for whatever goes on top.",
  "Beef Burger Patties 2-pack — Mexican":
    "Brazilian grass-fed chuck eye with garlic, onion, paprika, curry powder and a pinch of cayenne. Warm and a touch smoky-sweet — spiced, not hot.",
  "Beef Burger Patties 2-pack — Rosemary":
    "Brazilian grass-fed chuck eye with garlic, onion, pepper and dried rosemary. Just enough rosemary to catch: a clean pine note, not a herb burger.",
};

const productDescriptions = new Map(
  Object.entries(PRODUCT_DESCRIPTIONS).map(([name, text]) => [
    name.trim().toLowerCase(),
    text,
  ]),
);

/** Our own line about a product, when the shared one will not do. */
export function getProductDescription(productName: string): string | undefined {
  return productDescriptions.get(productName.trim().toLowerCase());
}
