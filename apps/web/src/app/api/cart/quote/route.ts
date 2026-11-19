import { priceCart } from "@teziko/data";
import { quoteSchema } from "@teziko/validators";
import { NextResponse } from "next/server";
import { guardedJson } from "@/lib/server/http";

/** Prices a cart from the catalogue. Used by the cart drawer, cart page and checkout. */
export async function POST(req: Request) {
  const r = await guardedJson(req, quoteSchema, { bucket: "quote", limit: 120, windowMs: 60_000 });
  if ("response" in r) return r.response;
  return NextResponse.json({ ok: true, quote: priceCart(r.data.lines, r.data.couponCode) });
}
