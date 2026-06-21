# Brand assets

- `logo.jpg` — original logo supplied by the owner (white background).
- `logo.png` — processed transparent version actually used by the site
  (white background chroma-keyed out, margins trimmed). Generated from
  `logo.jpg` with sharp.

The site uses `logo.png` everywhere via `components/Brand.tsx`. It's recolored
per theme in `app/globals.css` (`.brand-logo`): kept as ink art on the light
Golden theme, inverted to bone on the dark Noir/Locker themes.

To regenerate `logo.png` after replacing `logo.jpg`, re-run the sharp
chroma-key snippet (see git history / ask the dev) — or drop in your own
transparent PNG named `logo.png`.
