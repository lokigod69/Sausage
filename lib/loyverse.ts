/**
 * Loyverse POS API client.
 *
 * Used from two places, which is why it depends on nothing but `fetch`:
 *   1. `scripts/sync-loyverse.ts` — run by Node to write the catalog snapshot.
 *   2. `lib/catalog.ts` — run by the Next server to overlay live stock/prices.
 *
 * ── PRIVACY BOUNDARY ──────────────────────────────────────────────────────
 * Loyverse variants carry `cost` and `purchase_cost`: what the owner PAYS.
 * Those are the fields `lib/types.ts` has always called INTERNAL. They are
 * dropped in `mapItem()` below and never leave this file — not to the
 * snapshot, not to a component, not to the client bundle. The only money
 * field that crosses this line is the sell price a customer pays at the
 * counter. That widening is deliberate; never extend it to cost or margin.
 */

const API_BASE = "https://api.loyverse.com/v1.0";

/** Loyverse allows 300 requests per 300 seconds. A full sync uses a handful. */
const MAX_RETRIES = 4;
const PAGE_SIZE = 250;

export interface LoyverseStore {
  id: string;
  name: string;
}

/** One sellable variant, already stripped of cost data. */
export interface PosVariant {
  variantId: string;
  itemId: string;
  sku?: string;
  /** Option label for multi-variant items, e.g. "500g". */
  optionValue?: string;
  /** Sell price at the requested store, or the item default. */
  price?: number;
  /**
   * True when the POS is set to VARIABLE pricing: the cashier weighs the item
   * and types the price at the counter, so no price exists to publish. Common
   * here for sausages, premium steaks and the cheese counter.
   */
  variablePrice: boolean;
  /** Per-store "running low" threshold, when the owner has set one. */
  lowStock?: number;
  /** False when the owner has switched the item off for this store. */
  availableForSale: boolean;
}

export interface PosItem {
  itemId: string;
  name: string;
  categoryId?: string;
  /** Loyverse-hosted product photo, when the item has one. */
  imageUrl?: string;
  /** True for items rung up by weight — these are the "per kg" products. */
  soldByWeight: boolean;
  /** False when Loyverse keeps no stock count for the item. */
  trackStock: boolean;
  variants: PosVariant[];
}

export interface PosInventoryLevel {
  variantId: string;
  storeId: string;
  inStock: number;
  updatedAt?: string;
}

export class LoyverseError extends Error {
  readonly status?: number;
  constructor(message: string, status?: number) {
    super(message);
    this.name = "LoyverseError";
    this.status = status;
  }
}

export function getAccessToken(): string | undefined {
  const token = process.env.LOYVERSE_ACCESS_TOKEN?.trim();
  return token ? token : undefined;
}

export function hasLoyverseCredentials(): boolean {
  return getAccessToken() !== undefined;
}

/** Store to read. Optional — a single-store account is auto-detected. */
export function getConfiguredStoreId(): string | undefined {
  const id = process.env.LOYVERSE_STORE_ID?.trim();
  return id ? id : undefined;
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export interface RequestOptions {
  /** Seconds Next.js should cache the response. Ignored outside Next. */
  revalidate?: number;
  signal?: AbortSignal;
}

async function loyverseRequest<T>(
  path: string,
  params: Record<string, string | number | undefined> = {},
  options: RequestOptions = {},
): Promise<T> {
  const token = getAccessToken();
  if (!token) {
    throw new LoyverseError(
      "LOYVERSE_ACCESS_TOKEN is not set. Add it to .env.local (Loyverse Back Office -> Settings -> Access tokens).",
    );
  }

  const url = new URL(`${API_BASE}${path}`);
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) url.searchParams.set(key, String(value));
  }

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
      signal: options.signal,
      // Honored by the Next server; a plain Node fetch ignores it.
      ...(options.revalidate !== undefined
        ? { next: { revalidate: options.revalidate } }
        : {}),
    } as RequestInit);

    // 429 = rate limited, 5xx = transient. Back off and retry.
    if (res.status === 429 || res.status >= 500) {
      if (attempt === MAX_RETRIES) {
        throw new LoyverseError(
          `Loyverse ${path} failed after ${MAX_RETRIES} retries (HTTP ${res.status}).`,
          res.status,
        );
      }
      const retryAfter = Number(res.headers.get("retry-after"));
      const waitMs =
        Number.isFinite(retryAfter) && retryAfter > 0
          ? retryAfter * 1000
          : 2 ** attempt * 1000;
      await sleep(waitMs);
      continue;
    }

    if (res.status === 401 || res.status === 403) {
      throw new LoyverseError(
        `Loyverse rejected the access token (HTTP ${res.status}). Generate a new one in Back Office -> Settings -> Access tokens.`,
        res.status,
      );
    }

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      throw new LoyverseError(
        `Loyverse ${path} returned HTTP ${res.status}. ${body.slice(0, 300)}`,
        res.status,
      );
    }

    return (await res.json()) as T;
  }

  throw new LoyverseError(`Loyverse ${path} exhausted retries.`);
}

/**
 * Walk a cursor-paginated collection to completion.
 * Every Loyverse list endpoint returns `{ <key>: [...], cursor?: string }`.
 */
async function paginate<T>(
  path: string,
  key: string,
  params: Record<string, string | number | undefined> = {},
  options: RequestOptions = {},
): Promise<T[]> {
  const out: T[] = [];
  let cursor: string | undefined;

  do {
    const page = await loyverseRequest<Record<string, unknown>>(
      path,
      { ...params, limit: PAGE_SIZE, cursor },
      options,
    );
    const rows = page[key];
    if (!Array.isArray(rows)) {
      throw new LoyverseError(
        `Loyverse ${path} did not return an array under "${key}". Got: ${
          Object.keys(page).join(", ") || "nothing"
        }.`,
      );
    }
    out.push(...(rows as T[]));
    cursor =
      typeof page.cursor === "string" && page.cursor ? page.cursor : undefined;
  } while (cursor);

  return out;
}

