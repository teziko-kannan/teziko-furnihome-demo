import { registerSchema } from "@teziko/validators";
import {
  DEMO_ACCOUNTS,
  SESSION_COOKIE,
  SESSION_TTL_SECONDS,
  signSession,
} from "@teziko/validators/session";
import { NextResponse } from "next/server";
import { authSecret, sessionCookieOptions } from "@/lib/server/auth";
import { guardedJson, jsonError } from "@/lib/server/http";

/**
 * MOCK registration: issues a customer session for any email. No password is stored on the server;
 * the profile itself lives in the data adapter (localStorage by default, deleted after 14 days).
 */
export async function POST(req: Request) {
  const r = await guardedJson(req, registerSchema, {
    bucket: "register",
    limit: 5,
    windowMs: 60_000,
  });
  if ("response" in r) return r.response;
  if (DEMO_ACCOUNTS.some((a) => a.email === r.data.email))
    return jsonError("That email is a demo account. Sign in instead.", 409);
  const token = await signSession(
    { email: r.data.email, name: r.data.name, role: "customer" },
    authSecret(),
  );
  const res = NextResponse.json({
    ok: true,
    user: { email: r.data.email, name: r.data.name, role: "customer" },
  });
  res.cookies.set(SESSION_COOKIE, token, { ...sessionCookieOptions, maxAge: SESSION_TTL_SECONDS });
  return res;
}
