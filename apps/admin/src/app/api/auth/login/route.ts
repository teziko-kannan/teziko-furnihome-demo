import { loginSchema } from "@teziko/validators";
import {
  DEMO_ACCOUNTS,
  SESSION_COOKIE,
  SESSION_TTL_SECONDS,
  signSession,
} from "@teziko/validators/session";
import { NextResponse } from "next/server";
import { authSecret } from "@/lib/auth";

const attempts = new Map<string, { n: number; reset: number }>();

/** Admin demo login: only the published admin demo account is accepted. */
export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  const now = Date.now();
  const a = attempts.get(ip);
  if (a && a.reset > now && a.n >= 10)
    return NextResponse.json(
      { ok: false, error: "Too many attempts. Try again in a minute." },
      { status: 429 },
    );
  attempts.set(
    ip,
    a && a.reset > now ? { n: a.n + 1, reset: a.reset } : { n: 1, reset: now + 60_000 },
  );

  const parsed = loginSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success)
    return NextResponse.json(
      { ok: false, error: "Enter a valid email and password." },
      { status: 422 },
    );
  const account = DEMO_ACCOUNTS.find(
    (x) =>
      x.role === "admin" && x.email === parsed.data.email && x.password === parsed.data.password,
  );
  if (!account)
    return NextResponse.json(
      { ok: false, error: "Invalid admin credentials. Use the demo admin login shown." },
      { status: 401 },
    );

  const token = await signSession(
    { email: account.email, name: account.name, role: "admin" },
    authSecret(),
  );
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });
  return res;
}
