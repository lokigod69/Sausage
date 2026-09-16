/**
 * Generate the site's missing pictures with OpenAI's image API — the category
 * title images and the hero banners.
 *
 * Run it with:
 *   npm run gen:images                      # everything marked have:false
 *   npm run gen:images -- drinks            # just these slugs
 *   npm run gen:images -- banner-delivery   # banners are slugs too
 *
 * Needs OPENAI_API_KEY in .env.local. That key is billable — a gpt-image-1
 * render at this size runs to roughly USD 0.20, so eight images is a couple of
 * dollars. The script prints the estimate before it spends anything, and
 * refuses to re-render a slug that already has a file unless --force is given.
 *
 * The prompts live in data/image-prompts.ts, next to the flag saying which
 * categories still need one, so the brief and the checklist cannot drift
 * apart. After a successful run this script flips `have` to true there and
 * adds the slug to CATEGORY_PHOTO_SLUGS in data/category-images.ts — those
 * two edits are what actually put the picture on the page.
 *
 * Node runs this file directly via type stripping, so every import here must
 * use a real relative path with its extension — no "@/" aliases at runtime.
 */

import { mkdir, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { HOUSE_STYLE, IMAGE_PROMPTS } from "../data/image-prompts.ts";

const API_URL = "https://api.openai.com/v1/images/generations";
const MODEL = "gpt-image-1";

/**
 * gpt-image-1 renders 3:2. Both output shapes are cropped from that: the
 * category card is 4:3 (taller, so the sides come off) and the hero banner is
 * 16:10 (wider, so the top and bottom do). Generating wide and cropping is
 * the right way round — asking for a square and stretching would distort, and
 * the prompts already say to leave air at the edges.
 */
const GEN_SIZE = "1536x1024";
const SHAPES = {
  card: { width: 1200, height: 900 },
  banner: { width: 1600, height: 1000 },
} as const;
/** Matches the six photographs already in /public/products (200-250 KB). */
const JPEG_QUALITY = 82;

const PUBLIC_DIR = path.join(process.cwd(), "public");
const PROMPTS_FILE = path.join(process.cwd(), "data", "image-prompts.ts");
const REGISTRY_FILE = path.join(process.cwd(), "data", "category-images.ts");

function fail(message: string): never {
  console.error(`\n✖ ${message}\n`);
  process.exit(1);
}

async function generate(slug: string, prompt: string): Promise<Buffer> {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: MODEL,
      prompt: `${prompt}, ${HOUSE_STYLE}`,
      size: GEN_SIZE,
      quality: "high",
      n: 1,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`${slug}: HTTP ${response.status} — ${body.slice(0, 400)}`);
  }

  const payload = (await response.json()) as {
    data?: { b64_json?: string; url?: string }[];
  };
  const image = payload.data?.[0];
  if (!image) throw new Error(`${slug}: the API returned no image`);

  // gpt-image-1 always returns base64; the url form is older models only.
  if (image.b64_json) return Buffer.from(image.b64_json, "base64");
  if (image.url) return Buffer.from(await (await fetch(image.url)).arrayBuffer());
  throw new Error(`${slug}: the API returned neither b64_json nor url`);
}

/**
 * Flip `have: false` to true for one slug in data/image-prompts.ts.
 *
 * Editing the source rather than writing a separate generated manifest keeps
 * the brief and its state in the one file a person actually reads.
 *
 * Located by index rather than by regex: a prompt is free text and could
 * contain anything, so the only span worth trusting is "after this key and
 * before the entry ends".
 */
function markHave(source: string, slug: string): string {
  const key = /^[a-z][a-z0-9]*$/.test(slug) ? `${slug}: {` : `"${slug}": {`;
  const start = source.indexOf(key);
  const flag = start === -1 ? -1 : source.indexOf("have: false", start);
  const end = start === -1 ? -1 : source.indexOf("\n  },", start);

  if (flag === -1 || end === -1 || flag > end) {
    console.warn(`  ! could not flip have:false for ${slug} — do it by hand`);
    return source;
  }
  return `${source.slice(0, flag)}have: true${source.slice(flag + "have: false".length)}`;
}

