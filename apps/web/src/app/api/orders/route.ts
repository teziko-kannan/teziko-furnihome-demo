import { makeOrderNumber, priceCart } from "@teziko/data";
import type { Order, OrderEvent } from "@teziko/types";
import { placeOrderSchema } from "@teziko/validators";
import { NextResponse } from "next/server";
import { getSession } from "@/lib/server/auth";
import { pushToFeed } from "@/lib/server/demo-feed";
import { guardedJson, jsonError } from "@/lib/server/http";
import { insertOrder } from "@/lib/server/store";

/**
 * Places a SIMULATED order. Totals are recomputed from the catalogue here; the request carries only
 * product ids, SKUs, quantities and a coupon code. No payment details are ever accepted.
 */
export async function POST(req: Request) {
  const r = await guardedJson(req, placeOrderSchema, {
    bucket: "orders",
    limit: 8,
    windowMs: 60_000,
  });
  if ("response" in r) return r.response;
  const input = r.data;

  const pricing = priceCart(input.lines, input.couponCode);
  if (pricing.lines.length === 0) return jsonError("Your cart has no valid items.", 422);
  const unavailable = pricing.lines.filter((l) => !l.available);
  if (unavailable.length) {
    return jsonError(`Not enough stock for: ${unavailable.map((l) => l.name).join(", ")}.`, 409);
  }
  // A coupon the client thought was valid but isn't (expired meanwhile, cart changed): ask the shopper to review.
  if (input.couponCode && pricing.couponError) {
    return jsonError(`Coupon ${input.couponCode}: ${pricing.couponError}`, 422);
  }

  const session = await getSession();
  const now = new Date();
  const failed = input.paymentMethod !== "cod" && input.simulateOutcome === "failure";
  const events: OrderEvent[] = failed
    ? [{ status: "payment-failed", at: now.toISOString(), note: "Simulated payment was declined" }]
    : [
        {
          status: "placed",
          at: now.toISOString(),
          note:
            input.paymentMethod === "cod"
              ? "Order placed, pay on delivery"
              : "Order placed and payment received (simulated)",
        },
      ];

  const order: Order = {
    id: crypto.randomUUID(),
    number: makeOrderNumber(now),
    email: (session?.email ?? input.email).toLowerCase(),
    customerName: input.address.fullName,
    createdAt: now.toISOString(),
    status: failed ? "payment-failed" : "placed",
    paymentMethod: input.paymentMethod,
    paymentStatus: failed ? "failed" : input.paymentMethod === "cod" ? "cod" : "paid",
    shippingAddress: { ...input.address, line2: input.address.line2 || undefined },
    pricing,
    events,
    demo: true,
  };

  // Every attempt reaches the admin payments feed; only successful orders are stored as customer orders.
  pushToFeed(order);
  try {
    if (!failed) await insertOrder(order);
  } catch {
    return jsonError("Could not save your order. Please try again.", 503);
  }

  return NextResponse.json({ ok: !failed, order }, { status: failed ? 402 : 201 });
}
