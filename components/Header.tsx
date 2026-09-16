import type { Branch } from "@/lib/types";
import { branchLinks, DEFAULT_WA_MESSAGE } from "@/lib/contact";
import { Brand } from "./Brand";
import { OpenStatus } from "./OpenStatus";
import { WhatsAppIcon } from "./icons";

/**
 * Header: brand, category nav, open/closed status and one contact action.
 *
 * The nav lists the six counter categories rather than page anchors — those
 * are what people come for, and each now has its own page. The shelf
 * categories stay one level down, on the home page grid, so the bar does not
 * turn into a fourteen-item list nobody reads.
 *
 * On phones the nav collapses to a horizontally scrollable strip: a burger
 * menu would hide the one thing worth showing.
 */
const COUNTER_NAV = [
  "Sausages",
  "Meat & Steaks",
  "Poultry",
  "Seafood",
  "Hams & Cold Cuts",
  "Cheese & Dairy",
];

function categoryHref(basePath: string, label: string): string {
  return `${basePath}/${label
    .toLowerCase()
    .replace(/&/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")}`;
}

export function Header({
  branch,
  basePath,
}: {
  branch: Branch;
  basePath: string;
}) {
  const links = branchLinks(branch, DEFAULT_WA_MESSAGE);

  return (
    <header
      className="sticky top-0 z-30"
      style={{
        background: "color-mix(in oklab, var(--bg) 88%, transparent)",
        borderBottom: "1px solid var(--line)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
      }}
    >
      <div className="wrap flex items-center justify-between gap-4 py-3">
        <a
          href={basePath}
          aria-label="The Sausage Guy — home"
          className="flex-shrink-0"
        >
          <Brand size="header" priority tone="dark" />
        </a>

        <div className="hidden items-center gap-5 lg:flex">
          <OpenStatus
            open={branch.hours.open}
            close={branch.hours.close}
            display={branch.hours.display}
          />
          <a
            href={links.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-wa"
          >
            <WhatsAppIcon width={17} height={17} />
            Message us
          </a>
        </div>

        {/* Phone: the status pill alone, so the bar stays one line. */}
        <div className="lg:hidden">
          <OpenStatus
            open={branch.hours.open}
            close={branch.hours.close}
            display={branch.hours.display}
          />
        </div>
      </div>

      <nav
        aria-label="Categories"
        className="no-scrollbar overflow-x-auto"
        style={{ borderTop: "1px solid var(--line)" }}
      >
        <div className="wrap flex items-center gap-1 py-1.5">
          <a
            href={`${basePath}#products`}
            className="header-nav-link"
            style={{ color: "var(--text-strong)" }}
          >
            All products
          </a>
          {COUNTER_NAV.map((label) => (
            <a
              key={label}
              href={categoryHref(basePath, label)}
              className="header-nav-link"
            >
              {label}
            </a>
          ))}
        </div>
      </nav>
    </header>
  );
}
