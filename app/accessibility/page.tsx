import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getBranch } from "@/data/branches";
import { branchLinks } from "@/lib/contact";
import { SITE_URL } from "@/lib/site";
import { AnnouncementBar } from "@/components/AnnouncementBar";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { StickyContactBar } from "@/components/StickyContactBar";
import { MessengerIcon, PhoneIcon } from "@/components/icons";

const BRANCH_SLUG = "panglao";
const BASE_PATH = process.env.NEXT_PUBLIC_PANGLAO_PATH || "/panglao";

/** Last time someone went through the site against the checklist. */
const LAST_REVIEWED = "16 September 2026";

export const metadata: Metadata = {
  title: "Accessibility",
  description:
    "What we have done to make thesausageguy.shop usable for everyone, what is not finished yet, and how to tell us about a barrier.",
  alternates: { canonical: "/accessibility" },
  openGraph: {
    title: "Accessibility | The Sausage Guy",
    description:
      "What we have done to make this site usable for everyone, what is not finished, and how to report a problem.",
    url: `${SITE_URL}/accessibility`,
    type: "website",
    locale: "en_PH",
  },
};

/**
 * The accessibility statement.
 *
 * Written as a statement rather than a badge. "This site is accessible" is a
 * claim about every page against every need, made by people who are not the
 * ones being excluded — and the moment one image loses its description it is
 * false. What a statement can honestly say is: here is the standard we work
 * to, here is what we have actually done and measured, here is what is not
 * finished, and here is how to tell us when we have got it wrong. The last
 * one is the part that matters, because it is the only one that fixes
 * anything.
 *
 * Everything under "What we have done" was measured, not estimated. If a
 * number here is edited, re-measure first.
 */
