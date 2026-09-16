import type { Metadata, Viewport } from "next";
import { Fraunces, Hanken_Grotesk, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { HOME_SEO } from "@/data/seo";
import { SITE_URL } from "@/lib/site";

/**
 * Self-hosted via next/font — zero layout shift, no external requests.
 * Fraunces carries the editorial voice, Hanken Grotesk is the workhorse body
 * face, IBM Plex Mono handles numerals and the small stock labels.
 *
 * No italic. It was requested here and preloaded on every page — an 80 KB
 * variable font, the single largest thing the browser fetched — and not one
 * element on the site is italic. The only mention of italics left in the
 * codebase was a comment describing a design variant that no longer exists.
 *
 * The opsz axis stays: Fraunces is drawn to change shape with size, and the
 * headings run from 0.9rem eyebrows to 3.4rem category titles, which is
 * exactly the range it is for.
 */
const fraunces = Fraunces({
  subsets: ["latin"],
  axes: ["opsz"],
  variable: "--font-fraunces",
  display: "swap",
});

const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-hanken",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#12100d",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${HOME_SEO.title} | The Sausage Guy`,
    // Pages supply the specific half; the shop name is appended once here so
    // no page has to remember to add it.
    template: "%s · The Sausage Guy",
  },
  description: HOME_SEO.description,
  applicationName: "The Sausage Guy Panglao",
  /*
   * Keywords are ignored by Google and have been for years. Kept short and
   * honest for the handful of smaller engines that still read them, and
   * because they cost nothing; the real work is done by the per-page titles
   * and descriptions in data/seo.ts.
   */
  keywords: [
    "meat shop Panglao",
    "deli Panglao Bohol",
    "steak Panglao",
    "US and Brazilian beef Bohol",
    "German sausage Philippines",
    "grocery delivery Tagbilaran",
  ],
  openGraph: {
    type: "website",
    title: `${HOME_SEO.title} | The Sausage Guy`,
    description: HOME_SEO.description,
    siteName: "The Sausage Guy Panglao",
    locale: "en_PH",
    images: [
      {
        url: "/branches/panglao-hero.jpg",
        width: 1536,
        height: 1024,
        alt: "The Sausage Guy Panglao — premium meats, seafood and deli goods",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${HOME_SEO.title} | The Sausage Guy`,
    description: HOME_SEO.description,
    images: ["/branches/panglao-hero.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${hanken.variable} ${plexMono.variable}`}
    >
      <body>
        {/*
          First thing in the tab order on every page. The header below it
          holds the brand, three contact controls and fifteen aisle links —
          nineteen stops before the first word of content for anyone using a
          keyboard or a switch. It is off-screen until focused.
        */}
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
