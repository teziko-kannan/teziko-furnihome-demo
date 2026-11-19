import { newsletterSchema } from "@teziko/validators";
import { NextResponse } from "next/server";
import { guardedJson, jsonError } from "@/lib/server/http";
import { insertRow } from "@/lib/server/store";

/** MOCK newsletter signup: nothing is ever emailed. */
export async function POST(req: Request) {
  const r = await guardedJson(req, newsletterSchema, {
    bucket: "newsletter",
    limit: 5,
    windowMs: 10 * 60_000,
  });
  if ("response" in r) return r.response;
  const id = crypto.randomUUID();
  try {
    await insertRow("newsletter_subscribers", { id, email: r.data.email });
  } catch {
    return jsonError("We couldn't save your signup. Please try again.", 503);
  }
  return NextResponse.json({ ok: true, id });
}
