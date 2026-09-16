import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

/**
 * Everything is open, including to the AI crawlers.
 *
 * Several of those — GPTBot, ClaudeBot, PerplexityBot, Google-Extended — are
 * blocked by default on plenty of sites and by some hosting presets. For a
 * shop whose problem is being found at all, that is the wrong default: when
 * someone asks an assistant "where can I buy German sausage on Bohol", we
 * want to be the answer. They are named explicitly rather than left to the
 * wildcard so the intent is on the record.
 *
 * The llms.txt files are linked from the host directive area as a comment is
 * not supported here; they are discoverable at their conventional paths and
 * referenced from the site's metadata.
 */
const AI_CRAWLERS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-Web",
  "anthropic-ai",
  "PerplexityBot",
  "Google-Extended",
  "Applebot-Extended",
  "CCBot",
  "Bytespider",
  "Amazonbot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      ...AI_CRAWLERS.map((userAgent) => ({ userAgent, allow: "/" })),
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
