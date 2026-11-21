import { NextResponse } from "next/server";

/**
 * Fallback target for forms submitted without JavaScript. The body is ignored (never logged or
 * echoed); the visitor is sent back to the page they came from with a notice flag.
 */
export function POST(req: Request) {
  const base = new URL(req.url);
  let back = new URL("/", base);
  const ref = req.headers.get("referer");
  if (ref) {
    try {
      const r = new URL(ref);
      if (r.origin === base.origin) back = new URL(r.pathname, base);
    } catch {
      // Malformed referer: fall back to the homepage.
    }
  }
  back.searchParams.set("notice", "js-required");
  return NextResponse.redirect(back, 303);
}
