import type { CategoryContent } from "@/data/category-content";

/*
 * Corrected 2026-10-05, on the owner's word.
 *
 * This page used to be built around "blocks cut to order" and carried a whole
 * section headed "Why we cut from the block". None of it was true. The cheese
 * arrives already packed in consumer units of roughly 150 to 250 grams; the
 * shop does not cut cheese and does not sell blocks. Cold cuts ARE sliced to
 * order — that is a different counter, and the claim belongs only there.
 *
 * Brands are named in the product name, inside the brackets, and nowhere else.
 * A cheese with no bracket is the shop's own label. Repeating "from Emborg" in
 * prose spends words the reader already has on the shelf in front of them.
 */
export const cheeseDairy: CategoryContent = {
  lede: "Emmenthaler, Grana Padano, cheddar and mozzarella in household packs, plus butter, yoghurt, kefir and raw milk.",
  metaDescription:
    "European cheese in Panglao, Bohol — Emmenthaler, Grana Padano, Gran Amici, cheddar and mozzarella — with butter, yoghurt, kefir and fresh milk.",
  intro:
    "Cheese is the hardest thing to buy well on a tropical island, because it is the thing that suffers most from a broken cold chain. Everything here comes in sealed household packs and the list below reads from the till. Below: what each one does, and how to keep it alive at home.",
  sections: [
    {
      heading: "How the cheese comes",
      paragraphs: [
        "Cheese is alive in a way that most food in a shop is not. Even a hard, aged cheese keeps changing: moisture leaves, fat migrates, and the flavour concentrates. Every cut exposes a new surface to air, and from that moment the clock runs faster.",
        "That is why the hard cheeses are portioned into household packs here, ahead of time and sealed, rather than being cut open in front of you and re-wrapped at the counter. Packs run roughly 150 to 250 grams — enough for a week of cooking, small enough to finish before it tires — and they are priced by the kilo, so the weight of the pack you pick decides what it costs.",
        "The practical upshot in this climate is that the seal stays shut until you open it at home. A cut face that has spent three weeks sweating under cling film in a chiller is the thing worth avoiding, and the way to avoid it is not to create one.",
      ],
    },
    {
      heading: "The hard and semi-hard cheeses",
      paragraphs: [
        "Emmenthaler is the Swiss cheese with the holes, and its flavour is far more interesting than its reputation suggests: nutty, slightly sweet, with a fruitiness that grows as it ages. It melts cleanly without splitting, which makes it the best cheese here for a gratin, a fondue or a croque monsieur.",
        "Grana Padano is the hard Italian grating cheese, aged and crystalline, closely related to Parmigiano Reggiano but younger, milder and considerably less expensive. Those crunchy white specks in a well-aged piece are tyrosine crystals, and they are a sign of proper ageing rather than a fault. Grate it fresh and keep the rind to drop into soup.",
        "Gran Amici is a firm, mild table cheese: the one to put on a board for people who do not want to be challenged, and the one children reliably eat.",
        "The cheddars come white and red. The colour is annatto, a natural colouring, and not a flavour difference — a white and a red cheddar of the same age taste the same. The red is the everyday one: for melting, for sandwiches, for anything where cheddar is doing the work rather than being admired.",
      ],
    },
    {
      heading: "Fresh, soft and blue",
      paragraphs: [
        "Mozzarella comes two ways here, and they are different products rather than two sizes of one. The firm mozzarella is the low-moisture kind: denser, saltier, and the right choice for pizza, because it browns and stretches rather than flooding the base with water. Mozzarella in brine, in 100g packs, is the fresh kind — milky, delicate, and meant to be eaten cold with tomato and oil, never baked.",
        "The Danish blue is the assertive one: salty, sharp, creamy. Blue cheese is best taken out of the fridge a full hour before eating, which is true of every cheese here but most obviously true of blue — cold flattens it, and warmth brings back the aroma it is bought for.",
        "Cheddar burger slices are exactly what they say: processed for melting, and unapologetic about it. A proper aged cheddar splits and goes oily on a burger. These do not, because they are designed not to, and on a burger that is the correct engineering.",
      ],
    },
    {
      heading: "Keeping cheese alive at home",
      paragraphs: [
        "Cling film is the most common thing people do wrong. Cheese needs to breathe a little, and wrapping it airtight in plastic traps moisture against the surface, which is how you get a slimy face and an ammonia smell. Once the pack is open, wrap it in baking paper or waxed paper first, then loosely in foil or a box.",
        "Store it in the warmest part of the fridge, not the coldest — the vegetable drawer is usually right, around 8 °C. Near-freezing temperatures make hard cheese crumbly and kill the flavour of soft cheese entirely.",
        "Bring cheese to room temperature before eating, and in this climate that takes twenty minutes rather than an hour. Cold cheese tastes of very little; the fats need to soften for the aroma to release. The one exception is anything you are about to grate, which is easier straight from the fridge.",
        "Hard cheeses can be frozen if you are going to cook with them, and should not be if you plan to eat them as they are — freezing breaks the texture into crumbs. Mould on a hard cheese can be cut away with a centimetre of margin and the rest eaten; mould on a soft or fresh cheese means the whole piece goes.",
      ],
    },
    {
      heading: "The dairy shelf",
      paragraphs: [
        "Raw milk comes from cow, carabao and goat, frozen by the litre. Carabao milk is the richest of the three — noticeably higher in fat and solids than cow's milk, which is why it makes such good cheese and such thick yoghurt. Goat's milk is tangier and easier on people who struggle with cow's milk. It is unpasteurised, so defrost it in the chiller and use it within two to three days.",
        "Yoghurt comes as Greek and homemade, in 500g tubs, alongside kefir. Kefir is the fermented one with the wider culture range and the thinner, drinkable texture — slightly fizzy, slightly sour, and an acquired taste that tends to stick once acquired.",
        "The unsalted butter in 200g packs is the baking butter: no salt, so you control the seasoning, and with the fat content that European recipes assume.",
        "Everything on the dairy shelf is dated and rotated, but it is also the fastest-moving part of the shop. The list on this page reads from the till, so what it shows is what is in the chiller now. For raw milk in particular, a message before you set off saves a wasted trip.",
      ],
    },
    {
      heading: "Buying for a board or for a week",
      paragraphs: [
        "For a cheese board, count 80 to 100 grams per person across three to five cheeses, and aim for contrast rather than quantity: something hard and aged, something soft, something blue, and one mild one for the people who are suspicious of the other three.",
        "For a household week, one pack of a cutting cheese and one of something for melting covers most cooking. Grana Padano is the exception — a small pack lasts a surprisingly long time, because you use it in grams rather than slices.",
        "A cheese listed here without a brand is one we portion ourselves, and it is priced by the kilo. We leave the brand off those on purpose: the supplier behind them can change between visits, and naming this week's would turn a sensible substitution into a broken promise. The sealed packs — the blue, the mozzarella in brine, the grated parmesan, the butter — keep their brand, because there the brand is part of what you are buying.",
      ],
    },
  ],
};
