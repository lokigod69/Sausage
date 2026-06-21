# Image generation prompts — The Sausage Guy

A reusable library so future photography stays visually consistent. Do **not**
generate images inside the app. Generate externally (any model), then drop files
into `/public` at the paths below.

## House style (append to every prompt)

> premium realistic food photography, dark stone background, warm side light,
> appetizing but not fake, shallow depth of field, no text baked into image,
> no logos in frame, natural color, subtle film grain

## Rules

- **No text** baked into images (the UI adds all type).
- **No logos** inside product photos.
- Consistent crops: **4:3** for category cards, **1:1** for chips/thumbnails,
  **3:2 / 16:9** for the hero.
- Keep backgrounds dark stone/slate to match every theme variant — avoid pure
  white, avoid cold blue freezer light.
- Shoot/condition food **raw and honest** (this is a provisions shop, not a
  restaurant). Appetizing, not artificially glossy.

## File map

| Key | Path | Crops |
| --- | --- | --- |
| Brand lockup, dark | `/public/brand/logo-lockup-dark.png` | transparent PNG |
| Brand lockup, light | `/public/brand/logo-lockup-light.png` | transparent PNG |
| Sausage mark, dark | `/public/brand/logo-mark-dark.png` | transparent PNG |
| Sausage mark, light | `/public/brand/logo-mark-light.png` | transparent PNG |
| Hero | `/public/branches/panglao-hero.jpg` | 3:2, 16:9 |
| Sausages | `/public/products/sausages.jpg` | 4:3, 1:1 |
| Steaks & Beef | `/public/products/steaks-beef.jpg` | 4:3, 1:1 |
| Poultry | `/public/products/poultry.jpg` | 4:3, 1:1 |
| Lamb | `/public/products/lamb.jpg` | 4:3, 1:1 |
| Hams & Cold Cuts | `/public/products/hams-cold-cuts.jpg` | 4:3, 1:1 |
| Bacon | `/public/products/bacon.jpg` | 4:3, 1:1 |
| Seafood & Salmon | `/public/products/seafood-salmon.jpg` | 4:3, 1:1 |
| Meals & Bakery | `/public/products/meals-bakery.jpg` | 4:3, 1:1 |
| Today's pick | `/public/products/todays-pick.jpg` | 1:1, 4:3 |

> These 8 category slugs match `branch.featuredCategories[].slug` in
> `data/branches.ts`. The category cards in `components/CategoryGrid.tsx` are
> where these images will be wired (currently tasteful placeholders).

The exact per-subject prompts live in [`data/image-prompts.ts`](../data/image-prompts.ts)
(`buildPrompt('steaks-beef')` returns the full string with house style appended).

## Wiring images in once generated

1. Drop the file at the path above.
2. **Brand logo:** update the asset paths in
   [`components/Brand.tsx`](../components/Brand.tsx) if the filenames change.
3. **Category cards:** the placeholder is a `.media-placeholder` block — swap it
   for a `next/image` using the matching `/public/products/{slug}.jpg`.
4. **Individual products:** set `image: "/products/{slug}.jpg"` on the row in
   [`data/products.ts`](../data/products.ts); the normalizer carries it through.
