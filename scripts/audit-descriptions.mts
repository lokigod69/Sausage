/**
 * Read every product description the site will show and complain about it.
 *
 *   node scripts/audit-descriptions.mts
 *
 * Reads the built catalogue and applies the same overrides the pages do, so
 * what it checks is what a visitor reads — not what sits in Loyverse.
 *
 * Nothing here is a style opinion. Each check is something that has actually
 * gone wrong on this site at least once: a claim about meat that was not true,
 * a brand repeated from the name, a note that outgrew its dialog, a sentence
 * pointing at a product that has since been deleted from the till.
 */
import { readFileSync } from "node:fs";
import { getProductDescription } from "../data/pos-overrides.ts";

type Row = {
  productName: string;
  category: string;
  description?: string;
};

const snapshot = JSON.parse(
  readFileSync("data/loyverse-catalog.json", "utf8"),
) as { branches: Record<string, { products: Row[] }> };

const rows = Object.values(snapshot.branches).flatMap((b) => b.products);

/* What the visitor actually reads: our override wins, Loyverse second. */
const read = (r: Row) =>
  (getProductDescription(r.productName) ?? r.description ?? "").trim();

const EXCLUDED = new Set(
  [
    "Delivery Fee",
    "No Item (Put Price Individually)",
    "Forest Ham (Not 200g)",
    "Honey ham(not 200g pack)",
  ].map((s) => s.toLowerCase()),
);

const live = rows.filter((r) => !EXCLUDED.has(r.productName.toLowerCase()));

/** Bracketed text that names the goods rather than a maker. */
const NOT_BRANDS = new Set([
  "whole",
  "sliced",
  "frozen mixed",
  "beef cold cut",
  "lumpia wrapper",
  "classic",
  "original",
  "sausage guy",
  "the sausage guy",
]);

/** Brand first-words that are ordinary English and will match innocent prose. */
const COMMON_WORDS = new Set([
  "sweet",
  "coco",
  "nature",
  "member",
  "members",
  "smart",
  "island",
  "green",
  "golden",
  "royal",
  "fresh",
  "natural",
  "super",
  "gourmet",
]);

/**
 * Deliberate exceptions, each with the reason it is allowed to stand.
 *
 * An audit that always prints the same three things is an audit people stop
 * reading, and the next person to see "no pork" flagged would be right to
 * assume it was an oversight. It was not.
 */
const ALLOWED: { kind: string; product: string; why: string }[] = [
  {
    kind: "NEGATIVE CLAIM",
    product: "Beef Hotdog",
    why: "The owner stated it: pure beef, no pork inside. Not inferred from the name — the Special Hotdog beside it IS beef with pork fat, which is exactly why saying so matters.",
  },
  {
    kind: "BRAND REPEATED",
    product: "USDA Choice Angus Ribeye (St. Helens)",
    why: "Owner asked for the American producers to be named on the steaks. For imported beef the producer is part of what is bought.",
  },
  {
    kind: "BRAND REPEATED",
    product: "USDA Choice Black Angus Ribeye (Demkota)",
    why: "Same as St. Helens.",
  },
];

const isAllowed = (kind: string, product: string) =>
  ALLOWED.some((a) => a.kind === kind && a.product === product);

type Finding = { kind: string; product: string; detail: string };
const found: Finding[] = [];
const add = (kind: string, product: string, detail: string) => {
  if (isAllowed(kind, product)) return;
  found.push({ kind, product, detail });
};

