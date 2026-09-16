/**
 * Loyverse category name -> the category this site groups under.
 *
 * ── THE TAXONOMY ──────────────────────────────────────────────────────────
 * Fourteen categories for ~444 products, in two blocks:
 *
 *   The counter — what the shop is known for, and what someone drives out for:
 *     Sausages · Meat & Steaks · Poultry · Seafood · Hams & Cold Cuts ·
 *     Cheese & Dairy
 *
 *   The shelves — the grocery half, which is two thirds of the catalogue:
 *     Bakery & Desserts · Ready Meals · Breakfast & Cereals ·
 *     Frozen Fruit & Veg · Pantry & Preserves · Herbs & Spices ·
 *     Snacks & Sweets · Drinks
 *
 * Fewer would start hiding things (70 spices and 58 drinks in one "Grocery"
 * bucket helps nobody); more would just be the POS's own drift — it had
 * Spices *and* Seasoning, Drinks *and* Beverages, Fish *and* Seafoods.
 *
 * These names are meant to be adopted in Loyverse too. Once they are, this
 * map mostly becomes a no-op, which is the point: the POS becomes the single
 * source of truth and this file only cleans up what is left.
 *
 * Keys are matched case-insensitively after trimming. Anything unlisted
 * passes through unchanged and `npm run sync:loyverse` prints it, so a new
 * POS category shows up here as a gap rather than silently.
 */
export const LOYVERSE_CATEGORY_MAP: Record<string, string> = {
  // ---- The counter -----------------------------------------------------
  sausage: "Sausages",
  sausages: "Sausages",
  bratwurst: "Sausages",
  wurst: "Sausages",

  // "Steaks" held only the premium cuts while "Meat" held the mince, bacon,
  // lamb and patties. One counter, one category.
  meat: "Meat & Steaks",
  steak: "Meat & Steaks",
  steaks: "Meat & Steaks",
  beef: "Meat & Steaks",
  pork: "Meat & Steaks",
  lamb: "Meat & Steaks",
  ostrich: "Meat & Steaks",

  poultry: "Poultry",
  chicken: "Poultry",
  duck: "Poultry",

  seafood: "Seafood",
  seafoods: "Seafood",
  fish: "Seafood",
  salmon: "Seafood",

  "hams & cold cuts": "Hams & Cold Cuts",
  ham: "Hams & Cold Cuts",
  hams: "Hams & Cold Cuts",
  bacon: "Hams & Cold Cuts",
  charcuterie: "Hams & Cold Cuts",
  deli: "Hams & Cold Cuts",

  cheese: "Cheese & Dairy",
  dairy: "Cheese & Dairy",
  "cheese & dairy": "Cheese & Dairy",

  // ---- The shelves -----------------------------------------------------
  bakery: "Bakery & Desserts",
  bread: "Bakery & Desserts",
  cakes: "Bakery & Desserts",
  "cakes & desserts": "Bakery & Desserts",
  desserts: "Bakery & Desserts",
  // Tortillas and coconut wraps belong with the bread, not in a category of
  // their own called "Wrapper".
  wrapper: "Bakery & Desserts",
  "wraps & tortillas": "Bakery & Desserts",

  "ready-cook expat meals": "Ready Meals",
  "ready-to-cook": "Ready Meals",
  "expat meals": "Ready Meals",

  breakfast: "Breakfast & Cereals",
  cereals: "Breakfast & Cereals",

  "frozen fruit & vegs": "Frozen Fruit & Veg",
  "frozen fruit & veg": "Frozen Fruit & Veg",
  vegetables: "Frozen Fruit & Veg",
  fruits: "Frozen Fruit & Veg",

  delicatessen: "Pantry & Preserves",
  condiments: "Pantry & Preserves",
  "sauces & condiments": "Pantry & Preserves",
  pantry: "Pantry & Preserves",
  "italian deli": "Pantry & Preserves",

  // The POS split rubs ("Seasoning") from single spices ("Spices"). Same rack.
  spices: "Herbs & Spices",
  seasoning: "Herbs & Spices",
  salt: "Herbs & Spices",
  herbs: "Herbs & Spices",

  snacks: "Snacks & Sweets",
  chips: "Snacks & Sweets",
  chocolates: "Snacks & Sweets",
  "nuts & snacks": "Snacks & Sweets",

  // The POS carries both, 58 items against 4.
  drinks: "Drinks",
  beverages: "Drinks",
  "beverages (alcohol)": "Drinks",
  "beverages (non-alc)": "Drinks",
  "coffee, tea, cacao": "Drinks",
};

/** Resolve a POS category name to the label the site should group under. */
export function mapCategory(posCategory: string | undefined): string {
  if (!posCategory) return "Other";
  const key = posCategory.trim().toLowerCase();
  return LOYVERSE_CATEGORY_MAP[key] ?? posCategory.trim();
}
