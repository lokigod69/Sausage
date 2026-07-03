# Codebase Readout

Date reviewed: 2026-07-03

This is a compact Next.js App Router microsite for The Sausage Guy Panglao. It is
structured as a branch-ready, static-data storefront rather than a checkout app:
the site explains the store, shows categories and catalog items, and pushes users
to WhatsApp, phone, Google Maps, Facebook, or Google reviews.

## 1. Architecture Overview

### Stack

- Framework: Next.js 15.5.19 with the App Router.
- React: 19.1.0.
- Language: TypeScript with `strict: true`.
- Styling: Tailwind CSS v4 via `@tailwindcss/postcss`; no separate
  `tailwind.config.*` file exists.
- Runtime data: local TypeScript modules under `data/`; there is no database,
  CMS, fetch call, server action, route handler, or API route.
- Images: local files under `public/` and rendered mostly through `next/image`.
- External destinations: WhatsApp `wa.me`, `tel:`, Google Maps search URLs,
  Facebook, and Google reviews.

### Top-level structure

```txt
app/
  layout.tsx           Root metadata and global CSS import.
  page.tsx             Root route, redirects to /panglao or env override.
  panglao/page.tsx     Branch route, resolves variant and renders BranchPage.
  not-found.tsx        Branded 404 using the noir token set.
  robots.ts            MetadataRoute robots response.
  sitemap.ts           MetadataRoute sitemap response from branch slugs.
  globals.css          Tailwind import, design tokens, variants, utilities.
  icon.svg             App favicon SVG, outside public/.
  apple-icon.png       App Apple touch icon, outside public/.

components/
  Shared layout, content, contact, product, SEO, icon, and image components.
  variants/            Variant-specific hero/category/story components.

data/
  branches.ts          Branch registry and featured category definitions.
  products.ts          Public-safe raw product rows.
  reviews.ts           Review quote data.
  image-prompts.ts     Prompt library for future image generation.

lib/
  types.ts             Domain types and variant metadata.
  products.ts          Product normalization, grouping, search, card counts.
  contact.ts           Link builders for WhatsApp, phone, maps.
  variant.ts           Query-string variant resolver.

public/
  brand/               Logo and mark assets.
  branches/            Branch hero imagery.
  products/            Category and story imagery.
  silhouettes/         Noir story SVG silhouettes.
```

### Routing

- `/` is implemented by `app/page.tsx` and redirects to
  `process.env.NEXT_PUBLIC_PANGLAO_PATH || "/panglao"`.
- `/panglao` is implemented by `app/panglao/page.tsx`.
- There is no dynamic route such as `/[branch]`; the Panglao branch is hardcoded
  in the page as `BRANCH_SLUG = "panglao"`.
- `app/not-found.tsx` handles 404s with a branded page and a link back to the
  Panglao route.
- `NEXT_PUBLIC_PANGLAO_PATH` can change the public branch path, but the physical
  route file is still `app/panglao/page.tsx`.

### Page render flow

1. `app/layout.tsx` imports `app/globals.css`, sets global metadata, and renders
   `{children}` inside `<html lang="en">`.
2. `app/page.tsx` redirects root visitors to the configured Panglao path.
3. `app/panglao/page.tsx`:
   - Reads the Panglao branch via `getBranch("panglao")`.
   - Calls `notFound()` if the branch is missing.
   - Awaits `searchParams` and resolves `searchParams.variant`.
   - Renders `<StructuredData />`.
   - Renders `<BranchPage branch={branch} variant={variant} basePath={...} />`.
4. `BranchPage`:
   - Calls `getProductsForBranch(branch.slug)`.
   - Creates shared blocks: `TrustStrip`, `ProductBrowser`, `Reviews`,
     `LocationSection`.
   - Selects variant-specific hero/category/story components and section order.
   - Wraps the page in `<div className="atmosphere" data-variant={variant}>`.
   - Adds persistent chrome: `AnnouncementBar`, `Header`, `Footer`,
     `StickyContactBar`, `VariantSwitcher`.

### Data flow

- `data/branches.ts` defines branch display data, contact data, hours, category
  cards, rating, and review links.
- `data/products.ts` exports public-safe `RawProductRow[]` data keyed by branch.
- `lib/products.ts` is the public-data chokepoint:
  - `normalizeProduct()` converts each raw row into a public `Product`.
  - Cost, sell price, margin, and notes are never read or exposed.
  - `getProductsForBranch()` returns normalized products.
  - `groupByCategory()`, `getCategories()`, `searchProducts()`, and
    `getFeaturedCategoryCards()` support UI grouping and filters.
- `ProductBrowser` receives normalized products as props and performs client-side
  search/filtering only on public fields.
- `data/reviews.ts` provides review quotes keyed by branch. Aggregate rating and
  review count live on the `Branch`.
- `lib/contact.ts` builds WhatsApp, phone, and Google Maps URLs from `Branch`.

### Client-side behavior

Files marked with `"use client"`:

- `components/RevealObserver.tsx`
  - Watches `[data-reveal]` elements and adds `.is-in` when they enter the
    viewport.
  - Falls back to showing elements immediately when `IntersectionObserver` is not
    available.
  - Rendered once inside the fable branch of `BranchPage`.
- `components/OpenStatus.tsx`
  - Computes "Open now" or "Closed now" in the `Asia/Manila` timezone after
    mount.
  - Recomputes every 60 seconds.
  - Renders "Open daily" on the server to avoid hydration mismatch.
