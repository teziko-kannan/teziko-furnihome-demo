import { resolveSecret, SESSION_COOKIE, verifySession } from "@teziko/validators/session";
import { NextResponse, type NextRequest } from "next/server";

/** First line of defence for account pages. Pages also re-check the session on the server. */
export async function proxy(req: NextRequest) {
  const session = await verifySession(
    req.cookies.get(SESSION_COOKIE)?.value,
    resolveSecret(process.env.AUTH_SECRET),
  );
  if (!session) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.search = `?next=${encodeURIComponent(req.nextUrl.pathname)}`;
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/account/:path*"],
};
