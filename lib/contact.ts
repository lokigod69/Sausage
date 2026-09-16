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

/**
 * Facebook Messenger deep link.
 *
 * Messenger is the primary channel here rather than WhatsApp: in the
 * Philippines Facebook is the default way people message a business, and a
 * good share of customers will have Messenger open and WhatsApp not
 * installed. m.me/<page> opens the app if it is present and the web chat if
 * it is not, so it works either way.
 */
export function messengerHref(facebookUrl: string): string {
  const handle = facebookUrl
    .replace(/^https?:\/\/(www\.|m\.|web\.)?facebook\.com\//i, "")
    .replace(/\/+$/, "")
    .split(/[/?#]/)[0];
  return handle ? `https://m.me/${handle}` : facebookUrl;
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
    /** Primary channel — see messengerHref. */
    messenger: messengerHref(branch.facebookUrl),
    phone: telHref(branch.phone),
    whatsapp: whatsappHref(branch.whatsapp, whatsappMessage),
    maps: branch.reviewsUrl ?? mapsHref(branch.mapQuery),
    directions: mapsHref(branch.mapQuery),
    facebook: branch.facebookUrl,
  };
}

/** Default availability-confirmation message used across CTAs. */
export const DEFAULT_WA_MESSAGE =
  "Hi! I'd like to confirm today's stock at The Sausage Guy Panglao.";
