import type { Branch, Variant } from "@/lib/types";
import { getProductsForBranch, getCategories } from "@/lib/products";
import { AnnouncementBar } from "./AnnouncementBar";
import { Header } from "./Header";
import { TrustStrip } from "./TrustStrip";
import { ProductBrowser } from "./ProductBrowser";
import { Reviews } from "./Reviews";
import { LocationSection } from "./LocationSection";
import { Footer } from "./Footer";
import { StickyContactBar } from "./StickyContactBar";
import { VariantSwitcher } from "./VariantSwitcher";
import { HeroNoir } from "./variants/HeroNoir";
import { HeroGolden } from "./variants/HeroGolden";
import { HeroLocker } from "./variants/HeroLocker";
import { HeroOcean } from "./variants/HeroOcean";
import { HeroFuego } from "./variants/HeroFuego";
import { CategoriesNoir } from "./variants/CategoriesNoir";
import { CategoriesGolden } from "./variants/CategoriesGolden";
import { CategoriesLocker } from "./variants/CategoriesLocker";
import { CategoriesOcean } from "./variants/CategoriesOcean";
import { CategoriesFuego } from "./variants/CategoriesFuego";

/**
 * Generic branch page with THREE distinct layouts (not just palettes):
 *  - noir   → editorial masthead + numbered index, classic flow
 *  - golden → warm market hero + shelf cards, goods shown early
 *  - locker → search-first dashboard, product browser pulled high
 *
 * Each variant chooses its own hero, category presentation and section order.
 */
export function BranchPage({
  branch,
  variant,
  basePath,
}: {
  branch: Branch;
  variant: Variant;
  basePath: string;
}) {
  const products = getProductsForBranch(branch.slug);

  // Shared building blocks (referenced by the per-variant arrangements below).
  const trust = <TrustStrip />;
  const browser = <ProductBrowser branch={branch} products={products} />;
  const lockerBrowser = (
    <ProductBrowser branch={branch} products={products} mode="grid" />
  );
  const reviews = <Reviews branch={branch} />;
  const location = <LocationSection branch={branch} />;

  let hero: React.ReactNode;
  let categories: React.ReactNode;
  let sections: React.ReactNode;

  if (variant === "golden") {
    hero = <HeroGolden branch={branch} />;
    categories = <CategoriesGolden branch={branch} products={products} />;
    // Market: show the goods early, then reassurance, full list, reviews.
    sections = (
      <>
        {hero}
        {categories}
        {trust}
        {browser}
        {reviews}
        {location}
      </>
    );
  } else if (variant === "locker") {
    hero = (
      <HeroLocker
        branch={branch}
        productCount={products.length}
        categoryCount={getCategories(products).length}
      />
    );
    categories = <CategoriesLocker branch={branch} products={products} />;
    // Utility: search-first → dense inventory grid → compartments → reviews.
    sections = (
      <>
        {hero}
        {trust}
        {lockerBrowser}
        {categories}
        {reviews}
        {location}
      </>
    );
  } else if (variant === "ocean") {
    hero = <HeroOcean branch={branch} />;
    categories = <CategoriesOcean branch={branch} products={products} />;
    // Resort: breezy flow — goods early, reassurance, full list, reviews.
    sections = (
      <>
        {hero}
        {categories}
        {trust}
        {browser}
        {reviews}
        {location}
      </>
    );
  } else if (variant === "fuego") {
    hero = (
      <HeroFuego
        branch={branch}
        productCount={products.length}
        categoryCount={getCategories(products).length}
      />
    );
    categories = <CategoriesFuego branch={branch} products={products} />;
    // Smokehouse: Hero → Trust → Categories → Browser → Reviews → Location
    sections = (
      <>
        {hero}
        {trust}
        {categories}
        {browser}
        {reviews}
        {location}
      </>
    );
  } else {
    hero = <HeroNoir branch={branch} />;
    categories = <CategoriesNoir branch={branch} products={products} />;
    // Editorial: masthead → reassurance → index → list → reviews → visit.
    // (No deal block here — it duplicated the browser's closing "message us".)
    sections = (
      <>
        {hero}
        {trust}
        {categories}
        {browser}
        {reviews}
        {location}
      </>
    );
  }

  return (
    <div className="atmosphere" data-variant={variant}>
      <AnnouncementBar branch={branch} />
      <Header branch={branch} />
      <main className="pb-24 md:pb-0">{sections}</main>
      <Footer branch={branch} />
      <StickyContactBar branch={branch} />
      <VariantSwitcher active={variant} basePath={basePath} />
    </div>
  );
}
