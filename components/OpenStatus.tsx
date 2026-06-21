"use client";

import { useEffect, useState } from "react";

/**
 * Live "Open now / Closed" pill computed in the store's local timezone
 * (Asia/Manila) regardless of the visitor's device timezone. Renders a
 * neutral label on the server and upgrades after mount to avoid hydration
 * mismatch.
 */
export function OpenStatus({
  open,
  close,
  display,
  className = "",
  compact = false,
}: {
  open: string; // "08:00"
  close: string; // "20:00"
  display: string; // "8:00 AM – 8:00 PM"
  className?: string;
  /** When true, show only "Open now / Closed now" without the hours range. */
  compact?: boolean;
}) {
  const [state, setState] = useState<"unknown" | "open" | "closed">("unknown");

  useEffect(() => {
    function compute() {
      const now = new Date();
      const manila = new Intl.DateTimeFormat("en-US", {
        timeZone: "Asia/Manila",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }).format(now);
      const [h, m] = manila.split(":").map(Number);
      const cur = h * 60 + m;
      const [oh, om] = open.split(":").map(Number);
      const [ch, cm] = close.split(":").map(Number);
      const isOpen = cur >= oh * 60 + om && cur < ch * 60 + cm;
      setState(isOpen ? "open" : "closed");
    }
    compute();
    const id = setInterval(compute, 60_000);
    return () => clearInterval(id);
  }, [open, close]);

  const isOpen = state === "open";
  // Fixed semantic colors so the dot never lies: green = open, clay-red =
  // closed (never tied to a variant's --accent-2, which may be green).
  const dotColor =
    state === "unknown"
      ? "var(--muted)"
      : isOpen
        ? "#33c06a"
        : "#c0573f";

  return (
    <span
      className={`inline-flex items-center gap-2 ${className}`}
      aria-live="polite"
    >
      <span className="relative inline-flex h-2 w-2">
        {isOpen && (
          <span
            className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-60"
            style={{ background: dotColor }}
          />
        )}
        <span
          className="relative inline-flex h-2 w-2 rounded-full"
          style={{ background: dotColor }}
        />
      </span>
      <span>
        {state === "open"
          ? "Open now"
          : state === "closed"
            ? "Closed now"
            : "Open daily"}
        {!compact && (
          <span style={{ color: "var(--faint)" }}> · {display}</span>
        )}
      </span>
    </span>
  );
}
