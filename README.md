# The Sausage Guy — Panglao

A mobile-first **discovery and message-to-order** site for The Sausage Guy, a
butcher, delicatessen and provisions shop in Panglao, Bohol. It answers, above
the fold: _is this worth driving to, where is it, are they open, and what do
they carry?_ It is **not** a checkout site — the conversation happens on
Messenger.

Built with **Next.js (App Router) + TypeScript + Tailwind v4**. Minimal deps,
no animation libraries.

## Run

```bash
npm install
npm run dev      # http://localhost:3000  → redirects to /panglao
```

> Behind a TLS-intercepting proxy/AV, prefix commands with
> `NODE_OPTIONS=--use-system-ca` so npm trusts the Windows certificate store.

Scripts: `npm run dev | build | start | lint | typecheck | sync:loyverse`.

## Pages

| Route | What it is |
| --- | --- |
| `/` | Redirects to `/panglao` |
| `/panglao` | The branch page: hero, search, categories, full product list, reviews, location |
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

A category page is complete when it has three things: a title image
(`data/image-prompts.ts` carries the brief and marks which are missing — eight
still are), SERP copy (`data/seo.ts`) and an article (`data/content/*.ts`).
Copy and articles are done for all fourteen.

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

- `NEXT_PUBLIC_SITE_URL` — canonical/OG base (no trailing slash)
- `NEXT_PUBLIC_PANGLAO_PATH` — public path for the branch (default `/panglao`)
- `LOYVERSE_ACCESS_TOKEN` — POS token, server-side only
- `LOYVERSE_STORE_ID` — only if the account has several stores

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

Category title images: `data/image-prompts.ts` is the brief and the checklist
of what is still missing; `docs/image-generation-prompts.md` has the long form
and the crop specs. Product photos come from Loyverse via the sync. Rejected AI
candidates live in `public/**/_alternates/` and are git-ignored — only the
wired-in finals ship.

A full architecture readout lives in `docs/CODEBASE-READOUT.md`.
