import "server-only";
import { seedOrders, withSimulatedProgress } from "@teziko/data";
import type { Order } from "@teziko/types";

export interface OrdersResult {
  orders: Order[];
  liveCount: number;
  liveError: string | null;
}

/**
 * Seeded historical orders plus live demo orders read from the storefront's in-memory feed (MOCK).
 * If the storefront is unreachable the dashboard still renders with seeded data.
 */
export async function getAllOrders(): Promise<OrdersResult> {
  const base = (process.env.WEB_INTERNAL_URL ?? "http://localhost:3000").replace(/\/$/, "");
  const token =
    process.env.DEMO_FEED_TOKEN ??
    (process.env.NODE_ENV === "production" ? "" : "local-demo-feed-token");
  let live: Order[] = [];
  let liveError: string | null = null;
  if (token) {
    try {
      const res = await fetch(`${base}/api/demo-feed/orders`, {
        headers: { "x-demo-feed-token": token },
        cache: "no-store",
        signal: AbortSignal.timeout(2500),
      });
      if (!res.ok) throw new Error(`Feed returned ${res.status}`);
      live = ((await res.json()) as { orders: Order[] }).orders.map((o) =>
        withSimulatedProgress(o),
      );
    } catch (e) {
      liveError = e instanceof Error ? e.message : "Feed unavailable";
    }
  } else {
    liveError = "DEMO_FEED_TOKEN is not set";
  }
  const orders = [...live, ...seedOrders()].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return { orders, liveCount: live.length, liveError };
}
