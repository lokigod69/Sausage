import type { Branch } from "@/lib/types";
import { digitsOnly, mapsHref } from "@/lib/contact";

/**
 * LocalBusiness / Store structured data. No geo coordinates are invented —
 * we provide the postal address and a hasMap link to the Maps query instead.
 */
export function StructuredData({
  branch,
  siteUrl,
  pageUrl,
}: {
  branch: Branch;
  siteUrl: string;
  pageUrl: string;
}) {
  const phone = `+${digitsOnly(branch.phone)}`;

  const json = {
    "@context": "https://schema.org",
    /*
     * Store plus GroceryStore: this is a meat and deli counter attached to a
     * grocery shelf, and the pair describes that better than either alone.
     * Deliberately not a butcher shop type — the steaks are imported and the
     * charcuterie comes from local producers.
     */
    "@type": ["Store", "GroceryStore"],
    "@id": `${pageUrl}#store`,
    name: branch.name,
    description:
      "Meat and deli store in Panglao, Bohol. Imported US and Brazilian steaks cut to order, sausages and cold cuts from local producers, cheese, seafood and groceries. Delivery by Maxim across Panglao, Dauis and Tagbilaran.",
    url: pageUrl,
    telephone: phone,
    image: `${siteUrl}/brand/logo-lockup-dark.png`,
    priceRange: "$$",
    currenciesAccepted: "PHP",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Inside Dason Store, Purok 5, Bolod",
      addressLocality: "Panglao",
      addressRegion: "Bohol",
      postalCode: "6340",
      addressCountry: "PH",
    },
    /*
     * The towns a Maxim rider will actually go to, not a vague "Bohol". This
     * is what a local pack is matched against when someone in Tagbilaran
     * searches for a shop that delivers, and it has to stay in step with
     * components/DeliverySection.tsx.
     */
    areaServed: [
      "Panglao",
      "Dauis",
      "Tagbilaran",
      "Baclayon",
      "Alburquerque",
      "Cortes",
      "Bohol",
    ].map((name) => ({ "@type": "City", name })),
    hasMap: mapsHref(branch.mapQuery),
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        opens: branch.hours.open,
        closes: branch.hours.close,
      },
    ],
    sameAs: [branch.facebookUrl],
    department: branch.featuredCategories.map((c) => ({
      "@type": "Store",
      name: c.label,
    })),
    ...(branch.rating && branch.reviewCount
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: branch.rating,
            reviewCount: branch.reviewCount,
            bestRating: 5,
          },
        }
      : {}),
  };

  return (
    <script
      type="application/ld+json"
      // JSON-LD is static, server-rendered, and contains no user input.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  );
}
