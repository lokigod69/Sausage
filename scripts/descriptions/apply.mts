/**
 * Write a batch of product descriptions into Loyverse.
 *
 *   node scripts/descriptions/apply.mts scripts/descriptions/counter.json
 *   node scripts/descriptions/apply.mts scripts/descriptions/counter.json --apply
 *
 * The batch file is a flat JSON object keyed on the EXACT Loyverse item name,
 * so the texts stay reviewable as prose and nothing has to survive a shell.
 *
 * Why this is a script and not a one-off: POST /items replaces the whole item,
 * so every write has to fetch the item first and send it back otherwise
 * untouched. Getting that wrong deletes variants. It is worth writing once.
 *
 * Two safety rules, both of them load-bearing:
 *   - every existing description is saved to disk before anything is sent;
 *   - an item that already carries a description is SKIPPED, never overwritten,
 *     because that text may be something a person at the shop typed.
 *     Corrections to our own earlier text go through --force with the item
 *     named explicitly, which is how the four sausage fixes were applied.
 *
 * Dry run unless --apply.
 */
import { readFileSync, writeFileSync } from "node:fs";

const TOKEN = process.env.LOYVERSE_ACCESS_TOKEN;
const ARGS = process.argv.slice(2);
const APPLY = ARGS.includes("--apply");
const FORCE = ARGS.includes("--force");
const file = ARGS.find((a) => !a.startsWith("--"));

const H = { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" };

if (!TOKEN) {
  console.error("LOYVERSE_ACCESS_TOKEN is not set.");
  process.exit(1);
}
if (!file) {
  console.error("Usage: apply.mts <batch.json> [--apply] [--force]");
  process.exit(1);
}

const TEXTS: Record<string, string> = JSON.parse(readFileSync(file, "utf8"));

type Item = {
  id: string;
  item_name: string;
  description?: string;
  [k: string]: unknown;
};

let items: Item[] = [];
let cursor: string | undefined;
do {
  const url = `https://api.loyverse.com/v1.0/items?limit=250${cursor ? `&cursor=${cursor}` : ""}`;
  const json = await (await fetch(url, { headers: H })).json();
  items = items.concat(json.items ?? []);
  cursor = json.cursor;
} while (cursor);

const backup = `descriptions-backup-${new Date().toISOString().replace(/[:.]/g, "-")}.json`;
writeFileSync(
  backup,
  JSON.stringify(
    items.map((i) => ({
      id: i.id,
      item_name: i.item_name,
      description: i.description ?? null,
    })),
    null,
    2,
  ),
);
console.log(`backup of all ${items.length} descriptions: ${backup}\n`);

const plan: { item: Item; text: string }[] = [];
const missing: string[] = [];
const occupied: string[] = [];

for (const [name, text] of Object.entries(TEXTS)) {
  const item = items.find(
    (i) => i.item_name.trim().toLowerCase() === name.trim().toLowerCase(),
  );
  if (!item) {
    missing.push(name);
    continue;
  }
  // An empty rich-text paragraph does not count as a description someone wrote.
  const existing = (item.description ?? "").replace(/<[^>]*>|&nbsp;|\s/g, "");
  if (existing !== "" && !FORCE) {
    occupied.push(`${item.item_name}: "${item.description}"`);
    continue;
  }
  plan.push({ item, text });
}

console.log(`${file}: ${Object.keys(TEXTS).length} in the batch, ${plan.length} to write`);

if (missing.length) {
  console.log(`\n  NOT FOUND in Loyverse (${missing.length}) — check the spelling:`);
  for (const m of missing) console.log(`     ${m}`);
}
if (occupied.length) {
  console.log(`\n  skipped, a description is already there (${occupied.length}):`);
  for (const o of occupied) console.log(`     ${o}`);
}

/* A description sits in a small dialog on a phone. Past roughly forty words it
   stops being a note and becomes something nobody reads. */
const long = plan.filter((p) => p.text.split(/\s+/).length > 42);
if (long.length) {
  console.log(`\n  over 42 words (${long.length}):`);
  for (const l of long) {
    console.log(`     ${l.item.item_name} (${l.text.split(/\s+/).length})`);
  }
}

if (!APPLY) {
  console.log("\nDry run. Pass --apply to write.");
  process.exit(0);
}

let ok = 0;
for (const { item, text } of plan) {
  const res = await fetch("https://api.loyverse.com/v1.0/items", {
    method: "POST",
    headers: H,
    body: JSON.stringify({ ...item, description: text }),
  });
  if (!res.ok) {
    console.error(
      `\n  x ${item.item_name}: HTTP ${res.status} ${(await res.text()).slice(0, 200)}`,
    );
    continue;
  }
  ok++;
  process.stdout.write(".");
}
console.log(`\n\n${ok} of ${plan.length} written. Backup: ${backup}`);