- `components/ProductBrowser.tsx`
  - Owns search query and active category filter state.
  - Listens for clicks on `[data-target-category]` category links.
  - Stores active categories as `string[]`; an empty array means All.
  - Can parse comma-separated `data-target-category` values into multiple source
    categories.
  - Listens for the custom `sg:search` event from the locker hero.
  - Renders either accordion sections or a dense grid.
- `components/variants/HeroLocker.tsx`
  - Has a hero search form.
  - Dispatches `new CustomEvent("sg:search", { detail: value })`.
  - Scrolls to `#products`.
- `components/variants/HeroFuego.tsx`
  - Generates ember particles after mount using `Math.random()`.

All other components are server-capable by default, although components imported
by client components, such as `SectionHeading` and icons, are bundled into the
client where used.

## 2. Variant And Mode System

The design variant system is defined in `lib/types.ts`, resolved in
`lib/variant.ts`, rendered in `components/BranchPage.tsx`, and styled in
`app/globals.css`.

### Variant definitions

`Variant` is a string union:

```ts
export type Variant = "fable" | "noir" | "golden" | "locker" | "ocean" | "fuego";
```

`VARIANTS` preserves switcher order:

```ts
["fable", "noir", "golden", "locker", "ocean", "fuego"]
```

`DEFAULT_VARIANT` is `"fable"`.

`VARIANT_META` provides switcher names and blurbs:

| Variant | Display name | Blurb |
| --- | --- | --- |
| `fable` | Fable Atelier | Charcoal, butcher paper and copper; candlelit editorial atelier for fine provisions. |
| `noir` | Noir Deli | Premium black, charcoal and bone; boutique butcher and European deli. |
| `golden` | Golden Daily | Warm gold, coffee and parchment; sunny family-friendly daily market. |
| `locker` | Island Provision Locker | Charcoal, deep green and brass; modern provision store and freezer. |
| `ocean` | Ocean Pearl | Seafoam, pearl and deep teal; tropical beachside pantry and fresh catches. |
| `fuego` | Fuego Grill | Volcanic black, smoke and orange ember; live-fire barbecue and smoked meats. |

### Variant resolution

`resolveVariant(raw)` accepts `string | string[] | undefined` from Next.js
`searchParams.variant`.

- If `raw` is an array, the first value wins.
- If the value passes `isVariant()`, it is returned.
- Otherwise the page falls back to `"fable"`.

Examples:

- `/panglao` -> `fable`
- `/panglao?variant=fable` -> `fable`
- `/panglao?variant=noir` -> `noir`
- `/panglao?variant=golden` -> `golden`
- `/panglao?variant=locker` -> `locker`
- `/panglao?variant=ocean` -> `ocean`
- `/panglao?variant=fuego` -> `fuego`
- `/panglao?variant=unknown` -> `fable`

### Switching and persistence

- The active variant is persisted only in the URL query string.
- There is no `localStorage`, `sessionStorage`, cookie, server-side user
  preference, or database persistence.
- The switcher creates links like `${basePath}?variant=${v}`.
- The current switcher is a zero-JS `<details>` popover with two-tone swatches.
- It renders at all breakpoints: above the mobile sticky contact bar on small
  screens and bottom-left on desktop.
- The root redirect in `app/page.tsx` does not preserve query params, so
  `/?variant=ocean` redirects to `/panglao` and loses the variant.
- The canonical URL for all variants remains `/panglao`; variant URLs are
  preview/design URLs rather than separate SEO targets.

### Rendering model

`BranchPage` uses the variant to choose:

- The hero component.
- The category component.
- The order of major sections.
- The `ProductBrowser` mode for the locker variant.

`BranchPage` also sets `data-variant={variant}` on the top-level `.atmosphere`
container. CSS tokens under `[data-variant="..."]` then control colors, radii,
shadow behavior, surface treatment, button treatment, and some motion.

The `:root` token block currently duplicates the fable values, so the app has
fable-like defaults even before a `data-variant` attribute applies.

### Section order by variant

| Variant | Section order |
| --- | --- |
| `fable` | `HeroFable` -> `FableStory` -> `CategoriesFable` -> `ProductBrowser` sections -> `Reviews` -> `LocationSection` -> `RevealObserver`. It intentionally omits `TrustStrip`; the ticker and stats rail carry that role. |
| `noir` | `HeroNoir` -> `TrustStrip` -> `NoirProvisionsStory` -> `CategoriesNoir` -> `ProductBrowser` sections -> `Reviews` -> `LocationSection` |
| `golden` | `HeroGolden` -> `CategoriesGolden` -> `TrustStrip` -> `ProductBrowser` sections -> `Reviews` -> `LocationSection` |
| `locker` | `HeroLocker` -> `TrustStrip` -> `ProductBrowser mode="grid"` -> `CategoriesLocker` -> `Reviews` -> `LocationSection` |
| `ocean` | `HeroOcean` -> `CategoriesOcean` -> `TrustStrip` -> `ProductBrowser` sections -> `Reviews` -> `LocationSection` |
| `fuego` | `HeroFuego` -> `TrustStrip` -> `CategoriesFuego` -> `ProductBrowser` sections -> `Reviews` -> `LocationSection` |

Global chrome around all variants:

- `AnnouncementBar`
- `Header`
- `Footer`
- `StickyContactBar`
- `VariantSwitcher`

### ProductBrowser modes

`ProductBrowser` has its own mode prop:

- `mode="sections"`: default. Search input, category chips, and collapsible
  category accordions. Used by fable, noir, golden, ocean, and fuego.