export default function AccessibilityPage() {
  const branch = getBranch(BRANCH_SLUG);
  if (!branch) notFound();
  const links = branchLinks(
    branch,
    "Hi! I had a problem using your website and wanted to tell you about it.",
  );

  return (
    <div className="atmosphere">
      <AnnouncementBar branch={branch} />
      <Header branch={branch} basePath={BASE_PATH} />

      <main id="main" className="pb-24 md:pb-0">
        <section className="section">
          <div className="wrap">
            <nav aria-label="Breadcrumb" className="mb-4 text-sm">
              <Link href={BASE_PATH} style={{ color: "var(--muted)" }}>
                {branch.name}
              </Link>
              <span aria-hidden style={{ color: "var(--faint)" }}>
                {" / "}
              </span>
              <span style={{ color: "var(--text-strong)" }}>Accessibility</span>
            </nav>

            <p className="eyebrow mb-3">Accessibility</p>
            <h1
              className="font-display balance max-w-3xl text-[clamp(2rem,5vw,3.2rem)] font-semibold leading-[1.05] tracking-tightish"
              style={{ color: "var(--text-strong)" }}
            >
              We want this shop to work for everyone.
            </h1>
            <p
              className="mt-5 max-w-2xl text-base leading-relaxed sm:text-lg"
              style={{ color: "var(--muted)" }}
            >
              This page is about the website: being able to read what we carry,
              hear what a photograph shows, find today&rsquo;s price and reach
              us — whether you use a screen reader, a keyboard alone, larger
              text, or cannot use a telephone. Here is where we actually are,
              the good and the not-yet.
            </p>

            <div className="category-article">
              <article>
                <h2>What we aim for</h2>
                <p>
                  The Web Content Accessibility Guidelines, version 2.2, level
                  AA. That is the standard most countries write into law and
                  the one worth measuring against. We are not certified by
                  anyone and we have not been audited by a third party: what
                  follows is our own testing, and we would rather say so than
                  imply otherwise.
                </p>
              </article>

              <article>
                <h2>What we have done</h2>
                <p>
                  Every image on the site has a description written for it —
                  not the file name, not the product name repeated, but what
                  the picture actually shows, so that someone who cannot see it
                  gets the same thing everyone else does. Where a photograph
                  does not exist yet, the space says so rather than sitting
                  there empty. Text and background colours
                  are measured, not guessed: body text sits at 14.8:1, the
                  quietest text on the page at 4.7:1, and the buttons carry
                  their labels at 5.4:1 — all above the 4.5:1 the standard asks
                  for. The outline of a search box or a button clears 3:1
                  against what is behind it, so you can find the thing you are
                  meant to click.
                </p>
                <p>
                  A keyboard alone will get you through the whole site. Every
                  page starts with a link that skips the header, the focus
                  outline is dark enough to see on every surface including the
                  terracotta buttons, and nothing traps focus. The banner at the
                  top of the home page can be stopped with a button, does not
                  move at all for anyone whose system asks for reduced motion,
                  and does not read itself aloud while it rotates.
                </p>
                <p>
                  The page reflows down to a 320-pixel screen without sideways
                  scrolling, and it still does if you override our line height,
                  letter spacing and word spacing with your own. Headings run in
                  order with one h1 per page, the landmarks are real ones, and
                  the search box, the aisle list and the expanding product
                  sections are built to the patterns a screen reader expects
                  rather than ones that merely look right.
                </p>
              </article>

              <article>
                <h2>If you are Deaf or hard of hearing</h2>
                <p>
                  Nothing on this site plays sound. There is no video, no
                  autoplaying audio and no voice-only information, so there is
                  nothing here that needs a caption or a transcript — every
                  fact about a product, a price or the shop is written down.
                </p>
                <p>
                  You never have to ring us. Messenger is our main way of
                  talking to customers, not a fallback: it is the first button
                  on every page, we answer it through the day, and you can
                  order, ask what is in stock and arrange delivery entirely in
                  writing. WhatsApp works the same way.
                </p>
              </article>

              <article>
                <h2>What is not finished</h2>
                <p>
                  Six of our fourteen aisles have a photograph; the other eight
                  show a marked placeholder while we shoot them. Most products
                  have no picture yet either — those tiles say &ldquo;photo
                  coming soon&rdquo; instead of pretending. Product names come
                  straight from the shop till, so some are abbreviated in ways
                  that read oddly out loud: &ldquo;2-pack&rdquo;,
                  &ldquo;500g&rdquo;, the odd bracket. We are tidying those at
                  source.
                </p>
                <p>
                  We have tested this ourselves with the tools available to us.
                  We have not yet had it tested by someone who uses a screen
                  reader every day, which is the test that actually counts. If
                  that is you and something here does not work, we would
                  genuinely like to hear about it.
                </p>
              </article>

              <article>
                <h2>One note about the shop itself</h2>
                <p>
                  This statement is about the website, but the counter is worth
                  a line: it is inside Dason Store in Bolod and there are steps
                  to get in. It is not step-free and we are not going to pretend
                  otherwise. Message or ring before you come and we will bring
                  your order out to you at the road — or skip the trip
                  altogether, because we deliver by Maxim across Panglao,
                  Dauis, Tagbilaran, Baclayon, Alburquerque and Cortes.{" "}
                  <Link
                    href={`${BASE_PATH}#delivery`}
                    style={{
                      color: "var(--accent-ink)",
                      textDecoration: "underline",
                    }}
                  >
                    How delivery works
                  </Link>
                  .
                </p>
              </article>

              <article>
                <h2>Tell us when we get it wrong</h2>
                <p>
                  If any part of this site keeps you from finding a price,
                  reading a page or reaching us, please say so. Messenger is the
                  fastest way and the phone works just as well. Tell us the page
                  and what happened — you do not need to know the technical
                  name for it, and there is no wrong way to report it.
                </p>
                <p>
                  We read everything that comes in and we will tell you what we
                  are doing about it. If we cannot fix something quickly, we
                  will say that too, and we will help you get what you came for
                  in the meantime.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <a
                    href={links.messenger}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary"
                  >
                    <MessengerIcon width={18} height={18} aria-hidden />
                    Report a problem on Messenger
                  </a>
                  <a href={links.phone} className="btn btn-ghost">
                    <PhoneIcon width={18} height={18} aria-hidden />
                    {branch.phone}
                  </a>
                </div>
              </article>

              <article>
                <h2>This statement</h2>
                <p>
                  Last reviewed on {LAST_REVIEWED}, by going through the site
                  against the WCAG 2.2 AA checklist and measuring every colour
                  pair, rather than by running a scanner over it. It is updated
                  when the site changes or when someone tells us something we
                  did not know.
                </p>
              </article>
            </div>
          </div>
        </section>
      </main>

      <Footer branch={branch} basePath={BASE_PATH} />
      <StickyContactBar branch={branch} />
    </div>
  );
}
