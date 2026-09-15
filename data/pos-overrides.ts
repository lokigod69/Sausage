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
  "Honey ham": PER_KG(1000),
  "Forest Ham (Not 200g)": PER_KG(1000),
  "Farmers Ham": PER_KG(1000),

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
  // the brand is not shown — see DISPLAY_NAMES below.
  "Premium Red Cheddar (Sausage Guy)": PER_KG(1120),
  "Mozzarella Cheese Block (Sausage Guy)": PER_KG(745),
  "Frozen Chicken Breast in Halves 2kg (Avivar)": {
    price: 760,
    unit: "2kg pack",
  },
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

  // Chicken
  "Frozen Chicken Breast in Halves 2kg (Avivar)":
    "Frozen Chicken Breast in Halves 2kg",
};

const displayNames = new Map(
  Object.entries(DISPLAY_NAMES).map(([pos, shown]) => [pos.toLowerCase(), shown]),
);

/** The name to show a visitor, which is the POS name unless overridden. */
export function getDisplayName(productName: string): string {
  return displayNames.get(productName.trim().toLowerCase()) ?? productName;
}

/**
 * POS entries that are till mechanics, not things a customer buys. They were
 * appearing in the public product list.
 */
export const EXCLUDED_PRODUCTS: string[] = [
  "Delivery Fee",
  "No Item (Put Price Individually)",
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