- `mode="grid"`: flat dense inventory grid. Used only by locker.

This is separate from design variants, but it is part of the overall mode system
because the locker variant changes product browsing behavior.

### Variant design languages

#### Fable Atelier (`fable`)

- Default variant in `lib/types.ts` and fully wired in `BranchPage`.
- CSS language:
  - Espresso charcoal background, butcher-paper kraft support color, bone text.
  - Burnished copper accent `#cf9d5c`, brighter copper `#e2b878`, oxblood
    secondary accent `#8a3a28`.
  - Candlelit editorial treatment with hairline rules, true italics, generous
    spacing, and kraft-paper panels.
  - Fable-specific helpers include `.fable-paper`, `.fable-dropcap`,
    `.fable-ticker`, `.fable-frame`, `.fable-plate`, `.fable-scrollcue`,
    `[data-reveal]`, and `.vswitch-*`.
- Hero:
  - `HeroFable` provides a full-bleed photo masthead, bottom-anchored editorial
    headline, WhatsApp/maps CTAs, open status, rating rail, scroll cue, and
    provisions ticker.
- Category treatment:
  - `CategoriesFable` provides an asymmetric editorial plate grid with the first
    two categories as wide gallery plates and the rest in a tighter grid.
- Story:
  - `FableStory` provides a drop-cap narrative, matted photo, kraft logo stamp,
    stats rail, and weekly promo banner.

#### Noir Deli (`noir`)

- Previously the default/fallback; now a selectable variant and the effective
  content fallback inside `BranchPage`.
- CSS language:
  - Warm parchment background, cream surfaces, charcoal text.
  - Butcher red-orange accent `#a94313`.
  - Charcoal secondary accent `#2e261f`.
  - Editorial serif display type, soft but restrained radii.
- Hero:
  - Full-bleed photographic masthead with dark overlay.
  - Large editorial headline: "Premium provisions in Panglao."
  - WhatsApp and directions CTAs.
  - Three-cell metadata strip below the hero.
- Category treatment:
  - Four-column card grid with large food photography.
  - Numbered index styling.
- Unique content:
  - Includes `NoirProvisionsStory`, a brand/story section with two product photo
    rows and six silhouette-backed provision bullets.

#### Golden Daily (`golden`)

- CSS language:
  - Warm sand/parchment background, charcoal text.
  - Terracotta accent `#d97757`, coffee secondary accent `#7a4a26`.
  - Rounder radii and friendlier market feel.
- Hero:
  - Split layout with text on the left and an overlapping card stack on the
    right.
  - Sun-arc decorative background.
  - Card stack includes logo, hero photo, hours pill, and address pill.
- Category treatment:
  - Two-column horizontal "market shelf" cards.
  - Square media plates, soft shadows, friendly count pills.
- Flow:
  - Shows category cards before trust strip and full product list.

#### Island Provision Locker (`locker`)

- CSS language:
  - Deep spruce/near-black background.
  - Sage text, brass accent `#cda250`, pine secondary accent `#4a7856`.
  - Sharp radii, mono labels, tighter utility feel.
- Hero:
  - Search-first dashboard.
  - Functional search field dispatches `sg:search`.
  - Product/category stats and compact open status.
  - Compartment grid backdrop.
- Product browser:
  - Uses `mode="grid"` and appears before category cards.
- Category treatment:
  - Dense compartment tiles with photo backgrounds, mono counts, and hover
    "Open" cue.

#### Ocean Pearl (`ocean`)

- CSS language:
  - Deep teal background, pearl/seafoam text, teal accent `#2dd4bf`, coral
    secondary accent `#f43f5e`.
  - Rounded, glassy surfaces with blur and saturation.
  - Sea-glass card hover shadows and a wave divider animation.
- Hero:
  - Luxury beachside/resort pantry language.
  - Text and floating glass information card.
  - Hero photo, logo, address, hours, and wayfinding.
  - Wave SVG divider at bottom.
- Category treatment:
  - Horizontal snap cards on mobile, grid on desktop.
  - Glassmorphic cards with circular initial badges and "Browse Section" footer.

#### Fuego Grill (`fuego`)

- CSS language:
  - Volcanic soot black background, ember orange accent `#ff6b00`, fire crimson
    secondary accent `#e11d48`.
  - Sharp industrial radii, thick borders, offset block shadows.
  - Heavier uppercase/stencil-like text treatment.
- Hero:
  - Live-fire smokehouse framing.
  - Client-generated ember particles.
  - Heavy "Pit Specifier" board with photo, capacity, hours, wayfinding, and map
    CTA.
- Category treatment:
  - Industrial iron-grate cards with thick frames, 16:9 imagery, item count tags,
    and "OPEN SECTION" footer.

## 3. Component Inventory

### Core page components

| File | Component(s) | Role |
| --- | --- | --- |
| `components/BranchPage.tsx` | `BranchPage` | Server component that assembles the branch page, loads products, chooses variant-specific hero/category components and section order, applies `data-variant`, and renders shared chrome. |
| `components/AnnouncementBar.tsx` | `AnnouncementBar` | Top informational bar with hours and locality. No CTA. |
| `components/Header.tsx` | `Header` | Sticky header with brand logo and anchor nav to Products, Reviews, Visit. Receives the active variant and passes the expected logo tone to `Brand` so only the visible lockup preloads. |
| `components/Footer.tsx` | `Footer` | Slim footer with brand, tagline, quick links, Facebook, copyright, and stock disclaimer. |
| `components/StickyContactBar.tsx` | `StickyContactBar` | Mobile-only fixed contact bar with WhatsApp, Call, and Map actions. |
| `components/VariantSwitcher.tsx` | `VariantSwitcher` | All-breakpoint zero-JS `<details>` design switcher with swatches, linking to each `?variant=` URL. |

