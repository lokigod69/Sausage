/**
 * Google Places API (New) client — the licensed way to read a listing's
 * rating and reviews.
 *
 * Why the API and not the Maps page: review text is written by customers and
 * served under Google's terms. The API grants the right to display it, and in
 * exchange requires the author attribution it returns to be shown with each
 * quote. `scripts/sync-reviews.mts` keeps that attribution attached.
 *
 * Reviews arrive as at most five, chosen by Google — not the full history.
 */

const PLACES_BASE = "https://places.googleapis.com/v1";

export interface PlaceReview {
  /** Review body, as Google returns it. Never edited. */
  text: string;
  /** Language Google reports for `text`, e.g. "en". */
  languageCode?: string;
  rating: number;
  /** Google's own wording, e.g. "a month ago". */
  relativeTime?: string;
  publishTime?: string;
  /** REQUIRED on display: the reviewer's name and link to their profile. */
  authorName: string;
  authorUri?: string;
  authorPhotoUri?: string;
}

export interface PlaceDetails {
  placeId: string;
  displayName?: string;
  formattedAddress?: string;
  rating?: number;
  reviewCount?: number;
  /** Canonical Google Maps link for the listing. */
  googleMapsUri?: string;
  reviews: PlaceReview[];
}

export class PlacesError extends Error {
  readonly status?: number;
  constructor(message: string, status?: number) {
    super(message);
    this.name = "PlacesError";
    this.status = status;
  }
}

export function getPlacesApiKey(): string | undefined {
  const key = process.env.GOOGLE_PLACES_API_KEY?.trim();
  return key ? key : undefined;
}

/** Pinning the place id skips the lookup and removes any ambiguity. */
export function getConfiguredPlaceId(): string | undefined {
  const id = process.env.GOOGLE_PLACE_ID?.trim();
  return id ? id : undefined;
}

function requireKey(): string {
  const key = getPlacesApiKey();
  if (!key) {
    throw new PlacesError(
      "GOOGLE_PLACES_API_KEY is not set. Create a key in Google Cloud with the Places API (New) enabled, then add it to .env.local.",
    );
  }
  return key;
}

async function placesRequest<T>(
  path: string,
  fieldMask: string,
  init?: RequestInit,
): Promise<T> {
  const res = await fetch(`${PLACES_BASE}${path}`, {
    ...init,
    headers: {
      "X-Goog-Api-Key": requireKey(),
      "X-Goog-FieldMask": fieldMask,
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  if (res.status === 403 || res.status === 401) {
    throw new PlacesError(
      `Google rejected the API key (HTTP ${res.status}). Check that the Places API (New) is enabled for the project and that any key restrictions allow server-side use.`,
      res.status,
    );
  }

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new PlacesError(
      `Places ${path} returned HTTP ${res.status}. ${body.slice(0, 300)}`,
      res.status,
    );
  }

  return (await res.json()) as T;
}

function str(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() !== ""
    ? value.trim()
    : undefined;
}

/** Resolve a free-text query (the branch's `mapQuery`) to a place id. */
export async function findPlaceId(query: string): Promise<string | undefined> {
  const data = await placesRequest<Record<string, unknown>>(
    "/places:searchText",
    "places.id,places.displayName,places.formattedAddress",
    { method: "POST", body: JSON.stringify({ textQuery: query, maxResultCount: 1 }) },
  );

  const places = Array.isArray(data.places) ? data.places : [];
  const first = places[0] as Record<string, unknown> | undefined;
  return first ? str(first.id) : undefined;
}

export async function fetchPlaceDetails(placeId: string): Promise<PlaceDetails> {
  const data = await placesRequest<Record<string, unknown>>(
    `/places/${encodeURIComponent(placeId)}`,
    "id,displayName,formattedAddress,rating,userRatingCount,googleMapsUri,reviews",
    { method: "GET" },
  );

  const rawReviews = Array.isArray(data.reviews) ? data.reviews : [];
  const reviews: PlaceReview[] = [];

  for (const raw of rawReviews as Record<string, unknown>[]) {
    const textObj = raw.text as Record<string, unknown> | undefined;
    const text = str(textObj?.text);
    const author = raw.authorAttribution as Record<string, unknown> | undefined;
    const authorName = str(author?.displayName);
    // Attribution is not optional under Google's terms: a review we cannot
    // credit is a review we do not publish.
    if (!text || !authorName) continue;

    const rating = typeof raw.rating === "number" ? raw.rating : 5;
    reviews.push({
      text,
      languageCode: str(textObj?.languageCode),
      rating,
      relativeTime: str(raw.relativePublishTimeDescription),
      publishTime: str(raw.publishTime),
      authorName,
      authorUri: str(author?.uri),
      authorPhotoUri: str(author?.photoUri),
    });
  }

  const displayName = (data.displayName as Record<string, unknown> | undefined)
    ?.text;

  return {
    placeId: str(data.id) ?? placeId,
    displayName: str(displayName),
    formattedAddress: str(data.formattedAddress),
    rating: typeof data.rating === "number" ? data.rating : undefined,
    reviewCount:
      typeof data.userRatingCount === "number" ? data.userRatingCount : undefined,
    googleMapsUri: str(data.googleMapsUri),
    reviews,
  };
}
