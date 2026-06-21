import type { Metadata } from "next";
import "./globals.css";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "http://localhost:3000";

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
  },
  twitter: {
    card: "summary_large_image",
    title: "The Sausage Guy Panglao — Sausages, Steaks, Seafood & Deli",
    description:
      "Premium sausages, steaks, salmon, hams, bacon and deli goods in Panglao, Bohol. Open daily 8 AM–8 PM.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
