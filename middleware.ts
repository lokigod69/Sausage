import { NextResponse, type NextRequest } from "next/server";

/**
 * Keep internal hosts out of search results.
 *
 * ops.thesausageguy.shop is for the shop's own use and must not be indexed.
 * Two belts here, because one is not enough:
 *
 *   - `X-Robots-Tag: noindex, nofollow` on every response. This is the header
 *     form of the meta tag and is what actually removes a page from an index;
 *     unlike robots.txt it works on a URL that has already been crawled or
 *     linked from elsewhere.
 *   - A disallow-everything robots.txt for that host, so well-behaved
 *     crawlers do not fetch it in the first place.
 *
 * robots.txt alone would NOT be sufficient: disallowing a path only stops the
 * crawl, and a URL that Google learns about from a link can still appear in
 * results as a bare listing. The header is the part that does the work.
 *
 * Note this only covers hosts served by THIS deployment. If ops.* is a
 * separate app, it needs the same treatment in its own codebase.
 */
const PRIVATE_HOST_PREFIXES = ["ops.", "staging.", "preview."];

function isPrivateHost(host: string): boolean {
  const name = host.toLowerCase().split(":")[0];
  return PRIVATE_HOST_PREFIXES.some((prefix) => name.startsWith(prefix));
}

export function middleware(request: NextRequest) {
  const host = request.headers.get("host") ?? "";

  if (!isPrivateHost(host)) return NextResponse.next();

  if (request.nextUrl.pathname === "/robots.txt") {
    return new NextResponse("User-agent: *\nDisallow: /\n", {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "X-Robots-Tag": "noindex, nofollow",
      },
    });
  }

  const response = NextResponse.next();
  response.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
  return response;
}

export const config = {
  // Everything except Next's internals and static files — the header is
  // meaningless on a chunk of JavaScript and costs a middleware invocation.
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
