import type { Branch } from "@/lib/types";
import { getBranchCatalog } from "@/lib/catalog";
import { forClient } from "@/lib/products";
import { AnnouncementBar } from "./AnnouncementBar";
import { Header } from "./Header";
import { Hero } from "./Hero";
import { QuickActions } from "./QuickActions";
import { CategoryGrid } from "./CategoryGrid";
import { TrustStrip } from "./TrustStrip";
import { ProductBrowser } from "./ProductBrowser";
import { DeliverySection } from "./DeliverySection";
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
 * actions: search + the five contact channels) → what do you sell
 * (categories) → can I trust you (trust strip) → the full list → what if I
 * can't get there (delivery) → what do others say → where exactly are you.
 *
 * Delivery sits after the catalogue on purpose. It only becomes interesting
 * once someone has seen something they want, and before that it is just
 * another claim.
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
  // Search and the product list are client components, so their props are
  // serialised into the document. See forClient: it drops the POS join key
  // and two other fields the browser never reads.
  const listed = forClient(products);

  return (
    <div className="atmosphere">
      <AnnouncementBar branch={branch} />
      <Header branch={branch} basePath={basePath} />

      <main id="top" className="pb-24 md:pb-0">
        <Hero branch={branch} />
        <QuickActions branch={branch} products={listed} basePath={basePath} />
        <CategoryGrid branch={branch} products={products} basePath={basePath} />
        <TrustStrip />
        <ProductBrowser
          branch={branch}
          products={listed}
          syncedAt={catalog.syncedAt}
        />
        <DeliverySection branch={branch} />
        <Reviews branch={branch} />
        <LocationSection branch={branch} />
      </main>

      <Footer branch={branch} basePath={basePath} />
      <StickyContactBar branch={branch} />
    </div>
  );
}