### Brand, media, and utility components

| File | Component(s) | Role |
| --- | --- | --- |
| `components/Brand.tsx` | `Brand` | Renders both dark and light transparent logo lockups with CSS deciding which is visible by variant. Computes intrinsic width from fixed heights and the 1800:679 asset ratio. Optional `tone` controls which lockup is allowed to preload. |
| `components/Brand.tsx` | `BranchBadge` | Optional branch badge rendered only when `showBadge` is true. No current caller passes `showBadge`, so it is effectively unused at runtime. |
| `components/HeroPhoto.tsx` | `HeroPhoto` | Decorative `next/image` wrapper for `branch.heroImage`, with fill, object-cover, overlay, and optional priority. |
| `components/CategoryPhoto.tsx` | `categoryImageSrc` | Builds `/products/${slug}.jpg`. |
| `components/CategoryPhoto.tsx` | `CategoryPhoto` | Decorative `next/image` wrapper for category/story photos, with fill, hover scale, overlay, and required `sizes`. |
| `components/SectionHeading.tsx` | `SectionHeading` | Reusable eyebrow, H2, optional intro block with left or centered alignment. Imported by both server and client components. |
| `components/TrustStrip.tsx` | `TrustStrip` | Three value props: Premium meats and deli, Frozen seafood and salmon, Pickup and delivery. |
| `components/OpenStatus.tsx` | `OpenStatus` | Client component that computes open/closed status in Asia/Manila timezone and renders an animated status dot when open. |
| `components/RevealObserver.tsx` | `RevealObserver` | Client component for fable-style scroll reveal. It watches `[data-reveal]`, adds `.is-in`, and is rendered once by the fable branch. |

### Product and content components

| File | Component(s) | Role |
| --- | --- | --- |
| `components/ProductBrowser.tsx` | `ProductBrowser` | Client product search/filter UI. Supports accordion sections and dense grid mode. Listens to category card clicks and `sg:search`; active category state is `string[]` and can represent multiple source categories. |
| `components/ProductBrowser.tsx` | `CategorySection` | Internal accordion for one product category in section mode. |
| `components/ProductBrowser.tsx` | `LockerCell` | Internal dense product cell for grid mode. |
| `components/ProductBrowser.tsx` | `ProductCard` | Internal list card for one product in section mode. Uses product initial rather than product imagery. |
| `components/Reviews.tsx` | `Reviews` | Social proof section with aggregate rating, review count, quote carousel, and Google reviews link. Returns `null` if rating/count are missing. |
| `components/LocationSection.tsx` | `LocationSection` | Visit/contact section with address, hours, phone, WhatsApp/Call/Facebook CTAs, and Google Maps placeholder card. |
| `components/LocationSection.tsx` | `InfoRow` | Internal icon + label + content row for location details. |
| `components/StructuredData.tsx` | `StructuredData` | Server-rendered JSON-LD `Store` schema for the branch. |

### Variant hero components

| File | Component(s) | Role |
| --- | --- | --- |
| `components/variants/HeroNoir.tsx` | `HeroNoir` | Full-bleed editorial photo hero with overlay, large headline, CTAs, and bottom metadata cells. |
| `components/variants/HeroNoir.tsx` | `MetaCell` | Internal cell for address, hours, and wayfinding metadata. |
| `components/variants/HeroFable.tsx` | `HeroFable` | Fable full-bleed editorial masthead with ticker, CTAs, rating/open-status meta rail, and scroll cue. |
| `components/variants/HeroGolden.tsx` | `HeroGolden` | Warm market split hero with sun arc, CTAs, logo/photo card stack, hours pill, and address pill. |
| `components/variants/HeroLocker.tsx` | `HeroLocker` | Client search-first dashboard hero that dispatches `sg:search`, shows stats, actions, and hero photo. |
| `components/variants/HeroOcean.tsx` | `HeroOcean` | Resort pantry hero with glass information card, pearl glow accents, address/hours details, and wave divider. |
| `components/variants/HeroFuego.tsx` | `HeroFuego` | Client smokehouse hero with ember particle effect and heavy specs board. |

### Variant category/story components

| File | Component(s) | Role |
| --- | --- | --- |
| `components/variants/CategoriesNoir.tsx` | `CategoriesNoir` | Centered section heading plus four-column numbered photo card grid. |
| `components/variants/CategoriesFable.tsx` | `CategoriesFable` | Fable asymmetric editorial plate grid using `.fable-plate` and `data-reveal`. |
| `components/variants/CategoriesGolden.tsx` | `CategoriesGolden` | Two-column horizontal shelf cards with square photo plates and count pills. |
| `components/variants/CategoriesLocker.tsx` | `CategoriesLocker` | Dense locker compartment grid with photo backgrounds, mono numbering, and item counts. |
| `components/variants/CategoriesOcean.tsx` | `CategoriesOcean` | Glassy beach-lounge cards, horizontal snap on mobile and grid on larger screens. |
| `components/variants/CategoriesFuego.tsx` | `CategoriesFuego` | Industrial grate cards with thick borders, 16:9 photos, count tags, and sharp hover states. |
| `components/variants/FableStory.tsx` | `FableStory` | Fable editorial story with drop-cap narrative, matted photo, kraft logo stamp, stats rail, and promo banner. |
| `components/variants/NoirProvisionsStory.tsx` | `NoirProvisionsStory` | Noir-only editorial story section with two photo/text rows and six crafted-item silhouette entries. |
| `components/variants/NoirProvisionsStory.tsx` | `StoryRow` | Internal image/text row used by the noir story. |

