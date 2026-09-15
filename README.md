# The Sausage Guy — Panglao branch microsite

A premium, mobile-first **discovery + WhatsApp-conversion** microsite for The
Sausage Guy in Panglao, Bohol. It answers, above the fold: _is this worth
driving to, where is it, are they open, and what do they carry?_ It is **not** a
checkout site.

Built with **Next.js (App Router) + TypeScript + Tailwind v4**. Minimal deps, no
animation libraries, no pure-white backgrounds.

## Run

```bash
npm install
npm run dev      # http://localhost:3000  → redirects to /panglao
```

> Behind a TLS-intercepting proxy/AV, prefix commands with
> `NODE_OPTIONS=--use-system-ca` so npm trusts the Windows certificate store.

Scripts: `npm run dev | build | start | lint | typecheck`.

## Design variants

Six directions ship together for comparison. Switch via the URL or the
floating switcher (bottom-left on desktop, above the contact bar on mobile):

| Variant | URL | Feel |
| --- | --- | --- |
| **Fable Atelier** (default) | `/panglao` or `/panglao?variant=fable` | Charcoal/butcher-paper/copper candlelit editorial atelier |
| **Noir Deli** | `/panglao?variant=noir` | Parchment/bone/butcher-red boutique butcher & European deli |
| **Golden Daily** | `/panglao?variant=golden` | Warm parchment/gold/coffee, family-friendly daily market |
| **Island Provision Locker** | `/panglao?variant=locker` | Charcoal/deep-green/brass modern provision store |
| **Ocean Pearl** | `/panglao?variant=ocean` | Seafoam/pearl/deep-teal beachside pantry |
| **Fuego Grill** | `/panglao?variant=fuego` | Volcanic black/ember-orange live-fire smokehouse |

Fonts (Fraunces, Hanken Grotesk, IBM Plex Mono) are self-hosted via
`next/font` in `app/layout.tsx`. A full architecture readout lives in
`docs/CODEBASE-READOUT.md`.

## Architecture (branch-ready)

```
data/branches.ts      Branch registry (add Tagbilaran here)
data/products.ts      RAW rows — mirrors the Google Sheet (PRIVATE shape)
data/image-prompts.ts Reusable AI photo prompts
lib/types.ts          Public Product vs private RawProductRow boundary
lib/products.ts       Normalizer/parser/search (the only public data chokepoint)
lib/contact.ts        wa.me / tel: / Google Maps link builders
components/BranchPage  Generic page used by every branch
app/panglao/page.tsx  Thin route → BranchPage + structured data
app/page.tsx          / → redirects to /panglao
```

Adding a branch later = append to `data/branches.ts`, add its products, add a
thin route that renders `<BranchPage branch={...} />`. No layout rewrite.

## Public-data safety (enforced in code)

`Product` (public) carries `category`, `productName`, optional
`unit/image/tags/featured`, and — since the POS sync — the **counter sell
price** and a **stock reading**. Those two are published deliberately.

**Buy price, cost and margin are still never published.** They are dropped in
two places: `mapItem` in `lib/loyverse.ts` never reads Loyverse's `cost` /
`purchase_cost`, and `normalizeProduct` in `lib/products.ts` never reads the
sheet's `buyPrice` / `sellPrice` / `margin` / `notes`. Neither the snapshot on
disk nor the client bundle contains them.

Featured status is honored **only** from an explicit `featured`/`status` field —
never inferred from spreadsheet row colors.

## Loyverse POS sync

The catalog is the POS. `data/loyverse-catalog.json` is a committed snapshot;
at runtime the page lays live stock and prices over it.

```bash
npm run sync:loyverse    # rewrites data/loyverse-catalog.json
```

Needs `LOYVERSE_ACCESS_TOKEN` in `.env.local` (Back Office → Settings → Access
tokens). Add `LOYVERSE_STORE_ID` only if the account has several stores — the
sync prints every store id when it cannot pick one.

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

Categories: POS category names are mapped to the site's groupings in
`data/loyverse-category-map.ts`. Each sync prints every category it saw and
flags any that match no featured card in `data/branches.ts`.

To put the live overlay in production, add `LOYVERSE_ACCESS_TOKEN` to the
Vercel project's environment variables. Without it the deploy still works — it
just serves the snapshot.

## Configuration

Copy `.env.local.example` → `.env.local`:

- `NEXT_PUBLIC_SITE_URL` — canonical/OG base (no trailing slash)
- `NEXT_PUBLIC_PANGLAO_PATH` — public path for the branch (default `/panglao`)

## Deploy (Vercel)

Repo: [`lokigod69/Sausage`](https://github.com/lokigod69/Sausage). Imported
manually into Vercel by the owner.

1. **Import** `lokigod69/Sausage` into Vercel.
2. **Framework preset:** Next.js (auto-detected).
3. **Root directory:** project root (not a monorepo).
4. **Build command:** `npm run build` · **Install command:** `npm install`.
5. **Environment variables** (Project Settings → Environment Variables):
   - `NEXT_PUBLIC_SITE_URL=https://thesausageguy.shop` (no trailing slash)
   - `NEXT_PUBLIC_PANGLAO_PATH=/panglao`
6. **Domains** (Project Settings → Domains): add both `thesausageguy.shop`
   (production) and `www.thesausageguy.shop`.
7. Live page is `/panglao`; `/` redirects to it. Google Fonts are fetched at
   build time — this works on Vercel (only a local TLS-intercepting proxy blocks
   it; see the proxy note under [Run](#run)).

## Images

See `docs/image-generation-prompts.md`. Tasteful placeholders render until real
photos are added to `/public`. Rejected AI candidates live in
`public/**/_alternates/` and are git-ignored — only the wired-in finals ship.