function num(value: unknown): number | undefined {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "") {
    const n = Number(value);
    if (Number.isFinite(n)) return n;
  }
  return undefined;
}

function str(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() !== ""
    ? value.trim()
    : undefined;
}

/**
 * Map one raw Loyverse item onto our public-safe shape.
 * `cost` / `purchase_cost` are never read — see PRIVACY BOUNDARY above.
 */
function mapItem(
  raw: Record<string, unknown>,
  storeId: string | undefined,
): PosItem | null {
  const itemId = str(raw.id);
  const name = str(raw.item_name) ?? str(raw.name);
  if (!itemId || !name) return null;

  const rawVariants = Array.isArray(raw.variants) ? raw.variants : [];
  const variants: PosVariant[] = [];

  for (const rv of rawVariants as Record<string, unknown>[]) {
    const variantId = str(rv.variant_id);
    if (!variantId) continue;
    if (rv.deleted_at) continue;

    const stores = Array.isArray(rv.stores)
      ? (rv.stores as Record<string, unknown>[])
      : [];
    // Prefer the row for our store; fall back to the item default price.
    const storeRow = storeId
      ? stores.find((s) => str(s.store_id) === storeId)
      : stores[0];

    // A variant with no row for this store is not sold at this store.
    if (storeId && stores.length > 0 && !storeRow) continue;

    const pricingType =
      str(storeRow?.pricing_type) ?? str(rv.default_pricing_type);

    variants.push({
      variantId,
      itemId,
      sku: str(rv.sku),
      optionValue: str(rv.option1_value),
      price: num(storeRow?.price) ?? num(rv.default_price),
      variablePrice: pricingType === "VARIABLE",
      lowStock: num(storeRow?.low_stock),
      availableForSale: storeRow?.available_for_sale !== false,
    });
  }

  if (variants.length === 0) return null;

  return {
    itemId,
    name,
    categoryId: str(raw.category_id),
    imageUrl: str(raw.image_url),
    soldByWeight: raw.sold_by_weight === true,
    trackStock: raw.track_stock === true,
    variants,
  };
}

export async function fetchStores(
  options?: RequestOptions,
): Promise<LoyverseStore[]> {
  const rows = await paginate<Record<string, unknown>>(
    "/stores",
    "stores",
    {},
    options,
  );
  return rows
    .filter((r) => !r.deleted_at)
    .map((r) => ({ id: str(r.id) ?? "", name: str(r.name) ?? "Unnamed store" }))
    .filter((s) => s.id !== "");
}

/** Category id -> display name. */
export async function fetchCategories(
  options?: RequestOptions,
): Promise<Map<string, string>> {
  const rows = await paginate<Record<string, unknown>>(
    "/categories",
    "categories",
    {},
    options,
  );
  const map = new Map<string, string>();
  for (const r of rows) {
    if (r.deleted_at) continue;
    const id = str(r.id);
    const name = str(r.name);
    if (id && name) map.set(id, name);
  }
  return map;
}

export async function fetchItems(
  storeId: string | undefined,
  options?: RequestOptions,
): Promise<PosItem[]> {
  const rows = await paginate<Record<string, unknown>>(
    "/items",
    "items",
    { show_deleted: "false" },
    options,
  );
  const out: PosItem[] = [];
  for (const raw of rows) {
    if (raw.deleted_at) continue;
    const item = mapItem(raw, storeId);
    if (item) out.push(item);
  }
  return out;
}

/** Variant id -> stock level at the requested store. */
export async function fetchInventory(
  storeId: string | undefined,
  options?: RequestOptions,
): Promise<Map<string, PosInventoryLevel>> {
  const rows = await paginate<Record<string, unknown>>(
    "/inventory",
    "inventory_levels",
    storeId ? { store_id: storeId } : {},
    options,
  );
  const map = new Map<string, PosInventoryLevel>();
  for (const r of rows) {
    const variantId = str(r.variant_id);
    const inStock = num(r.in_stock);
    if (!variantId || inStock === undefined) continue;
    map.set(variantId, {
      variantId,
      storeId: str(r.store_id) ?? storeId ?? "",
      inStock,
      updatedAt: str(r.updated_at),
    });
  }
  return map;
}

/** Account currency, e.g. "PHP". Used to format prices. */
export async function fetchCurrency(
  options?: RequestOptions,
): Promise<string | undefined> {
  try {
    const merchant = await loyverseRequest<Record<string, unknown>>(
      "/merchant",
      {},
      options,
    );
    // Loyverse returns an object: { code: "PHP", decimal_places: 2 }.
    const currency = merchant.currency;
    if (currency && typeof currency === "object") {
      return str((currency as Record<string, unknown>).code);
    }
    return str(currency);
  } catch {
    // Non-fatal: the caller falls back to the configured default.
    return undefined;
  }
}

/**
 * Resolve which Loyverse store backs a branch: the configured id, the only
 * store on the account, or a name match against the branch.
 */
export function resolveStore(
  stores: LoyverseStore[],
  configuredId: string | undefined,
  branchName: string,
): LoyverseStore | undefined {
  if (configuredId) {
    return stores.find((s) => s.id === configuredId);
  }
  if (stores.length === 1) return stores[0];

  const needle = branchName.toLowerCase();
  return stores.find(
    (s) =>
      needle.includes(s.name.toLowerCase()) ||
      s.name.toLowerCase().includes(needle),
  );
}