### Icons

`components/icons.tsx` exports custom inline SVG components:

- `WhatsAppIcon`
- `PhoneIcon`
- `MapPinIcon`
- `ClockIcon`
- `FacebookIcon`
- `SearchIcon`
- `ArrowUpRight`
- `ChevronDown`
- `StarIcon`
- `SausageMark`

`SausageMark` is not currently imported anywhere outside `icons.tsx`, so it is
dead runtime code unless a future component uses it.

## 4. Public Asset Inventory

Every file currently under `public/` is listed below. Dimensions are from the
local `file` utility where possible. File sizes are bytes.

### Branch assets

| Path | Dimensions | Size | Current use |
| --- | ---: | ---: | --- |
| `public/branches/panglao-hero.jpg` | 1536x1024 JPEG | 300076 | `branch.heroImage`; used by all hero variants and `HeroPhoto`. |

### Brand assets

| Path | Dimensions | Size | Current use |
| --- | ---: | ---: | --- |
| `public/brand/README.md` | Text | 666 | Asset notes only. |
| `public/brand/logo-lockup-dark.png` | 1800x679 PNG RGBA | 253038 | Rendered by `Brand`; visible in noir and golden per current CSS. |
| `public/brand/logo-lockup-light.png` | 1800x679 PNG RGBA | 278152 | Rendered by `Brand`; visible in fable, locker, ocean, and fuego per current CSS. |
| `public/brand/logo-mark-dark.png` | 1280x555 PNG RGBA | 219089 | Used by active `FableStory` kraft stamp. |
| `public/brand/logo-mark-light.png` | 1280x555 PNG RGBA | 238326 | Not used by app runtime. |
| `public/brand/logo.jpg` | 1000x1000 JPEG | 74306 | Original owner logo; not used by app runtime. |
| `public/brand/logo.png` | 948x470 PNG RGBA | 171332 | Earlier transparent crop; not used by app runtime. |
| `public/brand/sausage-mark.svg` | 64x40 SVG | 839 | Not used by app runtime. |

### Product/category assets

All product JPEGs are 1200x900 progressive JPEGs.

| Path | Dimensions | Size | Current use |
| --- | ---: | ---: | --- |
| `public/products/README.md` | Text | 257 | Asset notes only. |
| `public/products/burgers-hot-dogs.jpg` | 1200x900 JPEG | 244395 | Featured category card slug `burgers-hot-dogs`. |
| `public/products/cheese-dairy.jpg` | 1200x900 JPEG | 207232 | Featured category card slug `cheese-dairy`. |
| `public/products/hams-deli.jpg` | 1200x900 JPEG | 239449 | Featured category card slug `hams-deli`. |
| `public/products/poultry.jpg` | 1200x900 JPEG | 217452 | Featured category card slug `poultry`. |
| `public/products/sausages.jpg` | 1200x900 JPEG | 215603 | Featured category card slug `sausages`. |
| `public/products/seafood-salmon.jpg` | 1200x900 JPEG | 230326 | Featured category card slug `seafood-salmon`. |
| `public/products/specials.jpg` | 1200x900 JPEG | 250504 | Featured category card slug `specials`. |
| `public/products/steaks-beef.jpg` | 1200x900 JPEG | 232427 | Featured category card slug `steaks-beef`; also used in noir story. |
| `public/products/todays-pick.jpg` | 1200x900 JPEG | 196968 | Used by `NoirProvisionsStory` and active `FableStory`. |

### Noir silhouette assets

All silhouettes have `viewBox="0 0 220 140"` and are used by
`NoirProvisionsStory`.

| Path | Dimensions | Size | Current use |
| --- | ---: | ---: | --- |
| `public/silhouettes/noir-beef.svg` | 220x140 SVG viewBox | 420 | Steaks and beef crafted-item silhouette. |
| `public/silhouettes/noir-cheese.svg` | 220x140 SVG viewBox | 292 | Cheese and dairy crafted-item silhouette. |
| `public/silhouettes/noir-deli.svg` | 220x140 SVG viewBox | 417 | Hams and deli crafted-item silhouette. |
| `public/silhouettes/noir-poultry.svg` | 220x140 SVG viewBox | 397 | Poultry crafted-item silhouette. |
| `public/silhouettes/noir-sausages.svg` | 220x140 SVG viewBox | 471 | Sausages crafted-item silhouette. |
| `public/silhouettes/noir-seafood.svg` | 220x140 SVG viewBox | 387 | Seafood and salmon crafted-item silhouette. |

### App icons outside public

These are not under `public/`, but Next.js uses them for app metadata:

- `app/icon.svg`: 64x64 SVG favicon, 936 bytes.
- `app/apple-icon.png`: 180x180 PNG RGBA Apple icon, 5038 bytes.

## 5. SEO Setup

### Global metadata

Defined in `app/layout.tsx`.

- `metadataBase`:
  - `process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "")`
  - Fallback: `http://localhost:3000`
- Viewport:
  - `themeColor: "#12100d"`
  - `width: "device-width"`
  - `initialScale: 1`
- Title:
  - Default: `The Sausage Guy Panglao - Sausages, Steaks, Seafood & Deli`
  - Template: `%s · The Sausage Guy`
