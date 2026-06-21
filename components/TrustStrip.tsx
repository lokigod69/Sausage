// Distinct value props only — nothing repeated from the announcement bar,
// the hero, or the stock disclaimer. Delivery is surfaced here (once).
const ITEMS = [
  "Premium meats & deli",
  "Frozen seafood & salmon",
  "Pickup & delivery",
];

export function TrustStrip() {
  return (
    <section className="mt-14 sm:mt-20" aria-label="What to expect">
      <div className="wrap">
        <div
          className="surface-solid flex flex-wrap items-center justify-center gap-x-6 gap-y-3 px-5 py-4 text-sm sm:gap-x-10"
          style={{ color: "var(--muted)" }}
        >
          {ITEMS.map((item, i) => (
            <span key={item} className="flex items-center gap-3">
              {i > 0 && (
                <span
                  aria-hidden
                  className="hidden h-1 w-1 rounded-full sm:inline-block"
                  style={{ background: "var(--accent)" }}
                />
              )}
              <span>{item}</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
