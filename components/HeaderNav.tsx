"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

export interface NavItem {
  label: string;
  href: string;
}

/**
 * The aisle strip under the header.
 *
 * All fourteen categories are here rather than a curated six. This is a shop:
 * the aisle list *is* the navigation, and a visitor reading about Drinks
 * should be able to see that Drinks is where they are and step sideways into
 * Snacks without going home first. It does not fit on one line at any width,
 * so it scrolls horizontally — with the current aisle scrolled into view on
 * arrival and a fade at whichever end still has more behind it, so the
 * overflow reads as "more this way" rather than as a clipped list.
 *
 * A burger menu would hide the one thing worth showing.
 */
export function HeaderNav({
  items,
  homeHref,
}: {
  items: NavItem[];
  /** The branch page — "All products". */
  homeHref: string;
}) {
  const pathname = usePathname();
  const scroller = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ left: false, right: false });

  const measure = useCallback(() => {
    const el = scroller.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setEdges({
      left: el.scrollLeft > 4,
      // 4px of slack: sub-pixel widths otherwise leave the fade permanently on.
      right: el.scrollLeft < max - 4,
    });
  }, []);

  useEffect(() => {
    const el = scroller.current;
    if (!el) return;

    /*
     * Bring the current aisle into view, centred.
     *
     * scrollIntoView({ inline: "nearest" }) scrolls the minimum distance,
     * which parks the active pill flush against an edge — exactly where the
     * fade mask is, so the aisle you are standing in comes out half
     * transparent. Centring costs one line of arithmetic and is clear of
     * both fades. The clamp keeps the first and last aisles from being
     * dragged past the ends.
     */
    const active = el.querySelector<HTMLElement>('[aria-current="page"]');
    if (active) {
      const centred =
        active.offsetLeft - (el.clientWidth - active.offsetWidth) / 2;
      el.scrollTo({
        // Instant: on arrival this is the starting position, not a movement.
        behavior: "instant",
        left: Math.max(0, Math.min(centred, el.scrollWidth - el.clientWidth)),
      });
    }

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [measure, pathname]);

  return (
    <nav aria-label="Product categories" className="header-nav">
      <div className="wrap header-nav__wrap">
        <div
          ref={scroller}
          onScroll={measure}
          className="header-nav__scroller no-scrollbar"
          data-fade-left={edges.left || undefined}
          data-fade-right={edges.right || undefined}
        >
          <Link
            href={homeHref}
            className="header-nav-link header-nav-link--home"
            aria-current={pathname === homeHref ? "page" : undefined}
          >
            All products
          </Link>
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="header-nav-link"
              aria-current={pathname === item.href ? "page" : undefined}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
