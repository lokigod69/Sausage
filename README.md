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

Three directions ship together for comparison. Switch via the URL (or the
dev-only floating switcher, bottom-left):

| Variant | URL | Feel |
| --- | --- | --- |
| **Noir Deli** (default) | `/panglao` or `/panglao?variant=noir` | Espresso/bone/brass boutique butcher & European deli |
| **Golden Daily** | `/panglao?variant=golden` | Warm parchment/gold/coffee, family-friendly daily market |
| **Island Provision Locker** | `/panglao?variant=locker` | Charcoal/deep-green/brass modern provision store |

The switcher UI is hidden in production; the `?variant=` URL always works.

## Architecture (branch-ready)

```
data/branches.ts      Branch registry (add Tagbilaran here)
data/products.ts      RAW rows — mirrors the Google Sheet (PRIVATE shape)
data/deal.ts          "Today's pick" block config (no invented prices)
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

`Product` (public) carries only `category`, `productName`, optional
`unit/image/tags/featured`. **Buy price, sell price, margin and internal notes
live only in `RawProductRow` and are stripped by `normalizeProduct`** — they
physically cannot reach a component. Prices are not shown (they change often);
every counter has an "Ask today's price/availability" WhatsApp CTA instead.

Featured status is honored **only** from an explicit `featured`/`status` field —
never inferred from spreadsheet row colors.

## Connecting real product data later

Replace `RAW_PRODUCTS` in `data/products.ts` with the parsed spreadsheet (Google
Sheets / POS / Airtable / Supabase). As long as rows match `RawProductRow`, the
rest of the site is unchanged. To go async, swap `loadRawRows` in
`lib/products.ts` for a fetch.

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
