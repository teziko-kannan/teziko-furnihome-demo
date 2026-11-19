import type { Order, OrderEvent, OrderStatus } from "@teziko/types";

/** Demo fulfilment timeline: each stage unlocks after this many minutes from order creation. */
export const DEMO_TIMELINE: { status: OrderStatus; afterMinutes: number; note: string }[] = [
  { status: "placed", afterMinutes: 0, note: "Order placed" },
  { status: "confirmed", afterMinutes: 1, note: "Payment confirmed and order accepted" },
  { status: "packed", afterMinutes: 3, note: "Packed at our Bhiwandi warehouse" },
  { status: "shipped", afterMinutes: 6, note: "Handed to delivery partner" },
  { status: "out-for-delivery", afterMinutes: 10, note: "Out for delivery" },
  { status: "delivered", afterMinutes: 15, note: "Delivered" },
];

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  placed: "Placed",
  confirmed: "Confirmed",
  packed: "Packed",
  shipped: "Shipped",
  "out-for-delivery": "Out for delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
  "payment-failed": "Payment failed",
};

const terminal: OrderStatus[] = ["cancelled", "payment-failed"];

/**
 * Advances an order along the simulated timeline based on elapsed time. Orders explicitly set
 * by an admin (events beyond the timeline) or in a terminal state are returned unchanged.
 */
export function withSimulatedProgress(order: Order, now = Date.now()): Order {
  if (terminal.includes(order.status) || order.status === "delivered") return order;
  const created = Date.parse(order.createdAt);
  const elapsedMin = (now - created) / 60000;
  const currentIndex = DEMO_TIMELINE.findIndex((s) => s.status === order.status);
  const events: OrderEvent[] = [...order.events];
  let status: OrderStatus = order.status;
  DEMO_TIMELINE.forEach((stage, i) => {
    if (i > currentIndex && elapsedMin >= stage.afterMinutes) {
      events.push({
        status: stage.status,
        at: new Date(created + stage.afterMinutes * 60000).toISOString(),
        note: stage.note,
      });
      status = stage.status;
    }
  });
  return status === order.status ? order : { ...order, status, events };
}

export function makeOrderNumber(date: Date, rand: () => number = Math.random) {
  const y = String(date.getUTCFullYear()).slice(2);
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const d = String(date.getUTCDate()).padStart(2, "0");
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const suffix = Array.from(
    { length: 4 },
    () => alphabet[Math.floor(rand() * alphabet.length)],
  ).join("");
  return `TZ-${y}${m}${d}-${suffix}`;
}

/** Customers can cancel until the order ships. */
export function canCancel(status: OrderStatus) {
  return status === "placed" || status === "confirmed" || status === "packed";
}
