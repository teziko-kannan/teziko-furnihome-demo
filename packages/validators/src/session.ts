import { z } from "zod";

/**
 * Signed demo session token: base64url(JSON payload) + "." + base64url(HMAC-SHA256).
 * Uses Web Crypto so it works in Next.js proxy (middleware) and route handlers alike.
 */
export const SESSION_COOKIE = "tz_session";
export const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7;

export const sessionSchema = z.object({
  email: z.email(),
  name: z.string().max(80),
  role: z.enum(["customer", "admin"]),
  exp: z.number().int(),
});
export type SessionPayload = z.infer<typeof sessionSchema>;

/** Fixed demo accounts. Passwords are public and shown on the login pages. */
export const DEMO_ACCOUNTS = [
  {
    email: "customer@demo.com",
    password: "demo1234",
    name: "Demo Customer",
    role: "customer" as const,
  },
  { email: "admin@demo.com", password: "admin1234", name: "Demo Admin", role: "admin" as const },
];

const enc = new TextEncoder();

function b64url(bytes: Uint8Array) {
  let s = "";
  for (const b of bytes) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromB64url(s: string) {
  const bin = atob(s.replace(/-/g, "+").replace(/_/g, "/"));
  return Uint8Array.from(bin, (c) => c.charCodeAt(0));
}

const DEV_SECRET = "teziko-local-dev-secret-not-for-production";

export function resolveSecret(secret: string | undefined) {
  if (secret && secret.length >= 16) return secret;
  return DEV_SECRET;
}

async function key(secret: string) {
  return crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

export async function signSession(
  payload: Omit<SessionPayload, "exp">,
  secret: string,
  ttl = SESSION_TTL_SECONDS,
) {
  const body: SessionPayload = { ...payload, exp: Math.floor(Date.now() / 1000) + ttl };
  const data = b64url(enc.encode(JSON.stringify(body)));
  const sig = await crypto.subtle.sign("HMAC", await key(secret), enc.encode(data));
  return `${data}.${b64url(new Uint8Array(sig))}`;
}

export async function verifySession(
  token: string | undefined,
  secret: string,
): Promise<SessionPayload | null> {
  if (!token) return null;
  const [data, sig] = token.split(".");
  if (!data || !sig) return null;
  try {
    const ok = await crypto.subtle.verify(
      "HMAC",
      await key(secret),
      fromB64url(sig),
      enc.encode(data),
    );
    if (!ok) return null;
    const parsed = sessionSchema.safeParse(JSON.parse(new TextDecoder().decode(fromB64url(data))));
    if (!parsed.success || parsed.data.exp < Date.now() / 1000) return null;
    return parsed.data;
  } catch {
    return null;
  }
}
