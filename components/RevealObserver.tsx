"use client";

import { useEffect } from "react";

/**
 * Progressive scroll-reveal: watches every element carrying `data-reveal`
 * and stamps `.is-in` when it enters the viewport. All animation lives in
 * CSS (globals.css), which also provides a no-JS fallback and honors
 * prefers-reduced-motion — this component only flips the class.
 *
 * Render it once per page. Server components stay server-rendered; they
 * just add the attribute.
 */
export function RevealObserver() {
  useEffect(() => {
    const nodes = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-in)"),
    );
    if (nodes.length === 0) return;

    if (!("IntersectionObserver" in window)) {
      nodes.forEach((n) => n.classList.add("is-in"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
    );
    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, []);

  return null;
}
