/**
 * Search titles and descriptions, written per page rather than templated.
 *
 * The job these have to do is narrow and local: someone on Panglao or in
 * Tagbilaran types "where to buy steak Bohol" or "German sausage Panglao" and
 * has to see a result that is obviously a real shop, obviously near them, and
 * obviously has the thing. So every title carries the category and the place,
 * and every description carries something concrete — a product name, a price,
 * the location — rather than adjectives.
 *
 * Length discipline: Google renders roughly 580px of title, which is about
 * 55-60 characters, and around 155 characters of description. Past that it
 * truncates mid-word. These are written to fit, with the important half
 * first in case they are cut anyway.
 */

export interface SeoEntry {
  /** Without the site-name suffix — that is appended by the layout template. */
  title: string;
  description: string;
}

export const HOME_SEO: SeoEntry = {
  title: "Butcher & Deli in Panglao, Bohol",
  description:
    "German sausages, USDA and Brazilian steaks, salmon, European cheese and deli goods in Bolod, Panglao. 440+ products with live prices and stock. Open daily 8am–8pm.",
};

export const CATEGORY_SEO: Record<string, SeoEntry> = {
  Sausages: {
    title: "German Sausages in Panglao, Bohol",
    description:
      "Bratwurst, Nürnberger, Weisswurst, cheese krainer, Landjäger, bangers and Merguez — hand-made in Panglao and sold by the kilo. Live stock from the counter.",
  },
  "Meat & Steaks": {
    title: "Steaks & Fresh Meat in Panglao, Bohol",
    description:
      "USDA and Brazilian ribeye, tenderloin and chuck eye from ₱900/kg, house-smoked bacon, lamb shanks and ostrich. Cut to order in Bolod, Panglao.",
  },
  Poultry: {
    title: "Chicken, Duck & Turkey in Panglao, Bohol",
    description:
      "Whole Brazilian chicken, breast and wings by the kilo, duck breast, whole Peking duck and turkey — properly frozen, never thawed and refrozen. Panglao, Bohol.",
  },
  Seafood: {
    title: "Salmon, Tuna & Seafood in Panglao, Bohol",
    description:
      "Salmon fillet, tuna belly, pompano, squid rings, Chilean mussels and half-shell scallops. The frozen seafood Bohol's markets do not carry. Bolod, Panglao.",
  },
  "Hams & Cold Cuts": {
    title: "Ham, Salami & Cold Cuts in Panglao, Bohol",
    description:
      "Cooked hams, mortadella, lyoner, beef salami, pastrami and wood-smoked ham, sliced to order at a German-Swiss deli counter in Bolod, Panglao.",
  },
  "Cheese & Dairy": {
    title: "European Cheese & Dairy in Panglao, Bohol",
    description:
      "Emmenthaler, Grana Padano, cheddar and mozzarella cut from the block, plus butter, yoghurt, kefir and fresh carabao, cow and goat milk. Panglao, Bohol.",
  },
  "Bakery & Desserts": {
    title: "Sourdough, Croissants & Cakes in Panglao",
    description:
      "Sourdough bread, croissants, pain au chocolat, cinnamon rolls, Cornish pasties, sausage rolls and nine flavours of cake in a tub. Bolod, Panglao, Bohol.",
  },
  "Ready Meals": {
    title: "Ready Meals & Pies in Panglao, Bohol",
    description:
      "Lasagna, beef stew, chili con carne and shepherd's pie in trays, plus meat pies and ready-to-bake pizza. Made here, finished in your oven. Panglao, Bohol.",
  },
  "Breakfast & Cereals": {
    title: "Granola, Muesli & Oats in Panglao, Bohol",
    description:
      "Imported and Filipino granola, muesli, rolled and protein oats and grain-free coconut cereal — Fit & Flex, Yava, Emco and Naturalmind. Bolod, Panglao.",
  },
  "Frozen Fruit & Veg": {
    title: "Frozen Berries & Vegetables in Panglao",
    description:
      "Blueberries, raspberries, strawberries, broccoli, cauliflower, asparagus, peas and mushrooms in 1kg packs — the produce Bohol does not grow. Panglao.",
  },
  "Pantry & Preserves": {
    title: "European Pantry Goods in Panglao, Bohol",
    description:
      "Olives, capers, Italian tomatoes, Kühne mustards and sauerkraut, balsamic vinegar, sriracha and peanut butter. 50+ store-cupboard lines in Panglao, Bohol.",
  },
  "Herbs & Spices": {
    title: "Spices, Rubs & Salt in Panglao, Bohol",
    description:
      "Seventy spices in 50g sachets, steak and fish rubs, and five salts including Asin Tibuok — Bohol's own smoked dinosaur-egg salt. Bolod, Panglao.",
  },
  "Snacks & Sweets": {
    title: "Nuts, Chips & Chocolate in Panglao, Bohol",
    description:
      "Nuts, dried fruit, truffle crisps, quinoa chips, Milka chocolate and South African beef biltong — imported and local snacks in Bolod, Panglao.",
  },
  Drinks: {
    title: "Wine, Beer & Bohol Coffee in Panglao",
    description:
      "Chilean and Australian wine, imported and Island Brewers beer, Naturalmind coffee roasted on Bohol, kombucha, cold-pressed juice and raw milk. Panglao.",
  },
};

export function getCategorySeo(category: string): SeoEntry | undefined {
  return CATEGORY_SEO[category];
}
