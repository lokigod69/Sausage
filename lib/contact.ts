import type { Branch } from "@/lib/types";

/** Strip everything but digits for tel:/wa.me links. */
export function digitsOnly(input: string): string {
  return input.replace(/[^\d]/g, "");
}

/** tel: link from a display phone number. */
export function telHref(phone: string): string {
  return `tel:+${digitsOnly(phone)}`;
}

/** wa.me link with an optional prefilled message. */
export function whatsappHref(whatsapp: string, message?: string): string {
  const base = `https://wa.me/${digitsOnly(whatsapp)}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

/** Google Maps directions link from a free-text query (no API key, no coords). */
export function mapsHref(mapQuery: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    mapQuery,
  )}`;
}

/** Convenience bundle of the common CTAs for a branch. */
export function branchLinks(branch: Branch, whatsappMessage?: string) {
  return {
    whatsapp: whatsappHref(branch.whatsapp, whatsappMessage),
    phone: telHref(branch.phone),
    maps: mapsHref(branch.mapQuery),
    facebook: branch.facebookUrl,
  };
}

/** Default availability-confirmation message used across CTAs. */
export const DEFAULT_WA_MESSAGE =
  "Hi! I'd like to confirm today's stock at The Sausage Guy Panglao.";
