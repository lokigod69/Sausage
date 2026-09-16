"use client";

import { useEffect, useRef, useState } from "react";
import type { Branch, Product } from "@/lib/types";
import { branchLinks, DEFAULT_WA_MESSAGE } from "@/lib/contact";
import { searchProducts } from "@/lib/products";
import { categoryPath } from "@/lib/routes";
import {
  SearchIcon,
  MessengerIcon,
  WhatsAppIcon,
  PhoneIcon,
  FacebookIcon,
  MapPinIcon,
} from "./icons";

/**
 * The band directly under the hero: search first, then the three ways to
 * reach the shop.
 *
 * Search lives up here because the catalogue is 443 items across fourteen
 * categories — scrolling is a poor way to answer "do you have lamb". Typing
 * shows matches immediately with price and stock, and Enter drops the visitor
 * into the full list filtered to the same term.
 */
export function QuickActions({
  branch,
  products,
  basePath,
}: {
  branch: Branch;
  products: Product[];
  basePath: string;
}) {
  const links = branchLinks(branch, DEFAULT_WA_MESSAGE);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  const matches = query.trim().length > 1 ? searchProducts(products, query).slice(0, 6) : [];

  // Close the suggestion list on an outside click or Escape.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  /** Hand the term to the full browser further down and scroll to it. */
  const submit = (term: string) => {
    if (!term.trim()) return;
    setOpen(false);
    window.dispatchEvent(new CustomEvent("sg:search", { detail: term }));
    document.querySelector("#products")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="section-tight" aria-label="Search and contact">
      <div className="wrap">
        <div className="quick-actions">
          <div className="quick-actions__search" ref={boxRef}>
            <SearchIcon
              width={19}
              height={19}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2"
              style={{ color: "var(--faint)" }}
            />
            <input
              type="search"
              inputMode="search"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setOpen(true);
              }}
              onFocus={() => setOpen(true)}
              onKeyDown={(e) => e.key === "Enter" && submit(query)}
              placeholder="Search 440+ products — ribeye, salmon, bratwurst…"
              aria-label="Search products"
              className="w-full rounded-full py-4 pl-12 pr-4 text-base outline-none"
              style={{
                background: "var(--surface)",
                border: "1px solid var(--line-strong)",
                color: "var(--text-strong)",
              }}
            />

            {open && matches.length > 0 && (
              <ul className="quick-actions__results" role="listbox">
                {matches.map((p) => (
                  <li key={p.id}>
                    <a
                      href={categoryPath(basePath, p.category)}
                      className="quick-actions__result"
                    >
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-medium">
                          {p.productName}
                        </span>
                        <span
                          className="block text-xs"
                          style={{ color: "var(--faint)" }}
                        >
                          {p.category}
                          {p.stock?.status === "out" && " · sold out"}
                        </span>
                      </span>
                      {p.price !== undefined && (
                        <span className="tabular-nums text-sm font-semibold">
                          ₱{p.price.toLocaleString("en-PH")}
                        </span>
                      )}
                    </a>
                  </li>
                ))}
                <li>
                  <button
                    type="button"
                    onClick={() => submit(query)}
                    className="quick-actions__result w-full text-left text-sm"
                    style={{ color: "var(--accent)" }}
                  >
                    See all matches for “{query}”
                  </button>
                </li>
              </ul>
            )}
          </div>

          {/*
            All five ways to reach the shop, in the order they are actually
            used here: Messenger first because in the Philippines that is how
            people open a conversation with a business, then WhatsApp for the
            expat half of the customer base, then the phone. The page and the
            map follow — useful, but not the action.
          */}
          <div className="quick-actions__links">
            <a
              href={links.messenger}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
            >
              <MessengerIcon width={18} height={18} />
              Messenger
            </a>
            <a
              href={links.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-wa"
            >
              <WhatsAppIcon width={18} height={18} />
              WhatsApp
            </a>
            <a href={links.phone} className="btn btn-primary">
              <PhoneIcon width={18} height={18} />
              Call
            </a>
            <a
              href={links.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost"
            >
              <FacebookIcon width={18} height={18} />
              Facebook
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
    </section>
  );
}
