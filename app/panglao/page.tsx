import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBranch } from "@/data/branches";
import { BranchPage } from "@/components/BranchPage";
import { StructuredData } from "@/components/StructuredData";
import { HOME_SEO } from "@/data/seo";

const BRANCH_SLUG = "panglao";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "http://localhost:3000";
const PANGLAO_PATH = process.env.NEXT_PUBLIC_PANGLAO_PATH || "/panglao";

/*
 * The branch page. Its title leads with what the shop IS and where, because
 * that is the search someone actually types — "meat shop Panglao", "where to
 * buy steak Bohol" — rather than the shop's own name, which only people who
 * already know it will search for.
 *
 * The branch slug stays in the path (/panglao) so further branches can sit
 * beside it later without any of these URLs changing.
 */
export const metadata: Metadata = {
  title: HOME_SEO.title,
  description: HOME_SEO.description,
  alternates: { canonical: PANGLAO_PATH },
  openGraph: {
    url: `${SITE_URL}${PANGLAO_PATH}`,
    title: `${HOME_SEO.title} | The Sausage Guy`,
    description: HOME_SEO.description,
    type: "website",
    locale: "en_PH",
    /*
     * Repeated from the layout on purpose. Declaring `openGraph` on a page
     * replaces the parent's block rather than merging into it, so leaving
     * this out shipped the most-shared URL on the site — the one people paste
     * into Messenger — with no preview picture at all.
     */
    images: [
      {
        url: `${SITE_URL}/branches/panglao-hero.jpg`,
        width: 1536,
        height: 1024,
        alt: "The Sausage Guy counter in Panglao: ribeye, salmon, cheese, ham and sausages",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: HOME_SEO.title,
    description: HOME_SEO.description,
    images: [`${SITE_URL}/branches/panglao-hero.jpg`],
  },
};

export default async function PanglaoPage() {
  const branch = getBranch(BRANCH_SLUG);
  if (!branch) notFound();


  return (
    <>
      <StructuredData
        branch={branch}
        siteUrl={SITE_URL}
        pageUrl={`${SITE_URL}${PANGLAO_PATH}`}
      />
      <BranchPage branch={branch} basePath={PANGLAO_PATH} />
    </>
  );
}
