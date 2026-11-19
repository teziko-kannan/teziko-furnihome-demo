import { contactSchema } from "@teziko/validators";
import { NextResponse } from "next/server";
import { guardedJson, jsonError } from "@/lib/server/http";
import { insertRow } from "@/lib/server/store";

/** MOCK contact form: validated, rate-limited and honeypot-protected. No email is sent. */
export async function POST(req: Request) {
  const r = await guardedJson(req, contactSchema, {
    bucket: "contact",
    limit: 4,
    windowMs: 10 * 60_000,
  });
  if ("response" in r) return r.response;
  const id = crypto.randomUUID();
  const { website: _hp, ...data } = r.data;
  try {
    await insertRow("contact_messages", { id, ...data });
  } catch {
    return jsonError("We couldn't send your message. Please try again.", 503);
  }
  return NextResponse.json({ ok: true, id });
}