for (const r of live) {
  const d = read(r);
  const name = r.productName;

  if (!d) {
    add("MISSING", name, "no description at all");
    continue;
  }

  const words = d.split(/\s+/).length;
  if (words > 42) add("TOO LONG", name, `${words} words`);
  if (words < 10) add("TOO SHORT", name, `${words} words: "${d}"`);

  /* A claim that something is absent is the one that hurts when it is wrong. */
  const negative = d.match(
    /\bno (pork|beef|meat|gluten|dairy|nuts?|sugar|lactose)\b|\bfree from\b|\bcontains no\b|\bwithout (?:any )?(?:gluten|dairy|lactose|nuts?)\b/i,
  );
  if (negative) add("NEGATIVE CLAIM", name, negative[0]);

  /* Nutrition and health belong on a label a producer printed. */
  const health = d.match(
    /\b(healthy|healthier|low[- ]fat|low in fat|high in protein|good for you|diet|slimming|superfood)\b/i,
  );
  if (health) add("HEALTH CLAIM", name, health[0]);

  /* Who does the work is not what the product is. */
  const who = d.match(
    /\b(sliced to order|cut to order|ground here|here in the shop|under our own label|portioned here|we (?:make|grind|cure|smoke))\b/i,
  );
  if (who) add("WHO-DOES-IT", name, who[0]);

  /*
   * A brand already printed on the shelf label, repeated in the note.
   *
   * The brackets do not always hold a brand — "(Whole)", "(Frozen Mixed)" and
   * "(Lumpia Wrapper)" describe the goods — and a brand's first word is
   * sometimes an ordinary one, which is how "Coco Heaven" matched the word
   * "coconut" and "Sweet Baby Ray's" matched "sweet first, then smoky". So:
   * whole words only, and a lone first word has to be long and distinctive.
   */
  const bracket = name.match(/\(([^()]+)\)\s*(?:—.*)?$/);
  if (bracket) {
    const brand = bracket[1].trim();
    const esc = (t: string) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const head = brand.split(/\s+/)[0].replace(/'s$/, "");
    const whole = new RegExp(`\\b${esc(brand)}\\b`, "i").test(d);
    const byHead =
      head.length >= 5 &&
      !COMMON_WORDS.has(head.toLowerCase()) &&
      new RegExp(`\\b${esc(head)}\\b`, "i").test(d);
    if (!NOT_BRANDS.has(brand.toLowerCase()) && !/^\d/.test(brand) && (whole || byHead)) {
      add("BRAND REPEATED", name, brand);
    }
  }

  /* Raw or cooked is the claim a customer acts on in a kitchen. */
  const state = d.match(/\b(sold raw|cooked through|cooked already|ready to eat)\b/i);
  if (state) add("state (review by hand)", name, state[0]);

  if (/\s{2,}/.test(d)) add("DOUBLE SPACE", name, "two spaces in a row");
  if (/[�]/.test(d)) add("BAD CHARACTER", name, "replacement character");
  if (!/[.!?]$/.test(d)) add("NO FULL STOP", name, `ends "${d.slice(-24)}"`);
}

/* The same sentence on two different items usually means a copy-paste slip.
   Variants of one item sharing a line is correct and not reported. */
const byText = new Map<string, Set<string>>();
for (const r of live) {
  const d = read(r);
  if (!d) continue;
  const item = r.productName.split(" — ")[0];
  if (!byText.has(d)) byText.set(d, new Set());
  byText.get(d)!.add(item);
}
for (const [text, items] of byText) {
  if (items.size > 1) {
    add("SHARED BY ITEMS", [...items].join(" / "), `"${text.slice(0, 70)}..."`);
  }
}

const order = [
  "MISSING",
  "NEGATIVE CLAIM",
  "HEALTH CLAIM",
  "WHO-DOES-IT",
  "BRAND REPEATED",
  "SHARED BY ITEMS",
  "TOO LONG",
  "TOO SHORT",
  "NO FULL STOP",
  "DOUBLE SPACE",
  "BAD CHARACTER",
  "state (review by hand)",
];

console.log(`${live.length} products the site shows.\n`);
let hard = 0;
for (const kind of order) {
  const hits = found.filter((f) => f.kind === kind);
  if (!hits.length) continue;
  if (kind !== "state (review by hand)") hard += hits.length;
  console.log(`${kind} — ${hits.length}`);
  for (const h of hits) console.log(`    ${h.product}\n        ${h.detail}`);
  console.log("");
}
if (ALLOWED.length) {
  console.log(`Allowed on purpose — ${ALLOWED.length}`);
  for (const a of ALLOWED) console.log(`    ${a.product} (${a.kind})\n        ${a.why}`);
  console.log("");
}

console.log(hard === 0 ? "No problems found." : `${hard} to look at.`);
process.exit(hard > 0 ? 1 : 0);
