import type { Branch, Product, RawProductRow } from "@/lib/types";
import { normalizeProduct } from "@/lib/products";
import { RAW_PRODUCTS } from "@/data/products";
import snapshot from "@/data/loyverse-catalog.json";
import {
  fetchCategories,
  fetchInventory,
  fetchItems,
  fetchStores,
  getConfiguredStoreId,
  hasLoyverseCredentials,
  resolveStore,
} from "@/lib/loyverse";
import { mapCategory } from "@/data/loyverse-category-map";
import {
  getFallbackCategory,
  getMisfiledCategory,
} from "@/data/pos-overrides";

/**
 * The catalog the page actually renders: a committed POS snapshot, with live
 * stock and prices laid over it.
 *
 * Why both:
 *  - The snapshot (written by `scripts/sync-loyverse.ts`) is the floor. It
 *    keeps the site rendering a full product list when Loyverse is down, the
 *    token has expired, or the site is built without POS access at all.
 *  - The overlay keeps the volatile fields honest. Stock moves hourly in a
 *    butcher shop, and a stale "In stock" is worse than none — it sends
 *    someone across the island for something already sold.
 *
 * Failure is never fatal here: any API problem logs and falls back to the
 * snapshot, so a POS outage degrades to "yesterday's list" rather than a
 * broken page.
 */

/** How long a live POS read is reused before refetching (seconds). */
const LIVE_REVALIDATE_SECONDS = 600;

interface SnapshotProduct {
  posVariantId: string;
  category: string;
  productName: string;
  unit?: string;
  price?: number;
  variablePrice?: boolean;
  inStock?: number;
  trackStock?: boolean;
  soldByWeight?: boolean;
  lowStock?: number;
  stockUpdatedAt?: string;
  image?: string;
}

interface SnapshotBranch {
  storeId: string;
  storeName: string;
  currency: string;
  syncedAt: string;
  products: SnapshotProduct[];
}

interface CatalogSnapshot {
  version: number;
  generatedAt: string | null;
  branches: Record<string, SnapshotBranch>;
}

export interface BranchCatalog {
  products: Product[];
  /** Where the rendered list came from. */
  source: "live" | "snapshot" | "curated";
  /** When the underlying POS reading was taken, if known. */
  syncedAt?: string;
  /** Set when a live refresh was attempted and failed. */
  liveError?: string;
}

const CATALOG = snapshot as CatalogSnapshot;

function snapshotToRow(p: SnapshotProduct, currency: string): RawProductRow {
  return {
    category: p.category,
    productName: p.productName,
    unit: p.unit ?? null,
    image: p.image ?? null,
    price: p.price ?? null,
    variablePrice: p.variablePrice ?? null,
    currency,
    posVariantId: p.posVariantId,
    inStock: p.inStock ?? null,
    trackStock: p.trackStock ?? null,
    soldByWeight: p.soldByWeight ?? null,
    lowStock: p.lowStock ?? null,
    stockUpdatedAt: p.stockUpdatedAt ?? null,
  };
}

/**
 * Overlay live POS readings onto the snapshot rows, matched by variant id.
 * Items the POS has added since the last sync are appended, so a product put
 * into Loyverse this morning still shows up before anyone redeploys.
 */
