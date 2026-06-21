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
    "@type": "Store",
    "@id": `${pageUrl}#store`,
    name: branch.name,
    description:
      "Premium sausages, steaks, salmon, hams, bacon and deli goods in Panglao, Bohol.",
    url: pageUrl,
    telephone: phone,
    image: `${siteUrl}/brand/sausage-guy-logo.png`,
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
    areaServed: ["Panglao", "Bohol"],
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
