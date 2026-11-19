import { loginSchema } from "@teziko/validators";
import {
  DEMO_ACCOUNTS,
  SESSION_COOKIE,
  SESSION_TTL_SECONDS,
  signSession,
} from "@teziko/validators/session";
import { NextResponse } from "next/server";
import { authSecret, sessionCookieOptions } from "@/lib/server/auth";
import { guardedJson, jsonError } from "@/lib/server/http";

/** Demo login. Only the published demo accounts can sign in with a password. */
export async function POST(req: Request) {
  const r = await guardedJson(req, loginSchema, { bucket: "login", limit: 10, windowMs: 60_000 });
  if ("response" in r) return r.response;
  const account = DEMO_ACCOUNTS.find(
    (a) => a.email === r.data.email && a.password === r.data.password,
  );
  if (!account)
    return jsonError(
      "Email or password is incorrect. Use the demo credentials shown on this page.",
      401,
    );
  // The storefront only issues customer sessions; admins sign in on the admin app.
  const role = "customer" as const;
  const token = await signSession({ email: account.email, name: account.name, role }, authSecret());
  const res = NextResponse.json({
    ok: true,
    user: { email: account.email, name: account.name, role },
  });
  res.cookies.set(SESSION_COOKIE, token, { ...sessionCookieOptions, maxAge: SESSION_TTL_SECONDS });
  return res;
}
