import type { Metadata, Viewport } from "next";
import { Fraunces, Hanken_Grotesk, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { HOME_SEO } from "@/data/seo";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "http://localhost:3000";

/**
 * Self-hosted via next/font — zero layout shift, no external requests.
 * Fraunces carries the editorial voice (optical sizing + true italics),
 * Hanken Grotesk is the workhorse body face, IBM Plex Mono handles
 * numerals, labels and the provisions ticker.
 */
const fraunces = Fraunces({
  subsets: ["latin"],
  style: ["normal", "italic"],
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
    "butcher Panglao",
    "deli Bohol",
    "German sausage Philippines",
    "steak Panglao",
    "frozen seafood Bohol",
    "European groceries Panglao",
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
      <body>{children}</body>
    </html>
  );
}
