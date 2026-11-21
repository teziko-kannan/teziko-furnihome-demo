"use client";

/**
 * DEMO: accounts created with "Register" are kept in this browser (same 14-day retention as other
 * demo data). Passwords are never stored: only a salted PBKDF2-SHA256 hash. Signing in on another
 * browser or device is not possible, and that is documented in docs/mock-vs-real.md.
 */
const KEY = "tz-data:accounts";
const ITERATIONS = 150_000;

interface LocalAccount {
  email: string;
  name: string;
  salt: string;
  hash: string;
  createdAt: string;
}

function read(): LocalAccount[] {
  try {
    const raw = localStorage.getItem(KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? (parsed as LocalAccount[]) : [];
  } catch {
    return [];
  }
}

function write(rows: LocalAccount[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(rows));
  } catch {
    // Storage blocked: the account simply won't persist in this browser.
  }
}

const toHex = (buf: ArrayBuffer | Uint8Array) =>
  [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");

async function derive(password: string, saltHex: string) {
  const salt = Uint8Array.from(saltHex.match(/.{2}/g)!.map((h) => parseInt(h, 16)));
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"],
  );
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", hash: "SHA-256", salt, iterations: ITERATIONS },
    key,
    256,
  );
  return toHex(bits);
}

export function localAccountExists(email: string) {
  return read().some((a) => a.email === email.toLowerCase());
}

export async function saveLocalAccount(email: string, name: string, password: string) {
  const salt = toHex(crypto.getRandomValues(new Uint8Array(16)));
  const hash = await derive(password, salt);
  const rows = read().filter((a) => a.email !== email.toLowerCase());
  write([
    { email: email.toLowerCase(), name, salt, hash, createdAt: new Date().toISOString() },
    ...rows,
  ]);
}

/** Returns the account name when the password matches, otherwise null. */
export async function verifyLocalAccount(email: string, password: string): Promise<string | null> {
  const acc = read().find((a) => a.email === email.toLowerCase());
  if (!acc) return null;
  const hash = await derive(password, acc.salt);
  // Constant-time-ish comparison; this runs locally, so timing is not a real attack surface here.
  let diff = hash.length ^ acc.hash.length;
  for (let i = 0; i < hash.length; i++) diff |= hash.charCodeAt(i) ^ (acc.hash.charCodeAt(i) ?? 0);
  return diff === 0 ? acc.name : null;
}
