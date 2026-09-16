import Link from "next/link";
import type { Branch } from "@/lib/types";
import { branchLinks, DEFAULT_WA_MESSAGE } from "@/lib/contact";
import { categoryPath } from "@/lib/routes";
import { Brand } from "./Brand";
import { HeaderNav } from "./HeaderNav";
import { OpenStatus } from "./OpenStatus";
import { MessengerIcon, PhoneIcon } from "./icons";

/**
 * Header: brand, whether the shop is open, one contact action, and the aisle
 * strip.
 *
 * Two rows rather than one. Cramming the nav in beside the brand leaves it
 * about 300px wide on a laptop, which is not enough for fourteen aisles, and
 * a burger menu would hide the one thing worth showing. The second row costs
 * 40px and carries the whole shop.
 *
 * On a phone the top row is brand + a compact "Open now" — no hours, because
 * the bar directly above already prints them, and the long version wrapped
 * onto two lines and made the header 30px taller for no new information. The
 * contact actions live in the sticky bar at the bottom of the screen, where a
 * thumb is, so they are not repeated here.
 */
export function Header({
  branch,
  basePath,
}: {
  branch: Branch;
  basePath: string;
}) {
  const links = branchLinks(branch, DEFAULT_WA_MESSAGE);

  // One source of truth for the slugs: categoryPath, the same helper the
  // cards, the footer and the sitemap use. This used to build its own and
  // would have drifted the first time a category was renamed.
  const navItems = branch.featuredCategories.map((card) => ({
    label: card.label,
    href: categoryPath(basePath, card.label),
  }));

  return (
    <header className="site-header">
      <div className="wrap site-header__bar">
        <Link
          href={basePath}
          aria-label={`${branch.name} — home`}
          className="flex-shrink-0"
        >
          <Brand size="header" priority tone="dark" />
        </Link>

        <div className="hidden items-center gap-4 lg:flex">
          <OpenStatus
            open={branch.hours.open}
            close={branch.hours.close}
            display={branch.hours.display}
          />
          <span className="site-header__rule" aria-hidden />
          <a href={links.phone} className="btn btn-ghost">
            <PhoneIcon width={17} height={17} />
            {branch.phone}
          </a>
          <a
            href={links.messenger}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
          >
            <MessengerIcon width={17} height={17} />
            Messenger
          </a>
        </div>

        <div className="text-sm lg:hidden">
          <OpenStatus
            open={branch.hours.open}
            close={branch.hours.close}
            display={branch.hours.display}
            compact
          />
        </div>
      </div>

      <HeaderNav items={navItems} homeHref={basePath} />
    </header>
  );
}