- Description:
  - Premium sausages, steaks, salmon, hams, bacon and deli goods in Panglao,
    Bohol.
- `applicationName`: `The Sausage Guy Panglao`
- Keywords:
  - Panglao deli
  - Bohol steaks
  - frozen seafood Panglao
  - sausages Bohol
  - salmon Panglao
  - butcher Panglao
- Open Graph:
  - `type: "website"`
  - title, description, siteName, locale `en_PH`
  - image: `/branches/panglao-hero.jpg`, 1536x1024, with descriptive alt text
- Twitter:
  - `card: "summary_large_image"`
  - title and description
  - image: `/branches/panglao-hero.jpg`

### Panglao page metadata

Defined in `app/panglao/page.tsx`.

- Title and branch-specific description override global defaults.
- Canonical:
  - `alternates: { canonical: PANGLAO_PATH }`
- Open Graph URL:
  - `${SITE_URL}${PANGLAO_PATH}`
- Open Graph title and description are set.

### Structured data

`components/StructuredData.tsx` renders JSON-LD:

- `@context`: `https://schema.org`
- `@type`: `Store`
- `@id`: `${pageUrl}#store`
- `name`, `description`, `url`, `telephone`
- `image`: `${siteUrl}/brand/logo-lockup-dark.png`
- `priceRange`: `$$`
- `currenciesAccepted`: `PHP`
- Postal address:
  - Inside Dason Store, Purok 5, Bolod
  - Panglao, Bohol, 6340, PH
- `areaServed`: Panglao and Bohol
- `hasMap`: Google Maps search URL
- Opening hours:
  - Monday through Sunday
  - `08:00` to `20:00`
- `sameAs`: Facebook URL
- `department`: one `Store` object per featured category label
- `aggregateRating` if `branch.rating` and `branch.reviewCount` exist:
  - `ratingValue: 5`
  - `reviewCount: 16`
  - `bestRating: 5`

The structured data intentionally does not invent geo coordinates.

### Sitemap, robots, and social images

- `app/sitemap.ts` exists and returns a `MetadataRoute.Sitemap`.
  - It calls `getAllBranchSlugs()` from `data/branches.ts`.
  - Each entry is `${SITE_URL}/${slug}`.
  - `lastModified` is `new Date()`.
  - `changeFrequency` is `"weekly"`.
  - `priority` is `1`.
- `app/robots.ts` exists and returns a `MetadataRoute.Robots`.
  - It allows all user agents at `/`.
  - It points to `${SITE_URL}/sitemap.xml`.
- No generated `opengraph-image.*` or `twitter-image.*` route/file exists.
- Explicit Open Graph and Twitter image metadata point at the branch hero image.
- Icons are present through App Router icon files, but there is no web app
  manifest.

## 6. Data Models

### Branch

Defined in `lib/types.ts`.

Fields:

- `slug`
- `name`
- `tagline`
- `address`
- `locality`
- `phone`
- `whatsapp`
- `hours`
  - `label`
  - `open`
  - `close`
  - `display`
- `facebookUrl`
- `mapQuery`
- `heroImage?`
- `featuredCategories`
- `wayfinding?`
- `rating?`
- `reviewCount?`
- `reviewsUrl?`

Current branch data in `data/branches.ts`:

- Slug: `panglao`
- Name: `The Sausage Guy Panglao`
- Tagline: `Sausages - Steaks - Hams - Deli`
- Address: `Inside Dason Store, Purok 5, Bolod, 6340 Panglao, Bohol`
- Locality: `Panglao, Bohol`
- Phone/WhatsApp: `+63 908 955 4554`
- Hours: open daily, `08:00` to `20:00`, displayed as `8:00 AM - 8:00 PM`
- Facebook: `https://www.facebook.com/thesausageguypanglao`
- Map query: `The Sausage Guy - Meat & Deli Store, Panglao, Bohol`
- Hero image: `/branches/panglao-hero.jpg`
- Rating: `5`
- Review count: `16`
- Reviews URL: Google Maps listing URL

Branch helpers:

- `getBranch(slug)` is used by `app/panglao/page.tsx`.
- `getAllBranchSlugs()` is used by `app/sitemap.ts`.

### FeaturedCategory

Defined in `lib/types.ts`.

Fields:

- `label`
- `slug`
- `blurb`
- `match?`

`match` maps a featured card to one or more raw product categories. If omitted,
the label itself is used.

Current featured cards and computed counts:

| Card | Slug | Source category match | Count |
| --- | --- | --- | ---: |
| Sausages | `sausages` | `Sausages` | 22 |
| Steaks & Beef | `steaks-beef` | `Beef` | 9 |
| Poultry | `poultry` | `Poultry` | 7 |
| Seafood & Salmon | `seafood-salmon` | `Seafood` | 3 |
| Cheese & Dairy | `cheese-dairy` | `Bakery & Pies` | 12 |
| Hams & Deli | `hams-deli` | `Hams & Cold Cuts`, `Charcuterie`, `Bacon` | 18 |
| Burgers & Hot Dogs | `burgers-hot-dogs` | `Beef`, `Sausages`, `Bakery & Pies` | 43 |
| Specials | `specials` | `Sausages`, `Beef`, `Seafood`, `Hams & Cold Cuts` | 49 |

Important behavior: category card counts can overlap because a source category
can feed multiple featured cards. Category components now emit all matching
source categories as a comma-separated `data-target-category`; `ProductBrowser`
parses that list and filters to every matching source category.

