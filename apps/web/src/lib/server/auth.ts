import "server-only";
import {
  resolveSecret,
  SESSION_COOKIE,
  verifySession,
  type SessionPayload,
} from "@teziko/validators/session";
import { cookies } from "next/headers";

export const authSecret = () => resolveSecret(process.env.AUTH_SECRET);

/** Reads and verifies the session cookie in Server Components and route handlers. */
export async function getSession(): Promise<SessionPayload | null> {
  const store = await cookies();
  return verifySession(store.get(SESSION_COOKIE)?.value, authSecret());
}

export const sessionCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
};
