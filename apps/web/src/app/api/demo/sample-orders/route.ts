import { DEMO_TIMELINE, makeOrderNumber, priceCart, productBySlug } from "@teziko/data";
import type { Order } from "@teziko/types";
import { NextResponse } from "next/server";
import { getSession } from "@/lib/server/auth";
import { jsonError } from "@/lib/server/http";

/** Builds two sample orders for the published demo customer so account pages have content. */
export async function POST() {
  const session = await getSession();
  if (session?.email !== "customer@demo.com")
    return jsonError("Only available for the demo customer", 403);
  const now = Date.now();
  const make = (slugs: string[], minutesAgo: number, coupon: string | null): Order => {
    const created = new Date(now - minutesAgo * 60000);
    const lines = slugs.map((s) => {
      const p = productBySlug.get(s)!;
      return { productId: p.id, sku: p.variants[0]!.sku, quantity: 1 };
    });
    const reached = DEMO_TIMELINE.filter((t) => t.afterMinutes <= minutesAgo);
    const last = reached[reached.length - 1]!;
    return {
      id: crypto.randomUUID(),
      number: makeOrderNumber(created),
      email: session.email,
      customerName: session.name,
      createdAt: created.toISOString(),
      status: last.status,
      paymentMethod: "upi",
      paymentStatus: "paid",
      shippingAddress: {
        fullName: session.name,
        phone: "9876543210",
        line1: "12, 4th Cross, Indiranagar",
        city: "Bengaluru",
        state: "Karnataka",
        pincode: "560038",
      },
      pricing: priceCart(lines, coupon, created),
      events: reached.map((t) => ({
        status: t.status,
        at: new Date(created.getTime() + t.afterMinutes * 60000).toISOString(),
        note: t.note,
      })),
      demo: true,
    };
  };
  return NextResponse.json({
    ok: true,
    orders: [
      make(["ergopro-mesh-office-chair", "minimal-wall-clock-40-cm"], 3 * 24 * 60, "WELCOME10"),
      make(["deepa-ceramic-table-lamp"], 4, null),
    ],
  });
}
