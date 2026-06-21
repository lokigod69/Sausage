/**
 * Real Google reviews for the Panglao branch (5.0 ★ from 16 reviews).
 * Lightly trimmed for length; wording kept faithful. Aggregate rating + count
 * live on the Branch (rating / reviewCount / reviewsUrl).
 */
export interface ReviewQuote {
  quote: string;
  author: string;
  /** Reviewer context shown under the name, e.g. "Local Guide · 133 reviews". */
  meta?: string;
}

export const REVIEW_QUOTES: Record<string, ReviewQuote[]> = {
  panglao: [
    {
      quote:
        "Best bacon in Panglao, better than bacon in North America by a lot. Lean, smoky and great tasting.",
      author: "Matt Griffith",
      meta: "Local Guide · 133 reviews",
    },
    {
      quote:
        "It's hard to find quality in Panglao, so I was happy to find this store! Amazing ribeye and tenderloin steaks, ground beef and chicken — plus a great selection of yoghurt and cheese.",
      author: "Jad B",
      meta: "18 reviews",
    },
    {
      quote:
        "If you want to eat meat in Bohol, you must eat here. The quality is amazing — so tender and absolutely delicious.",
      author: "진현",
      meta: "Local Guide · 25 reviews",
    },
    {
      quote:
        "Excellent quality meat and very friendly service. Everything is always fresh, and the staff is knowledgeable and helpful.",
      author: "Katrin Chmela",
      meta: "12 reviews",
    },
    {
      quote:
        "Beautiful selection of smoked ham, homemade sausages and ribeye steaks. The best store for meat and steaks in the region — they even have pork and beef pies.",
      author: "Moe Sizzlack",
      meta: "5 months ago",
    },
    {
      quote:
        "The sausages, steaks and deli products are fresh, flavorful and high quality. Friendly staff, and definitely worth visiting if you're in Panglao.",
      author: "Jay ann Bolo",
      meta: "a month ago",
    },
    {
      quote: "Best sausage in the region, worth checking out!",
      author: "T. Shakra",
      meta: "Local Guide · 13 reviews",
    },
    {
      quote:
        "Everything I've bought from The Sausage Guy is tasty and first quality. Delivery is fast, accurate and reasonably priced.",
      author: "WmB Nevill",
      meta: "5 months ago",
    },
  ],
};

export function getReviewQuotes(branchSlug: string): ReviewQuote[] {
  return REVIEW_QUOTES[branchSlug] ?? [];
}
