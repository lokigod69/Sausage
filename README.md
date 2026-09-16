# The Sausage Guy — Panglao

A mobile-first **discovery and message-to-order** site for The Sausage Guy, a
meat and deli store in Panglao, Bohol. It answers, above the fold: _is this
worth the trip, where is it, are they open, and what do they carry?_ It is
**not** a checkout site — the conversation happens on Messenger, and delivery
goes out by Maxim.

Built with **Next.js (App Router) + TypeScript + Tailwind v4**. Minimal deps,
no animation libraries.

## Run

```bash
npm install
npm run dev      # http://localhost:3000  → redirects to /panglao
```

> Behind a TLS-intercepting proxy/AV, prefix commands with
> `NODE_OPTIONS=--use-system-ca` so npm trusts the Windows certificate store.

Scripts: `npm run dev | build | start | lint | typecheck | sync:loyverse |
sync:reviews | migrate:categories | gen:images`.

## What the shop actually is

This matters for every line of copy on the site, so it is written down here
rather than left to be inferred.

It is a **meat and deli store**, not a butcher's shop. Real counter work does
happen — steaks are cut to order, cold cuts are sliced to order, and the
ground beef, the beef and lamb burgers and the köfte are made in the shop. But
the steaks are imported (USDA Choice, Brazilian grass-fed), the sausages and
charcuterie come from small local and homemade producers, and most of the
shelf is bought in.

So the words the copy leans on are **meat and deli store**, **steaks**, **cut
to order** and **homemade, locally made** — and what it must never claim is
curing, smoking or sausage-making the shop does not do. If you are editing
copy, that is the line.

## Pages

| Route | What it is |
| --- | --- |
| `/` | Redirects to `/panglao` |
| `/panglao` | The branch page: hero, search, categories, full product list, delivery, reviews, location |
| `/panglao/<category>` | One landing page per category — title image, the products, a 1,000–1,500 word article |
| `/llms.txt`, `/llms-full.txt` | Machine-readable summary and full text, regenerated hourly |
| `/sitemap.xml`, `/robots.txt` | Generated; AI crawlers explicitly allowed |

The branch slug stays in every path so further branches can sit beside Panglao
later without a single URL moving. Adding one = append to `data/branches.ts`
plus a thin route; no layout rewrite.

## Categories

Fourteen, listed in `data/branches.ts` in shopping order. The same fourteen
exist in Loyverse — `scripts/migrate-loyverse-categories.mts` put them there —
so the POS and the site agree. `data/loyverse-category-map.ts` maps POS
category names onto them, and `data/pos-overrides.ts` holds the handful of
deliberate exceptions.

A category page is complete when it has three things: a title image, SERP copy
(`data/seo.ts`) and an article (`data/content/*.ts`). All fourteen have all
three. `data/image-prompts.ts` keeps the brief and the `have` flag for each
picture, so adding a fifteenth category shows up as a gap rather than as a
broken image.

## Architecture

```
data/branches.ts            Branch registry + the fourteen categories
data/loyverse-catalog.json  Committed POS snapshot (the floor)
data/pos-overrides.ts       Per-kilo prices, display names, category fixes
data/seo.ts                 Hand-written SERP title + description per page
data/content/*.ts           The long-form article for each category
data/promos.ts              Hero banner slides
lib/loyverse.ts             POS API client (never reads cost/margin)
lib/catalog.ts              Snapshot + live overlay, never throws
lib/products.ts             Normalizer/parser/search — the public chokepoint
lib/contact.ts              Messenger / WhatsApp / tel: / Maps link builders
lib/routes.ts               Category slugs and paths
components/BranchPage.tsx   The branch page
app/panglao/[category]/     The category landing pages
middleware.ts               noindex for ops./staging./preview. hosts
```

## Contact channels

Five, in this order wherever they appear: **Messenger**, WhatsApp, phone,
Facebook page, Google Maps. Messenger leads because in the Philippines that is
how people open a conversation with a business. `lib/contact.ts` builds the
`m.me` link from the Facebook URL, so there is one place to change it.

## Delivery

By Maxim, to Panglao, Dauis, Tagbilaran, Baclayon, Alburquerque and Cortes.
The towns live in `components/DeliverySection.tsx` and are repeated as
`areaServed` in `components/StructuredData.tsx` and in `/llms.txt` — change
them in all three. No delivery fee is published anywhere on purpose: the fare
is Maxim's, it moves with distance and time of day, and a number on the page
would be wrong within a week.

## Internal linking

