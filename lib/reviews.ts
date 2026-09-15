import type { Branch } from "@/lib/types";
import { getReviewQuotes, type ReviewQuote } from "@/data/reviews";
import snapshot from "@/data/google-reviews.json";

/**
 * Where the Reviews section gets its numbers and quotes.
 *
 * Google's snapshot (written by `scripts/sync-reviews.mts`) wins when it is
 * present, because it is the only copy that can be verified and the only one
 * carrying the author attribution Google's terms require. The hand-maintained
 * `data/reviews.ts` is the fallback, so the section still renders before the
 * first sync — or if the listing is ever unreachable.
 */

interface SnapshotReview {
  text: string;
  rating: number;
  relativeTime?: string;
  publishTime?: string;
  authorName: string;
  authorUri?: string;
  authorPhotoUri?: string;
}

interface SnapshotBranch {
  placeId: string;
  displayName?: string;
  formattedAddress?: string;
  rating?: number;
  reviewCount?: number;
  googleMapsUri?: string;
  reviews: SnapshotReview[];
}

interface ReviewsSnapshot {
  version: number;
  generatedAt: string | null;
  branches: Record<string, SnapshotBranch>;
}

export interface BranchReviews {
  rating?: number;
  reviewCount?: number;
  reviewsUrl?: string;
  quotes: ReviewQuote[];
  /** True when rating, count and quotes came from the Google sync. */
  fromGoogle: boolean;
  /** When the sync last ran, for the attribution line. */
  syncedAt?: string;
}

const SNAPSHOT = snapshot as ReviewsSnapshot;

export function getBranchReviews(branch: Branch): BranchReviews {
  const snap = SNAPSHOT.branches[branch.slug];

  if (snap && snap.rating !== undefined && snap.reviewCount !== undefined) {
    return {
      rating: snap.rating,
      reviewCount: snap.reviewCount,
      reviewsUrl: snap.googleMapsUri ?? branch.reviewsUrl,
      // Google returns at most five, and they rotate. Text is passed through
      // untouched — trimming or tidying a review would misquote its author.
      quotes: snap.reviews.map((r) => ({
        quote: r.text,
        author: r.authorName,
        meta: r.relativeTime,
        authorUri: r.authorUri,
        rating: r.rating,
      })),
      fromGoogle: true,
      syncedAt: SNAPSHOT.generatedAt ?? undefined,
    };
  }

  return {
    rating: branch.rating,
    reviewCount: branch.reviewCount,
    reviewsUrl: branch.reviewsUrl,
    quotes: getReviewQuotes(branch.slug),
    fromGoogle: false,
  };
}
