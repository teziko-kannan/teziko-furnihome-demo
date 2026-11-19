import { resolveSecret, SESSION_COOKIE, verifySession } from "@teziko/validators/session";
import { NextResponse, type NextRequest } from "next/server";

/** Every admin route requires an admin session. Pages re-check server-side via requireAdmin(). */
export async function proxy(req: NextRequest) {
  const session = await verifySession(
    req.cookies.get(SESSION_COOKIE)?.value,
    resolveSecret(process.env.AUTH_SECRET),
  );
  if (session?.role === "admin") return NextResponse.next();
  const url = req.nextUrl.clone();
  url.pathname = "/login";
  url.search = "";
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!login|api/auth|media|_next|favicon.ico).*)"],
};
