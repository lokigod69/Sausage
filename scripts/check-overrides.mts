/**
 * Does every override in data/pos-overrides.ts still point at something real?
 *
 * Overrides are keyed on the exact Loyverse item name, so a rename in the POS
 * silently drops one: the price falls back, the photo disappears, the excluded
 * item comes back onto the site. Nothing errors. This names the orphans.
 *
 *   node scripts/check-overrides.mts
 */
import {
  WEIGHT_PRICES,
  DISPLAY_NAMES,
  EXCLUDED_PRODUCTS,
  PRODUCT_IMAGES,
  PRODUCT_DESCRIPTIONS,
} from "../data/pos-overrides.ts";

const H = { Authorization: `Bearer ${process.env.LOYVERSE_ACCESS_TOKEN}` };

let items: { item_name: string; variants?: { option1_value?: string }[] }[] = [];
let cursor: string | undefined;
do {
  const url = `https://api.loyverse.com/v1.0/items?limit=250${cursor ? `&cursor=${cursor}` : ""}`;
  const json = await (await fetch(url, { headers: H })).json();
  items = items.concat(json.items ?? []);
  cursor = json.cursor;
} while (cursor);

/* Item names, plus the "Item — Variant" form the site builds for a product. */
const known = new Set<string>();
for (const i of items) {
  known.add(i.item_name.trim().toLowerCase());
  for (const v of i.variants ?? []) {
    if (v.option1_value) {
      known.add(`${i.item_name} — ${v.option1_value}`.trim().toLowerCase());
    }
  }
}

const groups: [string, string[]][] = [
  ["WEIGHT_PRICES", Object.keys(WEIGHT_PRICES)],
  ["DISPLAY_NAMES", Object.keys(DISPLAY_NAMES)],
  ["EXCLUDED_PRODUCTS", EXCLUDED_PRODUCTS],
  ["PRODUCT_IMAGES", Object.keys(PRODUCT_IMAGES)],
  ["PRODUCT_DESCRIPTIONS", Object.keys(PRODUCT_DESCRIPTIONS)],
];

let orphans = 0;
for (const [label, keys] of groups) {
  const gone = keys.filter((k) => !known.has(k.trim().toLowerCase()));
  console.log(`${label}: ${keys.length} keys, ${gone.length} pointing at nothing`);
  for (const g of gone) console.log(`    ${g}`);
  orphans += gone.length;
}

console.log(`\n${items.length} items in Loyverse. ${orphans} orphaned override(s).`);
process.exit(orphans > 0 ? 1 : 0);
