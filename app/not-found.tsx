import Link from "next/link";

const PANGLAO_PATH = process.env.NEXT_PUBLIC_PANGLAO_PATH || "/panglao";

/**
 * Branded 404. Also replaces Next.js's default not-found UI (which ships an
 * inline `body{background:#fff}` style) so no pure-white ever reaches the page.
 */
export default function NotFound() {
  return (
    <div className="atmosphere" data-variant="noir">
      <main className="wrap grid min-h-[100dvh] place-items-center py-20 text-center">
        <div>
          <p className="eyebrow mb-4">The Sausage Guy · Panglao</p>
          <h1
            className="font-display text-[clamp(2.5rem,9vw,5rem)] font-semibold leading-none"
            style={{ color: "var(--text-strong)" }}
          >
            Page not found
          </h1>
          <p
            className="mx-auto mt-5 max-w-md text-base"
            style={{ color: "var(--muted)" }}
          >
            That page isn&rsquo;t on the counter. Let&rsquo;s get you back to the
            good stuff.
          </p>
          <Link href={PANGLAO_PATH} className="btn btn-primary mt-8">
            Back to the shop
          </Link>
        </div>
      </main>
    </div>
  );
}
