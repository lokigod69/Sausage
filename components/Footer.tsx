import type { Branch } from "@/lib/types";
import { Brand } from "./Brand";

/**
 * Slim footer. The "Visit & contact" section directly above is the canonical
 * contact hub, so the footer deliberately does NOT repeat address/hours/phone
 * or contact buttons — it's just brand, quick links and the legal line.
 */
export function Footer({ branch }: { branch: Branch }) {
  const year = new Date().getFullYear();

  return (
    <footer
      className="relative mt-8"
      style={{
        borderTop: "1px solid var(--line)",
        background: "color-mix(in oklab, var(--bg-2) 80%, black)",
      }}
    >
      <div className="wrap grid gap-8 py-12 sm:py-14 md:grid-cols-[1.6fr_1fr]">
        <div>
          <Brand size="md" />
          <p
            className="mt-5 max-w-xs text-sm leading-relaxed"
            style={{ color: "var(--muted)" }}
          >
            {branch.tagline}
          </p>
        </div>

        <nav aria-label="Footer">
          <h3
            className="text-xs font-semibold uppercase tracking-widest"
            style={{ color: "var(--faint)" }}
          >
            Explore
          </h3>
          <ul
            className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 text-sm"
            style={{ color: "var(--muted)" }}
          >
            <li>
              <a href="#products">Products</a>
            </li>
            <li>
              <a href="#location">Visit &amp; contact</a>
            </li>
            <li>
              <a href="#top">Top of page</a>
            </li>
            <li>
              <a
                href={branch.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Facebook
              </a>
            </li>
          </ul>
        </nav>
      </div>

      <div className="divider" />
      <div className="wrap flex flex-col items-center justify-between gap-2 py-6 text-xs sm:flex-row">
        <p style={{ color: "var(--faint)" }}>
          © {year} The Sausage Guy · {branch.locality}
        </p>
        <p style={{ color: "var(--faint)" }}>
          Availability and product selection may change daily.
        </p>
      </div>
    </footer>
  );
}
