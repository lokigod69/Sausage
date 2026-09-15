/**
 * Refresh the Google rating, review count and review quotes for a branch.
 *
 *   npm run sync:reviews
 *
 * Writes data/google-reviews.json. Review text is stored exactly as Google
 * returns it, with the author attribution Google's terms require — see the
 * note in lib/places.ts.
 *
 * Node runs this file directly via type stripping, so relative imports need
 * their real extension and no "@/" aliases.
 */

import {
  fetchPlaceDetails,
  findPlaceId,
  getConfiguredPlaceId,
  getPlacesApiKey,
} from "../lib/places.ts";
import { BRANCHES } from "../data/branches.ts";
import { writeFile } from "node:fs/promises";
import path from "node:path";

const BRANCH_SLUG = process.env.SYNC_BRANCH?.trim() || "panglao";
const OUT_FILE = path.join(process.cwd(), "data", "google-reviews.json");

function fail(message: string): never {
  console.error(`\n  ✗ ${message}\n`);
  process.exit(1);
}

async function main() {
  if (!getPlacesApiKey()) {
    fail(
      "GOOGLE_PLACES_API_KEY is not set.\n" +
        "    1. console.cloud.google.com -> create/select a project\n" +
        "    2. Enable the Places API (New), then create an API key\n" +
        "    3. Put it in .env.local as GOOGLE_PLACES_API_KEY=...\n" +
        "    4. Run npm run sync:reviews again",
    );
  }

  const branch = BRANCHES.find((b) => b.slug === BRANCH_SLUG);
  if (!branch) fail(`No branch "${BRANCH_SLUG}" in data/branches.ts.`);

  console.log(`\n  Refreshing Google reviews for ${branch.name}…\n`);

  const placeId = getConfiguredPlaceId() ?? (await findPlaceId(branch.mapQuery));
  if (!placeId) {
    fail(
      `Google found no place for "${branch.mapQuery}".\n` +
        `    Set GOOGLE_PLACE_ID in .env.local, or adjust mapQuery in data/branches.ts.`,
    );
  }

  const place = await fetchPlaceDetails(placeId);

  console.log(`  Listing:  ${place.displayName ?? "(unnamed)"}`);
  console.log(`  Place id: ${place.placeId}`);
  console.log(`  Address:  ${place.formattedAddress ?? "(none)"}`);
  console.log(`  Rating:   ${place.rating ?? "?"} from ${place.reviewCount ?? "?"} reviews`);
  console.log(`  Quotes:   ${place.reviews.length} returned (Google caps this at 5)\n`);

  const snapshot = {
    version: 1,
    generatedAt: new Date().toISOString(),
    branches: {
      [branch.slug]: {
        placeId: place.placeId,
        displayName: place.displayName,
        formattedAddress: place.formattedAddress,
        rating: place.rating,
        reviewCount: place.reviewCount,
        googleMapsUri: place.googleMapsUri,
        reviews: place.reviews,
      },
    },
  };

  await writeFile(OUT_FILE, `${JSON.stringify(snapshot, null, 2)}\n`, "utf8");

  // The site's own copy is hand-maintained; point out where it has drifted
  // rather than rewriting data/branches.ts from under the owner.
  const drift: string[] = [];
  if (place.rating !== undefined && place.rating !== branch.rating) {
    drift.push(`rating: data/branches.ts says ${branch.rating}, Google says ${place.rating}`);
  }
  if (place.reviewCount !== undefined && place.reviewCount !== branch.reviewCount) {
    drift.push(
      `reviewCount: data/branches.ts says ${branch.reviewCount}, Google says ${place.reviewCount}`,
    );
  }
  if (
    place.formattedAddress &&
    !place.formattedAddress.toLowerCase().includes("bolod")
  ) {
    drift.push(`address: Google now reports "${place.formattedAddress}"`);
  }

  if (drift.length > 0) {
    console.log(`  ! data/branches.ts is out of step with the listing:`);
    for (const d of drift) console.log(`      ${d}`);
    console.log(
      `    The site reads rating/count from this snapshot, so it is already\n` +
        `    correct on the page — update branches.ts only if you want the\n` +
        `    fallback values to match.\n`,
    );
  }

  console.log(`  ✓ Wrote data/google-reviews.json\n`);
}

main().catch((error) => {
  fail(error instanceof Error ? error.message : String(error));
});
