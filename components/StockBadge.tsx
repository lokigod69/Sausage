import type { Product, StockStatus } from "@/lib/types";

/**
 * "In stock · 4.2 kg" — the badge plus the real number behind it.
 *
 * Lives in its own file because both the product list and the enlarged view
 * show it, and a stock reading that said one thing in the list and another in
 * the dialog would be worse than no reading at all.
 *
 * Colour never carries the meaning on its own: every state has its word.
 */
const STOCK_LABEL: Record<StockStatus, string> = {
  in: "In stock",
  low: "Low stock",
  out: "Sold out",
  untracked: "",
};

const STOCK_COLOR: Record<StockStatus, string> = {
  in: "var(--stock-in)",
  low: "var(--stock-low)",
  out: "var(--stock-out)",
  untracked: "var(--faint)",
};

/**
 * Round the POS quantity for display. Weight items come back as e.g.
 * 4.2315 kg — a shelf does not need four decimals, and neither does a
 * visitor deciding whether to drive over.
 */
export function formatQuantity(
  quantity: number,
  unit: string | undefined,
): string {
  const rounded =
    unit === "kg" ? Math.round(quantity * 10) / 10 : Math.round(quantity);
  // "kg" reads the same either way; the counted units need their singular.
  let label = unit;
  if (unit === "pack" && rounded !== 1) label = "packs";
  else if (unit === "pcs" && rounded === 1) label = "pc";
  return `${rounded} ${label ?? ""}`.trim();
}

export function StockBadge({ product }: { product: Product }) {
  const stock = product.stock;
  if (!stock || stock.status === "untracked") return null;

  const label = STOCK_LABEL[stock.status];
  const quantity =
    stock.status !== "out" && stock.quantity !== undefined
      ? formatQuantity(stock.quantity, stock.quantityUnit)
      : undefined;

  return (
    <span
      className="mono inline-flex items-center gap-1.5 text-[0.65rem] uppercase tracking-wider"
      style={{ color: STOCK_COLOR[stock.status] }}
    >
      <span
        aria-hidden
        className="inline-block h-1.5 w-1.5 flex-shrink-0 rounded-full"
        style={{ background: "currentColor" }}
      />
      {label}
      {quantity && <span style={{ color: "var(--faint)" }}>· {quantity}</span>}
    </span>
  );
}
