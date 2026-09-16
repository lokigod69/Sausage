/**
 * Bring the Loyverse categories in line with the site's taxonomy.
 *
 *   npm run migrate:categories            # dry run, changes nothing
 *   npm run migrate:categories -- --apply # writes to the live POS
 *
 * Two phases:
 *   1. Rename existing categories where the POS name is just an older name
 *      for the same shelf. One write moves every item in it — far safer than
 *      re-assigning sixty items one at a time.
 *   2. Re-assign the items whose category still differs from the target,
 *      including the ones the POS never categorised at all.
 *
 * Each item is written back COMPLETE, exactly as the API returned it with
 * only `category_id` changed. A round-trip test on a single item confirmed
 * Loyverse preserves variants, prices and options this way. That also means
 * cost fields pass through untouched — they must, or a write would erase
 * them. Nothing here reads or stores them.
 */

import { mapCategory } from "../data/loyverse-category-map.ts";
import {
  getFallbackCategory,
  getMisfiledCategory,
  isExcludedProduct,
} from "../data/pos-overrides.ts";

const API = "https://api.loyverse.com/v1.0";
const APPLY = process.argv.includes("--apply");

const token = process.env.LOYVERSE_ACCESS_TOKEN?.trim();
if (!token) {
  console.error("\n  ✗ LOYVERSE_ACCESS_TOKEN is not set (see .env.local)\n");
  process.exit(1);
}

const headers = {
  Authorization: `Bearer ${token}`,
  "Content-Type": "application/json",
};

/**
 * POS category name -> the name it should carry. Only renames: every item
 * inside comes along for free.
 */
const RENAMES: Record<string, string> = {
  Spices: "Herbs & Spices",
  Meat: "Meat & Steaks",
  Cheese: "Cheese & Dairy",
  Delicatessen: "Pantry & Preserves",
  Snacks: "Snacks & Sweets",
  Fish: "Seafood",
  "Ready-Cook Expat Meals": "Ready Meals",
  Breakfast: "Breakfast & Cereals",
  "Frozen Fruit & Vegs": "Frozen Fruit & Veg",
  // Its two items are wraps, and the bakery is where they belong.
  Wrapper: "Bakery & Desserts",
  // The POS carries Beverages (35) and Drinks (4). Renaming the big one and
  // moving the four leaves an empty "Drinks" behind to delete by hand.
  Beverages: "Drinks",
};

/** The fourteen. Anything else is a leftover to clean up in the back office. */
const TARGETS = [
  "Sausages",
  "Meat & Steaks",
  "Poultry",
  "Seafood",
  "Hams & Cold Cuts",
  "Cheese & Dairy",
  "Bakery & Desserts",
  "Ready Meals",
  "Breakfast & Cereals",
  "Frozen Fruit & Veg",
  "Pantry & Preserves",
  "Herbs & Spices",
  "Snacks & Sweets",
  "Drinks",
];

