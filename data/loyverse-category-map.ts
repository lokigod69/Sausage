/**
 * Loyverse category name -> the category label this site groups under.
 *
 * The POS is organised for the people behind the counter; the site is
 * organised for someone deciding whether to drive out. When those two
 * disagree, fix it here rather than renaming categories in the POS.
 *
 * Keys are matched case-insensitively, after trimming. Anything not listed
 * passes through unchanged — `scripts/sync-loyverse.ts` prints every category
 * it saw and flags the ones that do not line up with a featured card in
 * `data/branches.ts`, so gaps are visible on the next sync instead of
 * silently producing an empty "Other" bucket.
 */
export const LOYVERSE_CATEGORY_MAP: Record<string, string> = {
  // --- Sausages ---------------------------------------------------------
  sausage: "Sausages",
  sausages: "Sausages",
  bratwurst: "Sausages",
  wurst: "Sausages",

  // --- Beef -------------------------------------------------------------
  beef: "Beef",
  steak: "Beef",
  steaks: "Beef",
  "beef & steaks": "Beef",

  // --- Poultry ----------------------------------------------------------
  poultry: "Poultry",
  chicken: "Poultry",
  duck: "Poultry",

  // --- Pork / Lamb ------------------------------------------------------
  pork: "Pork",
  lamb: "Lamb",

  // --- Seafood ----------------------------------------------------------
  // The POS carries both "Fish" and "Seafoods" alongside "Seafood"; they are
  // one shelf to a customer, so they land in one category here.
  seafood: "Seafood",
  seafoods: "Seafood",
  fish: "Seafood",
  salmon: "Seafood",

  // --- Deli -------------------------------------------------------------
  ham: "Hams",
  hams: "Hams",
  bacon: "Bacon",
  charcuterie: "Charcuterie",
  deli: "Deli",

  // --- Dairy ------------------------------------------------------------
  cheese: "Cheese",
  dairy: "Dairy",
  "cheese & dairy": "Cheese",

  // --- Pantry -----------------------------------------------------------
  // "Wrapper" in the POS is tortillas and coconut wraps, not packaging.
  wrapper: "Wraps & Tortillas",
  bread: "Bread & Bakery",
  bakery: "Bread & Bakery",
  sauces: "Sauces & Condiments",
  condiments: "Sauces & Condiments",
  pantry: "Pantry",
  drinks: "Drinks",
  beverages: "Drinks",
};

/** Resolve a POS category name to the label the site should group under. */
export function mapCategory(posCategory: string | undefined): string {
  if (!posCategory) return "Other";
  const key = posCategory.trim().toLowerCase();
  return LOYVERSE_CATEGORY_MAP[key] ?? posCategory.trim();
}
