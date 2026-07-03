import { DEFAULT_VARIANT, isVariant, type Variant } from "@/lib/types";

/**
 * Resolve the active design variant from a Next.js searchParams value.
 * Accepts ?variant=fable|noir|golden|locker|ocean|fuego; anything else
 * falls back to the default (fable).
 */
export function resolveVariant(
  raw: string | string[] | undefined,
): Variant {
  const value = Array.isArray(raw) ? raw[0] : raw;
  return isVariant(value) ? value : DEFAULT_VARIANT;
}

export { DEFAULT_VARIANT };
export type { Variant };