async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API}${path}`, { headers, ...init });
  if (!res.ok) {
    throw new Error(`${init?.method ?? "GET"} ${path} -> ${res.status}: ${await res.text()}`);
  }
  return res.json() as Promise<T>;
}

async function paginate<T>(path: string, key: string): Promise<T[]> {
  const out: T[] = [];
  let cursor: string | undefined;
  do {
    const sep = path.includes("?") ? "&" : "?";
    const page = await api<Record<string, unknown>>(
      `${path}${sep}limit=250${cursor ? `&cursor=${cursor}` : ""}`,
    );
    out.push(...((page[key] as T[]) ?? []));
    cursor = typeof page.cursor === "string" && page.cursor ? page.cursor : undefined;
  } while (cursor);
  return out;
}

interface Category {
  id: string;
  name: string;
  deleted_at?: string | null;
}
interface Item {
  id: string;
  item_name: string;
  category_id?: string | null;
  deleted_at?: string | null;
  [k: string]: unknown;
}

async function main() {
  console.log(`\n  Loyverse category migration — ${APPLY ? "APPLYING" : "dry run"}\n`);

  let categories = (await paginate<Category>("/categories", "categories")).filter(
    (c) => !c.deleted_at,
  );
  const items = (await paginate<Item>("/items", "items")).filter((i) => !i.deleted_at);

  /*
   * "Beverages" (35) and "Drinks" (4) are the same shelf. Renaming the big
   * one to "Drinks" would leave two categories with identical names, and the
   * four items would quietly stay in the wrong one — indistinguishable by
   * name afterwards. Note the old one's id now, while it is still tellable
   * apart, and force its items across.
   */
  const legacyDrinks = categories.find(
    (c) => c.name === "Drinks" && categories.some((o) => o.name === "Beverages"),
  );
  const beveragesId = categories.find((c) => c.name === "Beverages")?.id;

  /*
   * Phase 0 — clear the way for that rename. Loyverse refuses two categories
   * with the same name, so "Beverages" cannot become "Drinks" while the old
   * "Drinks" still holds it. Empty the old one, then park it under a name
   * that says it is disposable. Deleting is left to the back office: an empty
   * category is trivial to remove by hand and impossible to un-delete here.
   */
  if (legacyDrinks && beveragesId) {
    const strays = items.filter((i) => i.category_id === legacyDrinks.id);
    console.log(
      `  Phase 0 — free the name "Drinks": move ${strays.length} items into Beverages, ` +
        `then park the empty category as "Drinks (old — safe to delete)"`,
    );
    if (APPLY) {
      for (const item of strays) {
        await api("/items", {
          method: "POST",
          body: JSON.stringify({ ...item, category_id: beveragesId }),
        });
      }
      await api("/categories", {
        method: "POST",
        body: JSON.stringify({
          id: legacyDrinks.id,
          name: "Drinks (old — safe to delete)",
        }),
      });
      for (const item of strays) item.category_id = beveragesId;
      categories = categories.map((c) =>
        c.id === legacyDrinks.id ? { ...c, name: "Drinks (old — safe to delete)" } : c,
      );
    }
  }

  // ---- Phase 1: renames -------------------------------------------------
  const renames = categories.filter((c) => RENAMES[c.name] && RENAMES[c.name] !== c.name);
  console.log(`  Phase 1 — rename ${renames.length} categories:`);
  for (const c of renames) {
    const n = items.filter((i) => i.category_id === c.id).length;
    console.log(`    ${c.name.padEnd(26)} -> ${RENAMES[c.name].padEnd(22)} (${n} items follow)`);
    if (APPLY) {
      await api("/categories", {
        method: "POST",
        body: JSON.stringify({ id: c.id, name: RENAMES[c.name] }),
      });
    }
  }

  if (APPLY && renames.length > 0) {
    categories = (await paginate<Category>("/categories", "categories")).filter(
      (c) => !c.deleted_at,
    );
  } else {
    // Reflect the renames locally so the dry run reports the real outcome.
    categories = categories.map((c) =>
      RENAMES[c.name] ? { ...c, name: RENAMES[c.name] } : c,
    );
  }

  // ---- Phase 2: create anything still missing ---------------------------
  const have = new Map(categories.map((c) => [c.name, c.id] as const));
  // Make sure "Drinks" resolves to the renamed Beverages, not the empty leftover.
  if (beveragesId) have.set("Drinks", beveragesId);
  const missing = TARGETS.filter((t) => !have.has(t));
  console.log(`\n  Phase 2 — create ${missing.length} categories: ${missing.join(", ") || "none"}`);
  for (const name of missing) {
    if (APPLY) {
      const created = await api<Category>("/categories", {
        method: "POST",
        body: JSON.stringify({ name }),
      });
      have.set(name, created.id);
    } else {
      have.set(name, `(new:${name})`);
    }
  }

  // ---- Phase 3: re-assign the items that still differ -------------------
  const byId = new Map(categories.map((c) => [c.id, c.name] as const));
  const moves: { item: Item; from: string; to: string }[] = [];

  for (const item of items) {
    if (isExcludedProduct(item.item_name)) continue; // till entries stay out
    const current = item.category_id ? byId.get(item.category_id) : undefined;
    const target =
      getMisfiledCategory(item.item_name) ??
      (current
        ? mapCategory(current)
        : (getFallbackCategory(item.item_name) ?? undefined));
    if (!target || target === current) continue;
    if (!TARGETS.includes(target)) {
      console.log(`    ! ${item.item_name} would go to "${target}", which is not one of the fourteen`);
      continue;
    }
    moves.push({ item, from: current ?? "(none)", to: target });
  }

  console.log(`\n  Phase 3 — move ${moves.length} items:`);
  const grouped: Record<string, number> = {};
  for (const m of moves) grouped[`${m.from} -> ${m.to}`] = (grouped[`${m.from} -> ${m.to}`] ?? 0) + 1;
  for (const [k, n] of Object.entries(grouped).sort()) console.log(`    ${k}  (${n})`);

  if (APPLY) {
    let done = 0;
    for (const m of moves) {
      const id = have.get(m.to);
      // Write the item back whole, with only the category changed.
      await api("/items", {
        method: "POST",
        body: JSON.stringify({ ...m.item, category_id: id }),
      });
      done++;
      if (done % 10 === 0) process.stdout.write(`    ${done}/${moves.length}\n`);
    }
    console.log(`    ${done}/${moves.length} written`);
  }

  console.log(
    APPLY
      ? "\n  ✓ Done. Re-run `npm run sync:loyverse` to refresh the site snapshot.\n"
      : "\n  Dry run only. Re-run with --apply to write these changes.\n",
  );
}

main().catch((e) => {
  console.error(`\n  ✗ ${e instanceof Error ? e.message : e}\n`);
  process.exit(1);
});
