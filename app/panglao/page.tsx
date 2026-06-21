import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBranch } from "@/data/branches";
import { resolveVariant } from "@/lib/variant";
import { BranchPage } from "@/components/BranchPage";
import { StructuredData } from "@/components/StructuredData";

const BRANCH_SLUG = "panglao";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "http://localhost:3000";
const PANGLAO_PATH = process.env.NEXT_PUBLIC_PANGLAO_PATH || "/panglao";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export const metadata: Metadata = {
  title: "The Sausage Guy Panglao — Sausages, Steaks, Seafood & Deli",
  description:
    "Premium sausages, steaks, salmon, hams, bacon and deli goods in Panglao, Bohol. Open daily 8 AM–8 PM inside Dason Store, Bolod. Message us to confirm today's stock.",
  alternates: { canonical: PANGLAO_PATH },
  openGraph: {
    url: `${SITE_URL}${PANGLAO_PATH}`,
    title: "The Sausage Guy Panglao — Sausages, Steaks, Seafood & Deli",
    description:
      "Premium sausages, steaks, seafood, cheese, dairy and deli goods in Panglao, Bohol. Open daily 8 AM–8 PM inside Dason Store, Bolod.",
  },
};

export default async function PanglaoPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const branch = getBranch(BRANCH_SLUG);
  if (!branch) notFound();

  const params = await searchParams;
  const variant = resolveVariant(params.variant);

  return (
    <>
      <StructuredData
        branch={branch}
        siteUrl={SITE_URL}
        pageUrl={`${SITE_URL}${PANGLAO_PATH}`}
      />
      <BranchPage branch={branch} variant={variant} basePath={PANGLAO_PATH} />
    </>
  );
}