### Product and RawProductRow

Defined in `lib/types.ts`.

`RawProductRow` is the private/source shape. It may include:

- Public-ish source fields: `category`, `productName`, `product`, `name`, `unit`,
  `featured`, `status`, `tags`, `image`
- Explicitly private fields: `buyPrice`, `sellPrice`, `margin`, `notes`

`Product` is the public-safe render shape:

- `id`
- `branchSlug`
- `category`
- `productName`
- `unit?`
- `image?`
- `tags?`
- `featured?`

`normalizeProduct()`:

- Chooses product name from `productName`, `product`, then `name`.
- Defaults missing category to `Other`.
- Drops empty rows.
- Builds id as
  `${branchSlug}-${slugify(category)}-${slugify(productName)}-${index}`.
- Copies optional `unit`, `image`, `tags`, and explicit featured status.
- Does not read cost, price, margin, or notes.

Current Panglao catalog:

- Total products: 81
- Source categories: 10

| Source category | Count |
| --- | ---: |
| Sausages | 22 |
| Beef | 9 |
| Poultry | 7 |
| Lamb | 3 |
| Hams & Cold Cuts | 15 |
| Bacon | 2 |
| Charcuterie | 1 |
| Expat Meals | 7 |
| Bakery & Pies | 12 |
| Seafood | 3 |

No current product rows set `image`, `tags`, `featured`, or `status`; all rows
are category, product name, and unit only.

### Reviews

`data/reviews.ts` defines:

```ts
export interface ReviewQuote {
  quote: string;
  author: string;
  meta?: string;
}
```

`REVIEW_QUOTES` is keyed by branch slug. Panglao currently has 8 quote cards.
Aggregate rating and count are not duplicated in review data; they are stored on
the branch.

### Image prompts

`data/image-prompts.ts` defines:

- `HOUSE_STYLE`
- `ImagePrompt`
  - `path`
  - `crops`
  - `prompt`
- `IMAGE_PROMPTS`
- `buildPrompt(key)`

This data is not imported by the app runtime. It is a planning/reference library
for generating future assets.

## 7. Styling Approach

### Tailwind v4

- `app/globals.css` starts with `@import "tailwindcss";`.
- `postcss.config.mjs` registers `@tailwindcss/postcss`.
- There is no `tailwind.config.*`.
- Tailwind v4 theme integration is done in CSS via:

```css
@theme inline {
  --font-display: var(--font-display);
  --font-body: var(--font-body);
  --color-bg: var(--bg);
  --color-surface: var(--surface);
  --color-text: var(--text);
  --color-accent: var(--accent);
}
```

### Global CSS tokens

`app/globals.css` is the design system. It consumes font variables injected by
`next/font` and defines semantic UI tokens:

- Font variables:
  - `--font-fraunces` from `app/layout.tsx`
  - `--font-hanken` from `app/layout.tsx`
  - `--font-plex-mono` from `app/layout.tsx`
  - `--font-display`
  - `--font-body`
  - `--font-mono`
- Shared primitives:
  - `--radius`
  - `--radius-lg`
  - `--ease`
  - `--maxw`
- Per-variant tokens:
  - `--bg`
  - `--bg-2`
  - `--surface`
  - `--surface-2`
  - `--text`
  - `--text-strong`
  - `--muted`
  - `--faint`
  - `--line`
  - `--line-strong`
  - `--accent`
  - `--accent-strong`
  - `--accent-2`
  - `--on-accent`
  - `--shadow`
  - `--grain-opacity`
  - `--halo`
  - `--page-gradient`

### Global helper classes

Important custom classes:

- `.atmosphere`: full-page background, gradient, halo, and grain.
- `.wrap`: responsive max-width container.
- `.section`: responsive vertical spacing.
- `.divider`: subtle horizontal rule.
- `.font-display`: display font family.
- `.eyebrow`: uppercase label style, with locker and fuego overrides.
- `.mono`: mono font helper and tabular numbers.
- `.balance`: `text-wrap: balance`.
- `.surface` and `.surface-solid`: shared panel/card surfaces.
- `.btn`, `.btn-primary`, `.btn-ghost`, `.btn-wa`: button system.
- `.chip`: product filter chips.
- `.card`, `.card-hover`: card primitives.
- `.media-placeholder`: patterned placeholder used in the map card.
- `.reveal`: load animation.
- `.no-scrollbar`: hides scrollbars for horizontal rows.
- `.wave-path`, `.ember-container`, `.ember`: ocean/fuego animation helpers.
- `.fable-paper`, `.fable-dropcap`, `.fable-ticker`, `.fable-frame`,
  `.fable-plate`, `.fable-scrollcue`: fable-specific editorial materials,
  animation, and card treatments.
- `[data-reveal]` and `.is-in`: fable scroll-reveal state classes intended to be
  driven by `RevealObserver`.
- `.vswitch-*`: variant switcher popover, options, and swatches.

### Fonts

The CSS names these families:

- Fraunces
- Hanken Grotesk
- IBM Plex Mono

`app/layout.tsx` imports them from `next/font/google`:

- `Fraunces` with `subsets: ["latin"]`, normal and italic styles, `opsz` axis,
  `variable: "--font-fraunces"`, and `display: "swap"`.
- `Hanken_Grotesk` with `subsets: ["latin"]`, `variable: "--font-hanken"`, and
  `display: "swap"`.
- `IBM_Plex_Mono` with `subsets: ["latin"]`, weights `400` and `500`,
  `variable: "--font-plex-mono"`, and `display: "swap"`.