/** Add one slug to CATEGORY_PHOTO_SLUGS in data/category-images.ts. */
function addToRegistry(source: string, slug: string): string {
  if (source.includes(`"${slug}"`)) return source;
  const anchor = "export const CATEGORY_PHOTO_SLUGS = new Set([";
  if (!source.includes(anchor)) {
    console.warn(`  ! could not find CATEGORY_PHOTO_SLUGS — add ${slug} by hand`);
    return source;
  }
  return source.replace(anchor, `${anchor}\n  "${slug}",`);
}

async function main() {
  if (!process.env.OPENAI_API_KEY) {
    fail(
      "OPENAI_API_KEY is not set.\n" +
        "  Put it in .env.local (it is gitignored):\n" +
        "    OPENAI_API_KEY=sk-...\n" +
        "  Get one at platform.openai.com/api-keys — this is an API key, not\n" +
        "  the ChatGPT subscription.",
    );
  }

  const args = process.argv.slice(2);
  const force = args.includes("--force");
  const asked = args.filter((a) => !a.startsWith("--"));

  const targets = Object.entries(IMAGE_PROMPTS).filter(([slug, p]) =>
    asked.length > 0 ? asked.includes(slug) : !p.have,
  );

  if (targets.length === 0) {
    console.log(
      asked.length > 0
        ? `No prompt matches ${asked.join(", ")}. Keys are the category slugs in data/image-prompts.ts.`
        : "Every category already has a photograph. Nothing to do.",
    );
    return;
  }

  console.log(`\nGenerating ${targets.length} image(s) with ${MODEL}:`);
  for (const [slug, p] of targets) console.log(`  · ${slug} → ${p.path}`);
  console.log(`  ≈ USD ${(targets.length * 0.2).toFixed(2)} at current pricing\n`);

  const done: string[] = [];

  for (const [slug, spec] of targets) {
    const outPath = path.join(PUBLIC_DIR, spec.path.replace(/^\//, ""));

    if (existsSync(outPath) && !force) {
      console.log(`· ${slug}: already on disk, skipping (--force to replace)`);
      continue;
    }

    process.stdout.write(`· ${slug}: generating… `);
    try {
      const { width, height } = SHAPES[spec.shape ?? "card"];
      const raw = await generate(slug, spec.prompt);
      const jpeg = await sharp(raw)
        .resize(width, height, { fit: "cover", position: "centre" })
        .jpeg({ quality: JPEG_QUALITY, mozjpeg: true })
        .toBuffer();
      await mkdir(path.dirname(outPath), { recursive: true });
      await writeFile(outPath, jpeg);
      console.log(
        `${width}x${height}, ${(jpeg.length / 1024).toFixed(0)} KB → ${spec.path}`,
      );
      done.push(slug);
    } catch (error) {
      // One bad prompt should not lose the images already paid for.
      console.log("failed");
      console.error(`  ${error instanceof Error ? error.message : error}`);
    }
  }

  if (done.length === 0) {
    console.log("\nNothing written.\n");
    return;
  }

  let prompts = await readFile(PROMPTS_FILE, "utf8");
  let registry = await readFile(REGISTRY_FILE, "utf8");
  for (const slug of done) {
    prompts = markHave(prompts, slug);
    // Only category cards belong in the photo registry. "hero" is the branch
    // page's own image and "banner-*" are hero slides; neither has a card.
    const isCategoryCard = slug !== "hero" && !slug.startsWith("banner-");
    if (isCategoryCard) registry = addToRegistry(registry, slug);
  }
  await writeFile(PROMPTS_FILE, prompts);
  await writeFile(REGISTRY_FILE, registry);

  console.log(
    `\n✓ ${done.length} image(s) written, data/image-prompts.ts and ` +
      `data/category-images.ts updated.\n` +
      `  Look at them before committing — an image that is wrong about the ` +
      `products is worse than the tinted panel it replaced.\n`,
  );
}

main().catch((error) => fail(error instanceof Error ? error.message : String(error)));
