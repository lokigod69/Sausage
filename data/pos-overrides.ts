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
  "Beef Sukiyaki": { price: 920, unit: "1kg pack" },
  "Rosemary burger": { price: 280, unit: "2-pack" },

  // ---- Poultry --------------------------------------------------------
  "Brazilian Chicken Wings": PER_KG(340),
  "Duck Breast": PER_KG(900),
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
  "Mozzarella Cheese Block (Sausage Guy)": PER_KG(745),
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
  // Cut-to-order cheese counter
  "Premium Red Cheddar (Sausage Guy)": "Premium Red Cheddar",
  "Mozzarella Cheese Block (Sausage Guy)": "Mozzarella Cheese Block",
  "White Cheddar (Emborg)": "White Cheddar",
  "Emmenthaler (Emborg)": "Emmenthaler",
  "Gran Amici (Emborg)": "Gran Amici",
  "Grana Padano (Emborg)": "Grana Padano",

  // The one sealed pack that also drops its brand. The other branded packs
  // (Castello, Bayernland, Euro Chef) keep theirs — the brand is on the
  // packet the customer picks up, and is part of what they are buying.
  "Cheddar Burger Slices 130g (Emborg)": "Cheddar Burger Slices 130g",

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
  "Farmers Ham(not 200g pack)": "Hams & Cold Cuts",
  "Forest Ham (Not 200g)": "Hams & Cold Cuts",
  Cervelat: "Sausages",

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
  "Oregano flakes": "Herbs & Spices",
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
  "Farmers Ham(not 200g pack)",
  "Forest Ham (Not 200g)",
  "Honey ham(not 200g pack)",

  /*
   * An older, sizeless duplicate of "Oregano Flakes 50g (Chef's Cabinet)",
   * which is the product actually stocked (owner, 16 Sep 2026). Its POS stock
   * had drifted to -2, which is what a dead entry looks like. Hidden here;
   * deleting it in Loyverse is the tidier end of the same fix.
   */
  "Oregano flakes",
];

const excluded = new Set(EXCLUDED_PRODUCTS.map((n) => n.toLowerCase()));

export function isExcludedProduct(productName: string): boolean {
  return excluded.has(productName.trim().toLowerCase());
}

const weightPrices = new Map(
  Object.entries(WEIGHT_PRICES).map(([name, v]) => [name.toLowerCase(), v]),
);

export function getWeightPrice(productName: string): WeightPrice | undefined {
  return weightPrices.get(productName.trim().toLowerCase());
}
