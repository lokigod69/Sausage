/**
 * Pull the Panglao catalog out of Loyverse POS and write the committed
 * snapshot at data/loyverse-catalog.json.
 *
 * Run it with:
 *   npm run sync:loyverse
 *
 * What it writes: category, product name, unit, sell price, stock count.
 * What it will never write: cost or margin. Those are dropped upstream in
 * lib/loyverse.ts and are not read anywhere in this file.
 *
 * Node runs this file directly via type stripping, so every import here must
 * use a real relative path with its extension — no "@/" aliases at runtime.
 */

import {
  fetchCategories,
  fetchCurrency,
  fetchInventory,
  fetchItems,
  fetchStores,
  getConfiguredStoreId,
  hasLoyverseCredentials,
  resolveStore,
} from "../lib/loyverse.ts";
import { mapCategory } from "../data/loyverse-category-map.ts";
import {
  getFallbackCategory,
  getMisfiledCategory,
  getWeightPrice,
  isExcludedProduct,
} from "../data/pos-overrides.ts";
import { RAW_PRODUCTS } from "../data/products.ts";
import { BRANCHES } from "../data/branches.ts";
import { mkdir, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const BRANCH_SLUG = process.env.SYNC_BRANCH?.trim() || "panglao";
const OUT_FILE = path.join(process.cwd(), "data", "loyverse-catalog.json");

/**
 * Product photos are copied into /public rather than hot-linked from
 * Loyverse, so the site renders them without depending on the POS being
 * reachable — and without putting every visitor's image request through the
 * POS API. Downloads are incremental: an item's photo is fetched once and
 * skipped on later syncs unless it is missing.
 *
 * They are re-encoded to WebP on the way in. Loyverse serves 320x426 RGBA
 * PNGs at roughly 160 KB each, which is ~42 MB across the catalog — an order
 * of magnitude more than the rest of the repo. WebP at quality 82 is visually
 * indistinguishable at the 44px thumbnail these are shown at.
 */
const IMAGE_DIR = path.join(process.cwd(), "public", "products", "loyverse");
const IMAGE_PUBLIC_PATH = "/products/loyverse";

async function downloadImages(
  items: { itemId: string; imageUrl?: string }[],
): Promise<{ paths: Map<string, string>; fetched: number; failed: string[] }> {
  const withImages = items.filter((i) => i.imageUrl);
  const paths = new Map<string, string>();
  const failed: string[] = [];
  let fetched = 0;

  if (withImages.length === 0) return { paths, fetched, failed };

  await mkdir(IMAGE_DIR, { recursive: true });
  const existing = new Set(await readdir(IMAGE_DIR).catch(() => []));

  process.stdout.write(`  Images:    ${withImages.length} to check `);

  for (const item of withImages) {
    const file = `${item.itemId}.webp`;
    if (existing.has(file)) {
      paths.set(item.itemId, `${IMAGE_PUBLIC_PATH}/${file}`);
      continue;
    }
    try {
      const res = await fetch(item.imageUrl!);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const buf = Buffer.from(await res.arrayBuffer());
      const webp = await sharp(buf).webp({ quality: 82 }).toBuffer();
      await writeFile(path.join(IMAGE_DIR, file), webp);
      paths.set(item.itemId, `${IMAGE_PUBLIC_PATH}/${file}`);
      fetched++;
      if (fetched % 25 === 0) process.stdout.write(".");
    } catch {
      // A missing photo is cosmetic — the card falls back to its initial.
      failed.push(item.itemId);
    }
  }

  process.stdout.write("\n");
  return { paths, fetched, failed };
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

/**
 * The curated list carries hand-written unit hints ("250g–1kg packs") that the
 * POS has no field for. Keep them when the product still matches by name, so
 * syncing does not quietly flatten every item to a bare "per kg".
 */
function curatedUnits(branchSlug: string): Map<string, string> {
  const map = new Map<string, string>();
  for (const row of RAW_PRODUCTS[branchSlug] ?? []) {
    const name = row.productName ?? row.product ?? row.name;
    const unit = row.unit;
    if (name && unit) map.set(slugify(name), unit);
  }
  return map;
}

function fail(message: string): never {
  console.error(`\n  ✗ ${message}\n`);
  process.exit(1);
}

async function main() {
  if (!hasLoyverseCredentials()) {
    fail(
      "LOYVERSE_ACCESS_TOKEN is not set.\n" +
        "    1. Loyverse Back Office -> Settings -> Access tokens -> add a token\n" +
        "    2. Put it in .env.local as LOYVERSE_ACCESS_TOKEN=...\n" +
        "    3. Run npm run sync:loyverse again",
    );
  }

  const branch = BRANCHES.find((b) => b.slug === BRANCH_SLUG);
  if (!branch) fail(`No branch "${BRANCH_SLUG}" in data/branches.ts.`);

  console.log(`\n  Syncing ${branch.name} from Loyverse…\n`);

  const stores = await fetchStores();
  const configuredId = getConfiguredStoreId();
  const store = resolveStore(stores, configuredId, branch.name);

  if (!store) {
    fail(
      `Could not decide which Loyverse store backs "${branch.name}".\n` +
        `    Stores on this account:\n` +
        stores.map((s) => `      ${s.id}  ${s.name}`).join("\n") +
        `\n    Set LOYVERSE_STORE_ID in .env.local to the right one.`,
    );
  }

  console.log(`  Store:     ${store.name} (${store.id})`);

  const [categories, items, inventory, currency] = await Promise.all([
    fetchCategories(),
    fetchItems(store.id),
    fetchInventory(store.id),
    fetchCurrency(),
  ]);

  console.log(`  Currency:  ${currency ?? "PHP (default)"}`);
  console.log(`  Items:     ${items.length}`);
  console.log(`  Inventory: ${inventory.size} tracked variants\n`);

  if (items.length === 0) {
    fail(
      "Loyverse returned no items for this store. Check that the token has " +
        "access and that items are assigned to this store.",
    );
  }

  const images = await downloadImages(items);
  const units = curatedUnits(branch.slug);
  const seenCategories = new Set<string>();
  const products = [];

  for (const item of items) {
    const posCategory = item.categoryId
      ? categories.get(item.categoryId)
      : undefined;
    // A known filing mistake wins outright; otherwise the POS decides, and
    // an uncategorised item gets our opinion rather than dropping into the
    // unfindable "Other" bucket.
    const category =
      getMisfiledCategory(item.name) ??
      (posCategory
        ? mapCategory(posCategory)
        : (getFallbackCategory(item.name) ?? mapCategory(undefined)));
    seenCategories.add(`${posCategory ?? "(uncategorised)"} -> ${category}`);

    for (const variant of item.variants) {
      if (!variant.availableForSale) continue;

      const name = variant.optionValue
        ? `${item.name} — ${variant.optionValue}`
        : item.name;
      const level = inventory.get(variant.variantId);

      products.push({
        posVariantId: variant.variantId,
        category,
        productName: name,
        // No option-value fallback here: when a variant has one it is already
        // part of `name` above ("… — 250g"), and repeating it as the unit
        // would print the same thing twice on one card.
        unit:
          units.get(slugify(name)) ??
          units.get(slugify(item.name)) ??
          (item.soldByWeight ? "per kg" : undefined),
        // Every variant of an item shares the item's photo.
        image: images.paths.get(item.itemId),
        price: variant.price,
        variablePrice: variant.variablePrice || undefined,
        inStock: level?.inStock,
        trackStock: item.trackStock,
        soldByWeight: item.soldByWeight,
        lowStock: variant.lowStock,
        stockUpdatedAt: level?.updatedAt,
      });
    }
  }

  products.sort(
    (a, b) =>
      a.category.localeCompare(b.category) ||
      a.productName.localeCompare(b.productName),
  );

  const now = new Date().toISOString();
  const snapshot = {
    version: 1,
    generatedAt: now,
    branches: {
      [branch.slug]: {
        storeId: store.id,
        storeName: store.name,
        currency: currency ?? "PHP",
        syncedAt: now,
        products,
      },
    },
  };

  await writeFile(OUT_FILE, `${JSON.stringify(snapshot, null, 2)}\n`, "utf8");

  // --- Report -----------------------------------------------------------
  console.log("  Categories seen (POS -> site):");
  for (const line of [...seenCategories].sort()) console.log(`    ${line}`);

  const cardLabels = new Set(
    branch.featuredCategories.flatMap((c) => c.match ?? [c.label]),
  );
  const unmatched = [...new Set(products.map((p) => p.category))]
    .filter((c) => !cardLabels.has(c))
    .sort();

  if (unmatched.length > 0) {
    console.log(
      `\n  ! These categories match no featured card in data/branches.ts:\n` +
        unmatched.map((c) => `      ${c}`).join("\n") +
        `\n    They still appear in the full list. Add an alias in\n` +
        `    data/loyverse-category-map.ts or a card in data/branches.ts.`,
    );
  }

  const priced = products.filter((p) => p.price !== undefined).length;
  const tracked = products.filter((p) => p.trackStock).length;
  const outOfStock = products.filter(
    (p) => p.trackStock && p.inStock === 0,
  ).length;
  // Negative counts mean the POS rang up more than it recorded receiving.
  // The site shows no badge for these rather than a false "sold out", but
  // they are worth fixing in Loyverse.
  const negative = products.filter((p) => (p.inStock ?? 0) < 0);

  // Variable-priced items rely on data/pos-overrides.ts for a number.
  const unpriced = products.filter(
    (p) =>
      p.variablePrice &&
      !getWeightPrice(p.productName) &&
      !isExcludedProduct(p.productName),
  );
  const fromPricelist = products.filter(
    (p) => p.variablePrice && getWeightPrice(p.productName),
  ).length;

  console.log(
    `\n  ✓ Wrote ${products.length} products to data/loyverse-catalog.json\n` +
      `    ${priced} priced by the POS · ${fromPricelist} priced from the pricelist\n` +
      `    ${tracked} stock-tracked · ${outOfStock} out of stock\n`,
  );

  const withPhoto = products.filter((p) => p.image).length;
  console.log(
    `  · ${withPhoto} of ${products.length} products have a photo` +
      (images.fetched > 0 ? ` (${images.fetched} newly downloaded)` : " (all cached)") +
      (images.failed.length > 0
        ? `; ${images.failed.length} failed to download`
        : "") +
      `\n`,
  );

  const hidden = products.filter((p) => isExcludedProduct(p.productName));
  if (hidden.length > 0) {
    console.log(
      `  · Hidden from the site (till entries, not products): ` +
        hidden.map((p) => p.productName).join(", ") +
        `\n`,
    );
  }

  if (unpriced.length > 0) {
    console.log(
      `  ! ${unpriced.length} weighed items have no price in the POS and no\n` +
        `    entry in data/pos-overrides.ts, so they show "By weight":\n` +
        unpriced.map((p) => `      ${p.productName}`).join("\n") +
        `\n`,
    );
  }

  if (negative.length > 0) {
    console.log(
      `  ! ${negative.length} items have a NEGATIVE stock count in Loyverse,\n` +
        `    which means more was sold than recorded as received:\n` +
        negative
          .slice(0, 8)
          .map((p) => `      ${String(p.inStock).padStart(5)}  ${p.productName}`)
          .join("\n") +
        (negative.length > 8 ? `\n      … and ${negative.length - 8} more` : "") +
        `\n    The site shows no stock badge for these rather than claiming\n` +
        `    they are sold out. Correcting the counts in Loyverse fixes it.\n`,
    );
  }
}

main().catch((error) => {
  fail(error instanceof Error ? error.message : String(error));
});
