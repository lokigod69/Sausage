import type { RawProductRow } from "@/lib/types";

/**
 * PUBLIC product catalog for Panglao — reconstructed from the owner's
 * "Sausage Guy Pricelist" Google Sheet.
 *
 * Deliberately PUBLIC-SAFE by omission: this file contains ONLY
 * Category + Product Name + Unit. Buy Price, Sell Price, Margin and internal
 * Notes from the sheet are intentionally NOT stored in the repo at all — they
 * live only in the owner's private Google Sheet. (The normalizer in
 * lib/products.ts would strip them anyway; keeping them out entirely removes
 * any chance of a leak.)
 *
 * Volume-tier rows from the sheet (e.g. per kg / 5kg+ / 10kg+, or 250g/500g/1kg
 * packs) are COLLAPSED to a single public entry, since pricing — the only thing
 * that differed between those rows — is never shown. Message the store for
 * volume pricing.
 *
 * To refresh: re-export the sheet, keep only Category / Product Name / Unit,
 * dedupe volume tiers, and replace the arrays below.
 */
export const RAW_PRODUCTS: Record<string, RawProductRow[]> = {
  panglao: [
    // ---- Sausages -------------------------------------------------------
    { category: "Sausages", productName: "Thüringerian Bratwurst", unit: "per kg" },
    { category: "Sausages", productName: "Bratwurst (Standard)", unit: "per kg" },
    { category: "Sausages", productName: "Veal Beef Bratwurst", unit: "per kg" },
    { category: "Sausages", productName: "Nuernberger Sausage", unit: "per kg" },
    { category: "Sausages", productName: "Merguez Sausage", unit: "per kg" },
    { category: "Sausages", productName: "Hungarian Spicy", unit: "per kg" },
    { category: "Sausages", productName: "Hungarian Cheesy", unit: "per kg" },
    { category: "Sausages", productName: "White Sausage", unit: "per kg" },
    { category: "Sausages", productName: "English Bangers", unit: "per kg" },
    { category: "Sausages", productName: "Italian with Fennel", unit: "per kg" },
    { category: "Sausages", productName: "Italian Garlic", unit: "per kg" },
    { category: "Sausages", productName: "Cheese Krainer", unit: "per kg" },
    { category: "Sausages", productName: "Kielbasa", unit: "per kg" },
    { category: "Sausages", productName: "Frankfurter", unit: "per kg" },
    { category: "Sausages", productName: "Chicken Chipolata", unit: "per kg" },
    { category: "Sausages", productName: "Wienerli", unit: "per kg" },
    { category: "Sausages", productName: "Beer Sticks", unit: "per kg" },
    { category: "Sausages", productName: "Landjaeger", unit: "per kg" },
    { category: "Sausages", productName: "Buure Schüblig", unit: "per kg" },
    { category: "Sausages", productName: "Beef Hot Dog", unit: "per kg" },
    { category: "Sausages", productName: "Cheese Hot Dog", unit: "per kg" },
    { category: "Sausages", productName: "Special Hot Dog", unit: "per kg" },

    // ---- Beef (volume tiers collapsed) ----------------------------------
    { category: "Beef", productName: "Ground Beef Mince", unit: "250g–1kg packs" },
    { category: "Beef", productName: "Brazilian Chuck Eye", unit: "per kg" },
    { category: "Beef", productName: "Brazilian Ribeye", unit: "per kg" },
    { category: "Beef", productName: "Brazilian Beef Tenderloin", unit: "per kg" },
    {
      category: "Beef",
      productName: "US Angus Beef Choice Ribeye (St. Helens)",
      unit: "per kg",
    },
    {
      category: "Beef",
      productName: "US Black Angus Beef Ribeye (Nebraska Star)",
      unit: "per kg",
    },
    { category: "Beef", productName: "Australian Veal Beef Liver", unit: "per kg" },
    {
      category: "Beef",
      productName: "Beef Burger Patties (US, Mexican, Rosemary)",
      unit: "2-pack",
    },
    { category: "Beef", productName: "Brazilian Sukiyaki Cut", unit: "1kg pack" },

    // ---- Poultry --------------------------------------------------------
    { category: "Poultry", productName: "Whole Brazilian Chicken", unit: "1.1kg pack" },
    { category: "Poultry", productName: "Brazilian Chicken Breast", unit: "per kg" },
    { category: "Poultry", productName: "Brazilian Chicken Wings", unit: "per kg" },
    { category: "Poultry", productName: "Chicken Leg", unit: "2kg pack" },
    { category: "Poultry", productName: "Whole Turkey", unit: "per kg" },
    { category: "Poultry", productName: "Duck Breast", unit: "per kg" },
    { category: "Poultry", productName: "Whole Peking Duck", unit: "2.5kg pack" },

    // ---- Lamb -----------------------------------------------------------
    { category: "Lamb", productName: "Australian Lamb Rack (Whole)", unit: "per kg" },
    {
      category: "Lamb",
      productName: "Australian Lamb Rack (Single Cut)",
      unit: "per kg",
    },
    { category: "Lamb", productName: "Lamb Burger", unit: "2-pack" },

    // ---- Hams & Cold Cuts ----------------------------------------------
    { category: "Hams & Cold Cuts", productName: "Meat Loaf (Sliced)", unit: "per kg" },
    { category: "Hams & Cold Cuts", productName: "Lyoner", unit: "per kg" },
    { category: "Hams & Cold Cuts", productName: "Pepperoni Lyoner", unit: "per kg" },
    { category: "Hams & Cold Cuts", productName: "Mortadella", unit: "per kg" },
    {
      category: "Hams & Cold Cuts",
      productName: "Assorted Cold Cuts",
      unit: "200g pack",
    },
    { category: "Hams & Cold Cuts", productName: "Beef Salami", unit: "per kg" },
    { category: "Hams & Cold Cuts", productName: "Florentiner", unit: "per kg" },
    { category: "Hams & Cold Cuts", productName: "Cooked Ham", unit: "per kg" },
    { category: "Hams & Cold Cuts", productName: "Honey Ham", unit: "200g pack" },
    { category: "Hams & Cold Cuts", productName: "Forest Ham", unit: "200g pack" },
    { category: "Hams & Cold Cuts", productName: "Farmer's Ham", unit: "200g pack" },
    { category: "Hams & Cold Cuts", productName: "Chicken Ham", unit: "per kg" },
    { category: "Hams & Cold Cuts", productName: "Turkey Ham", unit: "per kg" },
    { category: "Hams & Cold Cuts", productName: "Beef Pastrami", unit: "per kg" },
    { category: "Hams & Cold Cuts", productName: "Smoked Cooked Ham", unit: "per kg" },

    // ---- Bacon (volume tiers collapsed) --------------------------------
    { category: "Bacon", productName: "Wood Smoked Bacon", unit: "100g–3kg packs" },
    { category: "Bacon", productName: "Picnic Bacon", unit: "per kg" },

    // ---- Charcuterie ----------------------------------------------------
    { category: "Charcuterie", productName: "Liver Pâté", unit: "per pack" },

    // ---- Expat Meals (ready meals) -------------------------------------
    { category: "Expat Meals", productName: "Pizza (All Flavors)", unit: "each" },
    { category: "Expat Meals", productName: "Lasagna (Beef / Pork)", unit: "tray" },
    { category: "Expat Meals", productName: "Beef Stew", unit: "tray" },
    { category: "Expat Meals", productName: "Chili con Carne", unit: "tray" },
    { category: "Expat Meals", productName: "Beef & Broccoli", unit: "tray" },
    { category: "Expat Meals", productName: "Shepherd's Pie", unit: "tray" },
    { category: "Expat Meals", productName: "Sweet & Sour Chicken", unit: "tray" },

    // ---- Bakery & Pies --------------------------------------------------
    { category: "Bakery & Pies", productName: "Cornish Pasty", unit: "each" },
    {
      category: "Bakery & Pies",
      productName: "Meat Pie (Breakfast, Beef Curry, Beef Onion, Pulled Pork, Jalapeño)",
      unit: "each",
    },
    { category: "Bakery & Pies", productName: "Fruit Pie (Mango / Apple)", unit: "each" },
    { category: "Bakery & Pies", productName: "Sausage Rolls", unit: "each" },
    { category: "Bakery & Pies", productName: "Cheese Krainer Rolls", unit: "each" },
    {
      category: "Bakery & Pies",
      productName: "Baked Puff (Spinach & Cream Cheese, Smoked Ham & Cheese)",
      unit: "2-pack",
    },
    { category: "Bakery & Pies", productName: "Croissant", unit: "2-pack" },
    { category: "Bakery & Pies", productName: "Pain au Chocolat", unit: "2-pack" },
    { category: "Bakery & Pies", productName: "Cinnamon Rolls", unit: "2-pack" },
    { category: "Bakery & Pies", productName: "Sourdough Bread", unit: "2-pack" },
    { category: "Bakery & Pies", productName: "Burger Buns", unit: "2-pack" },
    { category: "Bakery & Pies", productName: "Hotdog Buns", unit: "2-pack" },

    // ---- Seafood --------------------------------------------------------
    { category: "Seafood", productName: "Smoked Salmon", unit: "per kg" },
    { category: "Seafood", productName: "Frozen Salmon (Pacific)", unit: "per kg" },
    {
      category: "Seafood",
      productName: "Frozen Salmon (Pacific, Whole)",
      unit: "per kg",
    },
  ],
};
