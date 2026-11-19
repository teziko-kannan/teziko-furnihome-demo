import type { CustomerProfile, Order } from "@teziko/types";
import type { DataAdapter, UserReview } from "./types";

async function json<T>(res: Response): Promise<T> {
  if (!res.ok) throw new Error(`Request failed (${res.status})`);
  return (await res.json()) as T;
}

/**
 * Supabase-backed adapter. The browser never talks to Supabase directly: every call goes through
 * route handlers that hold the service key server-side and scope reads to the session user.
 * Retention is enforced in the database (expires_at + daily pg_cron purge).
 */
export const remoteAdapter: DataAdapter = {
  kind: "supabase",
  async saveOrder() {
    // Orders are persisted by POST /api/orders when they are placed.
  },
  async listOrders() {
    const r = await json<{ orders: Order[] }>(
      await fetch("/api/data/orders", { cache: "no-store" }),
    );
    return r.orders;
  },
  async getOrder(number, email) {
    const qs = new URLSearchParams({ number, ...(email ? { email } : {}) });
    const res = await fetch(`/api/data/orders?${qs}`, { cache: "no-store" });
    if (res.status === 404) return null;
    return (await json<{ order: Order }>(res)).order;
  },
  async updateOrder(order) {
    await json(
      await fetch("/api/data/orders", {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ number: order.number, status: order.status }),
      }),
    );
  },
  async getProfile() {
    const res = await fetch("/api/data/profile", { cache: "no-store" });
    if (res.status === 404) return null;
    return (await json<{ profile: CustomerProfile }>(res)).profile;
  },
  async saveProfile(profile) {
    await json(
      await fetch("/api/data/profile", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(profile),
      }),
    );
  },
  async listReviews(productId) {
    return (
      await json<{ reviews: UserReview[] }>(
        await fetch(`/api/data/reviews?productId=${encodeURIComponent(productId)}`),
      )
    ).reviews;
  },
  async addReview(review) {
    await json(
      await fetch("/api/data/reviews", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(review),
      }),
    );
  },
  async recordSubmission() {
    // Contact and newsletter rows are inserted server-side by their route handlers.
  },
  async purgeExpired() {
    return 0;
  },
};
