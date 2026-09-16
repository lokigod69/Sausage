import { sausages } from "@/data/content/sausages";
import { meatSteaks } from "@/data/content/meat-steaks";
import { poultry } from "@/data/content/poultry";
import { seafood } from "@/data/content/seafood";
import { hamsColdCuts } from "@/data/content/hams-cold-cuts";
import { cheeseDairy } from "@/data/content/cheese-dairy";
import { bakeryDesserts } from "@/data/content/bakery-desserts";
import { readyMeals } from "@/data/content/ready-meals";
import { breakfastCereals } from "@/data/content/breakfast-cereals";
import { frozenFruitVeg } from "@/data/content/frozen-fruit-veg";
import { pantryPreserves } from "@/data/content/pantry-preserves";
import { herbsSpices } from "@/data/content/herbs-spices";
import { snacksSweets } from "@/data/content/snacks-sweets";
import { drinks } from "@/data/content/drinks";

/**
 * Editorial content for the category landing pages.
 *
 * Each category gets three pieces:
 *   - `lede`    — the line inside the title image. One sentence, what is on
 *                 this shelf and why someone would come for it.
 *   - `intro`   — a short paragraph under the products, easing into the long
 *                 read without repeating the lede.
 *   - `sections`— the long-form piece. Written for someone deciding what to
 *                 cook, not for a search engine: the ranking follows from
 *                 answering real questions (how much per person, how to cook
 *                 it, what it tastes like) rather than from keyword density.
 *
 * SEO notes that actually matter here, and are handled in the page component
 * rather than by stuffing these strings: a unique <title> and description per
 * category, an H1 that matches the page's subject, real headings in document
 * order, breadcrumb structured data, and an ItemList of the products with
 * their prices and availability.
 */

export interface ContentSection {
  heading: string;
  /** Paragraphs. Rendered in order; no markup inside. */
  paragraphs: string[];
}

export interface CategoryContent {
  lede: string;
  /** Overrides the generic meta description when set. */
  metaDescription?: string;
  intro: string;
  sections: ContentSection[];
}

/** Keyed by the exact category label used across the site and the POS. */
export const CATEGORY_CONTENT: Record<string, CategoryContent> = {
  Sausages: sausages,
  "Meat & Steaks": meatSteaks,
  Poultry: poultry,
  Seafood: seafood,
  "Hams & Cold Cuts": hamsColdCuts,
  "Cheese & Dairy": cheeseDairy,
  "Bakery & Desserts": bakeryDesserts,
  "Ready Meals": readyMeals,
  "Breakfast & Cereals": breakfastCereals,
  "Frozen Fruit & Veg": frozenFruitVeg,
  "Pantry & Preserves": pantryPreserves,
  "Herbs & Spices": herbsSpices,
  "Snacks & Sweets": snacksSweets,
  Drinks: drinks,
};

export function getCategoryContent(category: string): CategoryContent | undefined {
  return CATEGORY_CONTENT[category];
}
