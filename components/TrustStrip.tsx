/*
 * Three claims, each of which has to be true and has to be worth reading.
 *
 * Delivery used to be one of them; it has its own section now, so this says
 * the things that section does not. "One price for everyone" is here because
 * it is the quiet worry a visitor arrives with and the shop has an answer to
 * it — the price on the shelf is the price at the till, whoever is asking.
 */
const ITEMS = [
  "Imported steaks, cut to order",
  "Homemade & locally made",
  "One price for everyone",
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