async function applyLiveOverlay(
  rows: RawProductRow[],
  branch: Branch,
  currency: string,
): Promise<{ rows: RawProductRow[]; syncedAt: string }> {
  const stores = await fetchStores({ revalidate: LIVE_REVALIDATE_SECONDS });
  const store = resolveStore(stores, getConfiguredStoreId(), branch.name);
  const storeId = store?.id;

  const [items, inventory, categories] = await Promise.all([
    fetchItems(storeId, { revalidate: LIVE_REVALIDATE_SECONDS }),
    fetchInventory(storeId, { revalidate: LIVE_REVALIDATE_SECONDS }),
    fetchCategories({ revalidate: LIVE_REVALIDATE_SECONDS }),
  ]);

  // variantId -> the live facts we are willing to publish.
  const live = new Map<
    string,
    Pick<
      RawProductRow,
      | "price"
      | "variablePrice"
      | "inStock"
      | "trackStock"
      | "soldByWeight"
      | "lowStock"
      | "stockUpdatedAt"
    > & { productName: string; category: string }
  >();

  for (const item of items) {
    for (const variant of item.variants) {
      if (!variant.availableForSale) continue;
      const level = inventory.get(variant.variantId);
      const posCategory = item.categoryId
        ? categories.get(item.categoryId)
        : undefined;

      live.set(variant.variantId, {
        // Same display name the sync would write, so an item added to the POS
        // today reads "Cake in a Tub — Mango Float", not nine rows all called
        // "Cake in a Tub".
        productName: variant.optionValue
          ? `${item.name} — ${variant.optionValue}`
          : item.name,
        // And the same category, so it does not sit in "Other" until someone
        // re-runs the sync.
        category:
          getMisfiledCategory(item.name) ??
          (posCategory
            ? mapCategory(posCategory)
            : (getFallbackCategory(item.name) ?? "Other")),
        price: variant.price ?? null,
        variablePrice: variant.variablePrice,
        inStock: level?.inStock ?? null,
        trackStock: item.trackStock,
        soldByWeight: item.soldByWeight,
        lowStock: variant.lowStock ?? null,
        stockUpdatedAt: level?.updatedAt ?? null,
      });
    }
  }

  const seen = new Set<string>();
  const merged: RawProductRow[] = [];

  for (const row of rows) {
    const id = row.posVariantId;
    const fresh = id ? live.get(id) : undefined;
    if (id) seen.add(id);

    if (!fresh) {
      // Either a curated row with no POS link, or an item the POS no longer
      // sells at this store. Keep the name, drop the stale stock claim.
      merged.push(id ? { ...row, inStock: null, stockUpdatedAt: null } : row);
      continue;
    }

    merged.push({
      ...row,
      price: fresh.price,
      variablePrice: fresh.variablePrice,
      inStock: fresh.inStock,
      trackStock: fresh.trackStock,
      soldByWeight: fresh.soldByWeight,
      lowStock: fresh.lowStock,
      stockUpdatedAt: fresh.stockUpdatedAt,
      currency,
    });
  }

  // Anything new in the POS that the snapshot has not caught up with.
  for (const [variantId, fresh] of live) {
    if (seen.has(variantId)) continue;
    merged.push({
      category: fresh.category,
      productName: fresh.productName,
      posVariantId: variantId,
      currency,
      price: fresh.price,
      variablePrice: fresh.variablePrice,
      inStock: fresh.inStock,
      trackStock: fresh.trackStock,
      soldByWeight: fresh.soldByWeight,
      lowStock: fresh.lowStock,
      stockUpdatedAt: fresh.stockUpdatedAt,
    });
  }

  return { rows: merged, syncedAt: new Date().toISOString() };
}

function normalizeAll(rows: RawProductRow[], branchSlug: string): Product[] {
  const out: Product[] = [];
  rows.forEach((row, i) => {
    const p = normalizeProduct(row, branchSlug, i);
    if (p) out.push(p);
  });
  return out;
}

/**
 * Build the catalog for a branch. Never throws — a POS failure degrades to
 * the committed snapshot, and a missing snapshot degrades to the curated list.
 */
export async function getBranchCatalog(branch: Branch): Promise<BranchCatalog> {
  const snap = CATALOG.branches[branch.slug];
  const currency = snap?.currency ?? "PHP";

  const baseRows: RawProductRow[] = snap
    ? snap.products.map((p) => snapshotToRow(p, currency))
    : (RAW_PRODUCTS[branch.slug] ?? []);

  const baseSource: BranchCatalog["source"] = snap ? "snapshot" : "curated";

  if (!hasLoyverseCredentials()) {
    return {
      products: normalizeAll(baseRows, branch.slug),
      source: baseSource,
      syncedAt: snap?.syncedAt,
    };
  }

  try {
    const { rows, syncedAt } = await applyLiveOverlay(baseRows, branch, currency);
    return {
      products: normalizeAll(rows, branch.slug),
      source: "live",
      syncedAt,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`[catalog] live Loyverse read failed, using snapshot: ${message}`);
    return {
      products: normalizeAll(baseRows, branch.slug),
      source: baseSource,
      syncedAt: snap?.syncedAt,
      liveError: message,
    };
  }
}
