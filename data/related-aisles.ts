/**
 * Which aisle to send someone to next, and why.
 *
 * Internal linking on a shop site is worth doing properly. The header and the
 * footer already link every category from every page, but those are a list —
 * a crawler reads them as navigation and a visitor's eye skips them. These
 * are different: three links at the end of a category page, each with a
 * reason that only makes sense from where the reader is standing. Someone who
 * has just read about bratwurst is genuinely one thought away from the buns
 * and the mustard, and saying so is more useful than a fourteenth list.
 *
 * Hand-written rather than derived. A "customers also bought" model would
 * need order data this shop does not publish, and the honest version of that
 * relationship is a shopkeeper saying "you'll want mustard with those" —
 * which is what these are.
 *
 * Rules kept while writing them: three per aisle, never reciprocal for its
 * own sake, and the `why` has to name a real product on the other page. If a
 * category is ever retired, delete it here too — a related link into an empty
 * aisle is worse than no link.
 */
export interface RelatedAisle {
  /** Must match a label in branch.featuredCategories. */
  label: string;
  /** One line, lower case, finishes the sentence "go there for…". */
  why: string;
}

export const RELATED_AISLES: Record<string, RelatedAisle[]> = {
  Sausages: [
    {
      label: "Bakery & Desserts",
      why: "Burger and hotdog buns, and the bread that goes under a bratwurst.",
    },
    {
      label: "Pantry & Preserves",
      why: "Kühne mustard and sauerkraut — the two things a German sausage asks for.",
    },
    {
      label: "Hams & Cold Cuts",
      why: "The other half of the same counter: lyoner, mortadella, salami.",
    },
  ],
  "Meat & Steaks": [
    {
      label: "Herbs & Spices",
      why: "Steak rubs and five salts, including Bohol's own Asin Tibuok.",
    },
    {
      label: "Frozen Fruit & Veg",
      why: "Green asparagus, broccoli and peas — what goes beside the steak.",
    },
    {
      label: "Pantry & Preserves",
      why: "Olive oil, balsamic and tinned tomatoes for the pan sauce.",
    },
  ],
  Poultry: [
    {
      label: "Herbs & Spices",
      why: "Rubs and whole spices for a roast chicken that is not plain.",
    },
    {
      label: "Frozen Fruit & Veg",
      why: "Vegetables that roast in the same tin as the bird.",
    },
    {
      label: "Pantry & Preserves",
      why: "Stock, mustard and cream-style corn for the gravy and the sides.",
    },
  ],
  Seafood: [
    {
      label: "Herbs & Spices",
      why: "Fish rub, peppercorns and finishing salt for a fillet.",
    },
    {
      label: "Drinks",
      why: "Chilean and Australian white wine, cold from the chiller.",
    },
    {
      label: "Frozen Fruit & Veg",
      why: "Asparagus and peas — the classic plate next to salmon.",
    },
  ],
  "Hams & Cold Cuts": [
    {
      label: "Cheese & Dairy",
      why: "Emmenthaler, Grana Padano and cheddar cut from the block.",
    },
    {
      label: "Bakery & Desserts",
      why: "Sourdough and croissants — what the ham goes into.",
    },
    {
      label: "Pantry & Preserves",
      why: "Cornichons, olives and capers for the board.",
    },
  ],
  "Cheese & Dairy": [
    {
      label: "Hams & Cold Cuts",
      why: "Sliced to order, and the rest of the charcuterie board.",
    },
    {
      label: "Drinks",
      why: "Wine by the bottle and Bohol-roasted coffee.",
    },
    {
      label: "Bakery & Desserts",
      why: "Sourdough, and the butter question answers itself.",
    },
  ],
  "Bakery & Desserts": [
    {
      label: "Cheese & Dairy",
      why: "Butter, cream cheese and the block cheese for a toastie.",
    },
    {
      label: "Hams & Cold Cuts",
      why: "What goes between two slices of the sourdough.",
    },
    {
      label: "Breakfast & Cereals",
      why: "Granola, muesli and oats for the mornings bread does not cover.",
    },
  ],
  "Ready Meals": [
    {
      label: "Bakery & Desserts",
      why: "Bread for the side, and cake in a tub for after.",
    },
    {
      label: "Frozen Fruit & Veg",
      why: "Ten minutes of vegetables to turn a tray into a dinner.",
    },
    {
      label: "Drinks",
      why: "Beer and wine, since you are not cooking tonight.",
    },
  ],
  "Breakfast & Cereals": [
    {
      label: "Cheese & Dairy",
      why: "Fresh milk, yoghurt and kefir to go over it.",
    },
    {
      label: "Frozen Fruit & Veg",
      why: "Blueberries and mixed berries — a handful straight from the bag.",
    },
    {
      label: "Snacks & Sweets",
      why: "Nuts and dried fruit for the top of the bowl.",
    },
  ],
  "Frozen Fruit & Veg": [
    {
      label: "Meat & Steaks",
      why: "The main course these are the side to.",
    },
    {
      label: "Breakfast & Cereals",
      why: "Oats and granola — where the berries end up most mornings.",
    },
    {
      label: "Bakery & Desserts",
      why: "Cake, and the berries that go into and onto it.",
    },
  ],
  "Pantry & Preserves": [
    {
      label: "Herbs & Spices",
      why: "Seventy spices in 50g sachets, next shelf along.",
    },
    {
      label: "Snacks & Sweets",
      why: "Nuts, crisps and chocolate — the shelf everyone ends up at.",
    },
    {
      label: "Bakery & Desserts",
      why: "Bread to put the jam and the peanut butter on.",
    },
  ],
  "Herbs & Spices": [
    {
      label: "Meat & Steaks",
      why: "Steaks cut to order — what the rubs were bought for.",
    },
    {
      label: "Seafood",
      why: "Salmon, tuna belly and pompano for the fish rub.",
    },
    {
      label: "Pantry & Preserves",
      why: "Oil, vinegar and mustard — the rest of the marinade.",
    },
  ],
  "Snacks & Sweets": [
    {
      label: "Drinks",
      why: "Beer, wine and kombucha to go with the crisps.",
    },
    {
      label: "Cheese & Dairy",
      why: "A wedge of cheese turns a snack into a plate.",
    },
    {
      label: "Pantry & Preserves",
      why: "Olives, peanut butter and the rest of the store cupboard.",
    },
  ],
  Drinks: [
    {
      label: "Snacks & Sweets",
      why: "Truffle crisps, nuts and biltong for the table.",
    },
    {
      label: "Cheese & Dairy",
      why: "Cut from the block, which is how a wine night starts.",
    },
    {
      label: "Hams & Cold Cuts",
      why: "Salami and pastrami, sliced as thin as you like.",
    },
  ],
};

export function getRelatedAisles(category: string): RelatedAisle[] {
  return RELATED_AISLES[category] ?? [];
}