The root `<html>` receives all three font variable classes. Runtime CSS then
maps them into `--font-display`, `--font-body`, and `--font-mono`.

### Logo color switching

`Brand` renders both lockup images:

- `/brand/logo-lockup-dark.png`
- `/brand/logo-lockup-light.png`

CSS defaults to showing the light lockup. It then switches to the dark lockup for
`[data-variant="noir"]` and `[data-variant="golden"]`.

Current effective behavior:

- Fable: light lockup
- Noir: dark lockup
- Golden: dark lockup
- Locker: light lockup
- Ocean: light lockup
- Fuego: light lockup

This differs from `public/brand/README.md`, which says noir uses the light
asset.

## 8. Weaknesses, Dead Code, And Performance Issues

### Documentation drift

- The top comment in `app/globals.css` still says there are three
  runtime-switchable variants.
- `docs/image-generation-prompts.md` references `components/CategoryGrid.tsx`,
  but that component does not exist.
- Image prompt docs reference assets such as `lamb.jpg`, `hams-cold-cuts.jpg`,
  `bacon.jpg`, and `meals-bakery.jpg`; the current public assets and branch card
  slugs use `hams-deli.jpg`, `cheese-dairy.jpg`, `burgers-hot-dogs.jpg`, and
  `specials.jpg`.
- `public/brand/README.md` describes logo theme switching incorrectly for noir.

### Variant/category behavior issues

- Cheese & Dairy maps to `Bakery & Pies`; there is no actual Cheese/Dairy source
  category in `data/products.ts`.
- Lamb and Expat Meals exist in the full product browser but have no dedicated
  featured category card.
- Variant persistence is URL-only. It is shareable and refresh-safe, but not
  remembered when navigating from `/` or across future branch links unless the
  query string is preserved manually.

### SEO gaps

- Sitemap and robots routes exist, but `sitemap.ts` uses `new Date()` for
  `lastModified`, so the timestamp changes whenever the route is generated
  rather than reflecting content updates.
- Open Graph and Twitter image metadata exists, but there are no generated
  `opengraph-image.*` or `twitter-image.*` route files.
- JSON-LD has aggregate rating but no individual `Review` objects.
- JSON-LD has departments but no product/offers schema.
- There is no web app manifest.

### Dead or currently unused code/assets

- `components/icons.tsx` exports `SausageMark`, but no component imports it.
- `Brand` supports `showBadge` and `BranchBadge`, but no caller passes
  `showBadge`.
- `lib/products.ts` exports `getFeaturedProducts()`, but no app code calls it.
- `data/image-prompts.ts` is not app runtime code; it is reference/planning data.
- Brand assets not used by runtime:
  - `public/brand/logo-mark-light.png`
  - `public/brand/logo.jpg`
  - `public/brand/logo.png`
  - `public/brand/sausage-mark.svg`
- Product `image`, `tags`, and `featured` fields are supported by the model and
  normalizer but unused in current product rows and not rendered in product
  cards.

### Performance concerns

- `Brand` still renders both dark and light logo images every time. The header
  now passes `tone` so only the visible lockup receives `priority`, but the
  hidden lockup still exists in the DOM and may eventually be fetched lazily.
- Several category components mark early category images as `priority`, even
  when they are below the hero. Noir marks the first four category images
  priority; fable, golden, locker, ocean, and fuego mark the first two.
- Each active variant renders only one hero/category set, so unused variants are
  not rendered per request. That is good, but the active variant can still
  preload too many images.
- `app/globals.css` is large for this app size at 1036 lines and mixes base
  system styles, all variant tokens, and variant-specific animation overrides in
  one file.
- Ocean wave animation and fuego ember animation do not currently check
  `prefers-reduced-motion`; only `.reveal` does.
- Fuego embers use random inline styles after mount. This avoids hydration
  mismatch because the server renders none, but it adds client-only visual work.

### Content and design risks

- Fuego copy introduces live-fire, barbecue, smokehouse, `HEATED · 225°F`, and
  wood-type language. If the store is purely a provisions shop, this may overstate
  the real offer.
- The global design comment says "No pure white anywhere", but `HeroFuego`
  includes `color: "#fff"`.
- Several high-impact variant claims, especially ocean resort delivery and fuego
  grill language, should be checked against actual business positioning before a
  premium production variant inherits them.

### Verification

Commands run during this readout:

- `npm run typecheck` -> passes.
- `npm run lint` -> passes with no ESLint warnings or errors.

`next lint` prints a deprecation warning: it will be removed in Next.js 16, and
the project should eventually migrate to the ESLint CLI.

## Notes For Building A New Premium Variant

To add a new design variant cleanly:

1. Add the variant id to `Variant`, `VARIANTS`, and `VARIANT_META` in
   `lib/types.ts`.
2. Add a `[data-variant="new-id"]` token block in `app/globals.css`.
3. Decide whether the new variant uses the dark or light brand lockup and update
   the logo switching CSS if needed.
4. Add a hero component under `components/variants/`.
5. Add a category component under `components/variants/`.
6. Wire both components and section ordering in `components/BranchPage.tsx`.
7. Decide whether `ProductBrowser` should use `sections` or `grid`, or whether a
   new browser mode is justified.
8. Make category click behavior support multi-category rollups if the new
   variant depends on rollup cards.
9. Revisit image priority. A premium variant should usually prioritize one LCP
   image and avoid priority on below-the-fold category cards.
10. Update README and prompt docs after the variant is added, because current
    docs are already behind the code.
