# Brand assets

- `logo.jpg` - original logo supplied by the owner with a white background.
- `logo.png` - earlier transparent crop kept for compatibility.
- `logo-lockup-dark.png` - generated transparent full lockup for light pages.
- `logo-lockup-light.png` - generated transparent full lockup for dark pages.
- `logo-mark-dark.png` - generated transparent sausage-only mark for light pages.
- `logo-mark-light.png` - generated transparent sausage-only mark for dark pages.

The site uses the two lockup assets through `components/Brand.tsx`. CSS in
`app/globals.css` shows the dark asset on the Golden theme and the light asset
on Noir, Locker, Ocean, and Fuego.
