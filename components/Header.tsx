import type { Branch } from "@/lib/types";
import { Brand } from "./Brand";

const NAV = [
  { label: "Products", href: "#products" },
  { label: "Reviews", href: "#reviews" },
  { label: "Visit", href: "#location" },
];

/**
 * Header: logo + anchor nav only. No WhatsApp button here — the hero, the
 * Visit section and the mobile sticky bar carry the contact action, so the
 * header stays calm and uncluttered.
 */
export function Header({ branch }: { branch: Branch }) {
  // branch reserved for future per-branch nav; not needed for anchors today.
  void branch;
  return (
    <header
      className="sticky top-0 z-20"
      style={{
        background: "color-mix(in oklab, var(--bg) 82%, transparent)",
        borderBottom: "1px solid var(--line)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
      }}
    >
      <div className="wrap flex items-center justify-between gap-4 py-3">
        <a href="#top" aria-label="The Sausage Guy — home">
          <Brand size="header" priority />
        </a>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
          {NAV.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-sm font-medium transition-colors hover:text-[var(--text-strong)]"
              style={{ color: "var(--muted)" }}
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
