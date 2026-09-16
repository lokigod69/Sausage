import type { Branch } from "@/lib/types";
import { getBranchCatalog } from "@/lib/catalog";
import { AnnouncementBar } from "./AnnouncementBar";
import { Header } from "./Header";
import { Hero } from "./Hero";
import { QuickActions } from "./QuickActions";
import { CategoryGrid } from "./CategoryGrid";
import { TrustStrip } from "./TrustStrip";
import { ProductBrowser } from "./ProductBrowser";
import { Reviews } from "./Reviews";
import { LocationSection } from "./LocationSection";
import { Footer } from "./Footer";
import { StickyContactBar } from "./StickyContactBar";

/**
 * The branch page.
 *
 * One design — Golden Daily — chosen from the six that shipped side by side
 * while the direction was being settled.
 *
 * The order answers a visitor's questions in the order they ask them:
 * who are you (hero) → how do I reach you and what do you have (quick
 * actions: search + WhatsApp + Facebook + directions) → what do you sell
 * (categories) → can I trust you (trust strip) → the full list → what do
 * others say → where exactly are you.
 */
export async function BranchPage({
  branch,
  basePath,
}: {
  branch: Branch;
  basePath: string;
}) {
  // POS snapshot + live stock/price overlay. Never throws: see lib/catalog.ts.
  const catalog = await getBranchCatalog(branch);
  const products = catalog.products;

  return (
    <div className="atmosphere">
      <AnnouncementBar branch={branch} />
      <Header branch={branch} basePath={basePath} />

      <main id="top" className="pb-24 md:pb-0">
        <Hero branch={branch} />
        <QuickActions branch={branch} products={products} basePath={basePath} />
        <CategoryGrid branch={branch} products={products} basePath={basePath} />
        <TrustStrip />
        <ProductBrowser
          branch={branch}
          products={products}
          syncedAt={catalog.syncedAt}
        />
        <Reviews branch={branch} />
        <LocationSection branch={branch} />
      </main>

      <Footer branch={branch} basePath={basePath} />
      <StickyContactBar branch={branch} />
    </div>
  );
}
