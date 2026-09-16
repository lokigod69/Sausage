/**
 * Search titles and descriptions, written per page rather than templated.
 *
 * The job these have to do is narrow and local: someone on Panglao or in
 * Tagbilaran types "where to buy steak Bohol" or "meat shop near me" and has
 * to see a result that is obviously a real shop, obviously near them, and
 * obviously has the thing. So every title carries the category and the place,
 * and every description carries something concrete — a product name, a price,
 * the location — rather than adjectives.
 *
 * On what the shop is. It is a meat and deli store first, and that is the
 * phrase these lead with. Real counter work happens — steaks are cut to
 * order, cold cuts are sliced to order, and the ground beef, the beef and
 * lamb burgers and the köfte are made here — so "cut to order" and "we make"
 * are fair where they appear. What these must not do is sell the place as a
 * butcher's shop that makes its own charcuterie: the steaks are imported US
 * and Brazilian, and most of the rest comes from small local and homemade
 * producers. So: "meat and deli store", "steaks", "cut to order", "homemade,
 * locally made".
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
  title: "Meat & Deli Store in Panglao, Bohol",
  description:
    "Steaks cut to order, sausages, cold cuts, cheese and groceries in Bolod, Panglao. Imported and locally made, fair prices, 440+ items live from the till.",
};

export const CATEGORY_SEO: Record<string, SeoEntry> = {
  Sausages: {
    title: "German Sausages in Panglao, Bohol",
    description:
      "Bratwurst, Nürnberger, Weisswurst, cheese krainer, Landjäger, bangers and Merguez, sold by the kilo. Made by hand by small local producers. Panglao, Bohol.",
  },
  "Meat & Steaks": {
    title: "Steaks & Fresh Meat in Panglao, Bohol",
    description:
      "USDA and Brazilian grass-fed ribeye, tenderloin and chuck eye from ₱900/kg, cut to order. Bacon, lamb shanks, ostrich, and burgers we grind here. Panglao.",
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
      "Cooked hams, mortadella, lyoner, beef salami, pastrami and wood-smoked ham from German-Swiss makers, sliced to order at the deli counter in Bolod, Panglao.",
  },
  "Cheese & Dairy": {
    title: "European Cheese & Dairy in Panglao, Bohol",
    description:
      "Emmenthaler, Grana Padano, cheddar and mozzarella cut from the block, plus butter, yoghurt, kefir and fresh carabao, cow and goat milk. Panglao, Bohol.",
  },
  "Bakery & Desserts": {
    title: "Sourdough, Croissants & Cakes in Panglao",
    description:
      "Sourdough, croissants, pain au chocolat, cinnamon rolls, Cornish pasties, sausage rolls and nine flavours of cake, from local bakers. Bolod, Panglao, Bohol.",
  },
  "Ready Meals": {
    title: "Ready Meals & Pies in Panglao, Bohol",
    description:
      "Lasagna, beef stew, chili con carne and shepherd's pie in trays, plus meat pies and ready-to-bake pizza from local kitchens. Finished in your oven. Panglao.",
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
