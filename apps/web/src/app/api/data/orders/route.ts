import { canCancel } from "@teziko/data/orders";
import { NextResponse, type NextRequest } from "next/server";
import { getSession } from "@/lib/server/auth";
import { jsonError } from "@/lib/server/http";
import { getOrderByNumber, listOrdersByEmail, updateOrder } from "@/lib/server/store";
import { supabaseEnabled } from "@/lib/server/supabase";

/** Supabase adapter: list my orders, or look one up by number (+ email for guests). */
export async function GET(req: NextRequest) {
  if (!supabaseEnabled()) return jsonError("Supabase adapter is not configured", 501);
  const session = await getSession();
  const number = req.nextUrl.searchParams.get("number");
  if (number) {
    const order = await getOrderByNumber(number.toUpperCase());
    const email = (session?.email ?? req.nextUrl.searchParams.get("email") ?? "").toLowerCase();
    if (!order || order.email !== email) return jsonError("Order not found", 404);
    return NextResponse.json({ ok: true, order });
  }
  if (!session) return jsonError("Sign in to see your orders", 401);
  return NextResponse.json({ ok: true, orders: await listOrdersByEmail(session.email) });
}

/** Customers may only cancel their own orders, and only before shipping. */
export async function PATCH(req: Request) {
  if (!supabaseEnabled()) return jsonError("Supabase adapter is not configured", 501);
  const session = await getSession();
  if (!session) return jsonError("Sign in required", 401);
  const body = (await req.json().catch(() => null)) as { number?: string; status?: string } | null;
  if (!body?.number || body.status !== "cancelled")
    return jsonError("Only cancellation is supported", 422);
  const order = await getOrderByNumber(body.number);
  if (!order || order.email !== session.email) return jsonError("Order not found", 404);
  if (!canCancel(order.status)) return jsonError("This order can no longer be cancelled", 409);
  const next = {
    ...order,
    status: "cancelled" as const,
    events: [
      ...order.events,
      { status: "cancelled" as const, at: new Date().toISOString(), note: "Cancelled by customer" },
    ],
  };
  await updateOrder(next);
  return NextResponse.json({ ok: true, order: next });
}