Header and footer link all fourteen aisles from every page. On top of that,
`data/related-aisles.ts` gives each category three hand-picked neighbours with
a reason that only makes sense from that page ("Kühne mustard and sauerkraut —
the two things a German sausage asks for"), rendered by `RelatedAisles` at the
foot of every category page. That is the link graph a small site needs; a
fourteenth copy of the same list is not.

## Public-data safety (enforced in code)

`Product` (public) carries `category`, `productName`, optional
`unit/image/tags/featured`, and — since the POS sync — the **counter sell
price** and a **stock reading**. Those two are published deliberately.

**Buy price, cost and margin are never published.** They are dropped in two
places: `mapItem` in `lib/loyverse.ts` never reads Loyverse's `cost` /
`purchase_cost`, and `normalizeProduct` in `lib/products.ts` never reads the
sheet's `buyPrice` / `sellPrice` / `margin` / `notes`. Neither the snapshot on
disk nor the client bundle contains them.

Featured status is honored **only** from an explicit `featured`/`status` field
— never inferred from spreadsheet row colors.

## Loyverse POS sync

The catalog is the POS. `data/loyverse-catalog.json` is a committed snapshot;
at runtime the page lays live stock and prices over it.

```bash
npm run sync:loyverse    # rewrites data/loyverse-catalog.json
```

Needs `LOYVERSE_ACCESS_TOKEN` in `.env.local` (Back Office → Settings → Access
tokens). Add `LOYVERSE_STORE_ID` only if the account has several stores — the
sync prints every store id when it cannot pick one. The same run downloads any
new product photos into `public/products/loyverse/`.

How the two layers combine, in `lib/catalog.ts`:

| Situation | What the visitor sees |
| --- | --- |
| Token set, API healthy | Live prices + stock, re-read every 10 min (ISR) |
| Token set, API down or rejected | Last committed snapshot; error logged server-side |
| No token (e.g. a preview build) | Last committed snapshot |
| No snapshot either | Curated list from `data/products.ts`, no prices |

Stock never silently lies: when an item drops out of the POS the overlay clears
its stock reading rather than keeping the snapshot's older claim, and items the
POS does not count show no badge at all.

Each sync prints every POS category it saw and flags any that match no featured
card in `data/branches.ts`, plus unpriced items and negative stock.

To put the live overlay in production, add `LOYVERSE_ACCESS_TOKEN` to the
Vercel project's environment variables. Without it the deploy still works — it
just serves the snapshot.

## SEO and AI discovery

- Titles and descriptions are hand-written per page in `data/seo.ts`. They lead
  with what someone would actually type — "German sausages in Panglao" — not
  with the shop's name.
- Structured data: `LocalBusiness` on the branch page, `BreadcrumbList` and an
  `ItemList` of products with prices and availability on each category page.
- `/llms.txt` and `/llms-full.txt` regenerate from the live catalogue every
  hour, so an assistant answering "where can I buy German sausage on Bohol"
  has current prices. Stock levels are deliberately left out: they change by
  the hour, and a cached number would send someone across the island for
  nothing.
- `middleware.ts` puts `X-Robots-Tag: noindex` on any `ops.` / `staging.` /
  `preview.` host, so internal subdomains stay out of search results.

## Configuration

Copy `.env.local.example` → `.env.local`:

- `NEXT_PUBLIC_SITE_URL` — canonical/OG base (no trailing slash). Optional:
  `lib/site.ts` defaults to the production domain in a production build and to
  localhost in development, so Vercel needs nothing. Set it only to aim a
  build at another host
- `NEXT_PUBLIC_PANGLAO_PATH` — public path for the branch (default `/panglao`)
- `LOYVERSE_ACCESS_TOKEN` — POS token, server-side only
- `LOYVERSE_STORE_ID` — only if the account has several stores
- `OPENAI_API_KEY` — only for `npm run gen:images`; never needed at runtime

## Deploy (Vercel)

Repo: [`lokigod69/Sausage`](https://github.com/lokigod69/Sausage). Pushing to
`main` deploys.

1. **Framework preset:** Next.js (auto-detected). **Root directory:** project
   root. **Build:** `npm run build` · **Install:** `npm install`.
2. **Environment variables:** the four above. `LOYVERSE_ACCESS_TOKEN` must be
   set on Production for live prices.
3. **Domains:** `thesausageguy.shop` and `www.thesausageguy.shop`.
4. Live page is `/panglao`; `/` redirects to it.

## Images

```bash
npm run gen:images              # every category still marked have:false
npm run gen:images -- drinks    # one slug
```

Generates the missing category title images with OpenAI's image API and writes
them to `/public/products/<slug>.jpg` at 1200x900, then flips `have` in
`data/image-prompts.ts` and adds the slug to `CATEGORY_PHOTO_SLUGS` in
`data/category-images.ts`. Needs `OPENAI_API_KEY` in `.env.local`; it prints
the cost estimate before spending anything and will not overwrite an existing
file without `--force`. **Look at what comes back before committing** — an
image that is wrong about the products is worse than the tinted panel it
replaces.

The prompts and the checklist of what is still missing live in
`data/image-prompts.ts`; `docs/image-generation-prompts.md` has the long form
and the crop specs. Product photos come from Loyverse via the sync. Rejected AI
candidates live in `public/**/_alternates/` and are git-ignored — only the
wired-in finals ship.

The favicon (`app/icon.png`, `app/apple-icon.png`) is the real logo mark on
the brand's dark ground, generated from `public/brand/logo-mark-light.png`.

A full architecture readout lives in `docs/CODEBASE-READOUT.md`.
