import Link from "next/link";
import type { Branch } from "@/lib/types";
import { branchLinks, DEFAULT_WA_MESSAGE } from "@/lib/contact";
import { CategoryPhoto } from "./CategoryPhoto";
import { MessengerIcon, PhoneIcon, MapPinIcon } from "./icons";

/**
 * The title image of a category page, with the copy sitting inside it.
 *
 * The text block is a solid panel rather than words floating on the
 * photograph: a butcher's counter shot is busy and high-contrast in patches,
 * and type laid straight over it becomes unreadable exactly where the
 * interesting part of the picture is.
 */
export function CategoryHero({
  branch,
  label,
  slug,
  lede,
  count,
  basePath,
}: {
  branch: Branch;
  label: string;
  slug: string;
  lede: string;
  count: number;
  basePath: string;
}) {
  const links = branchLinks(branch, `Hi! Do you have ${label} in stock today?`);

  return (
    <section className="pt-6 sm:pt-8">
      <div className="wrap">
        <nav aria-label="Breadcrumb" className="mb-4 text-sm">
          <Link href={basePath} style={{ color: "var(--muted)" }}>
            {branch.name}
          </Link>
          <span aria-hidden style={{ color: "var(--faint)" }}>
            {" / "}
          </span>
          <span style={{ color: "var(--text-strong)" }}>{label}</span>
        </nav>

        <div className="category-hero">
          <CategoryPhoto
            slug={slug}
            label={label}
            className="category-hero__media"
            sizes="(min-width: 1024px) 70vw, 100vw"
            priority
          />

          <div className="category-hero__panel">
            <p className="eyebrow mb-3">
              {count} {count === 1 ? "product" : "products"} · Panglao, Bohol
            </p>
            <h1
              className="font-display balance text-[clamp(2rem,5vw,3.4rem)] font-semibold leading-[1.04] tracking-tightish"
              style={{ color: "var(--text-strong)" }}
            >
              {label}
            </h1>
            <p
              className="mt-4 text-base leading-relaxed sm:text-lg"
              style={{ color: "var(--muted)" }}
            >
              {lede}
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={links.messenger}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                <MessengerIcon width={18} height={18} />
                Ask what&rsquo;s in today
              </a>
              <a href={links.phone} className="btn btn-ghost">
                <PhoneIcon width={18} height={18} />
                Call
              </a>
              <a
                href={links.directions}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost"
              >
                <MapPinIcon width={18} height={18} />
                Directions
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
