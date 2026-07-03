import type { Metadata, Viewport } from "next";
import { Fraunces, Hanken_Grotesk, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

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
    default: "The Sausage Guy Panglao — Sausages, Steaks, Seafood & Deli",
    template: "%s · The Sausage Guy",
  },
  description:
    "Premium sausages, steaks, salmon, hams, bacon and deli goods in Panglao, Bohol. Open daily 8 AM–8 PM inside Dason Store, Bolod.",
  applicationName: "The Sausage Guy Panglao",
  keywords: [
    "Panglao deli",
    "Bohol steaks",
    "frozen seafood Panglao",
    "sausages Bohol",
    "salmon Panglao",
    "butcher Panglao",
  ],
  openGraph: {
    type: "website",
    title: "The Sausage Guy Panglao — Sausages, Steaks, Seafood & Deli",
    description:
      "Premium sausages, steaks, salmon, hams, bacon and deli goods in Panglao, Bohol. Open daily 8 AM–8 PM inside Dason Store, Bolod.",
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
    title: "The Sausage Guy Panglao — Sausages, Steaks, Seafood & Deli",
    description:
      "Premium sausages, steaks, salmon, hams, bacon and deli goods in Panglao, Bohol. Open daily 8 AM–8 PM.",
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
