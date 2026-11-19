import type { CustomerProfile, Order } from "@teziko/types";
import { RETENTION_MS, type DataAdapter, type UserReview } from "./types";

type Collection = "orders" | "profiles" | "reviews" | "contact" | "newsletter";
type Stamped = { createdAt: string };

const PREFIX = "tz-data:";

function read<T extends Stamped>(c: Collection): T[] {
  try {
    const raw = localStorage.getItem(PREFIX + c);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch {
    return [];
  }
}

function write<T extends Stamped>(c: Collection, rows: T[]) {
  try {
    localStorage.setItem(PREFIX + c, JSON.stringify(rows));
  } catch {
    // Storage full or blocked (private mode). The demo keeps working without persistence.
  }
}

const COLLECTIONS: Collection[] = ["orders", "profiles", "reviews", "contact", "newsletter"];

export const localAdapter: DataAdapter = {
  kind: "local",
  async saveOrder(order) {
    write("orders", [order, ...read<Order>("orders").filter((o) => o.number !== order.number)]);
  },
  async listOrders(email) {
    return read<Order>("orders").filter((o) => o.email === email.toLowerCase());
  },
  async getOrder(number, email) {
    const o = read<Order>("orders").find((x) => x.number === number.toUpperCase());
    if (!o || (email && o.email !== email.toLowerCase())) return null;
    return o;
  },
  async updateOrder(order) {
    write(
      "orders",
      read<Order>("orders").map((o) => (o.number === order.number ? order : o)),
    );
  },
  async getProfile(email) {
    return read<CustomerProfile>("profiles").find((p) => p.email === email.toLowerCase()) ?? null;
  },
  async saveProfile(profile) {
    write("profiles", [
      profile,
      ...read<CustomerProfile>("profiles").filter((p) => p.email !== profile.email),
    ]);
  },
  async listReviews(productId) {
    return read<UserReview>("reviews").filter((r) => r.productId === productId);
  },
  async addReview(review) {
    write("reviews", [review, ...read<UserReview>("reviews")]);
  },
  async recordSubmission(kind, record) {
    write(kind, [record, ...read<Stamped>(kind)].slice(0, 50));
  },
  async purgeExpired() {
    const cutoff = Date.now() - RETENTION_MS;
    let removed = 0;
    for (const c of COLLECTIONS) {
      const rows = read<Stamped>(c);
      const kept = rows.filter((r) => {
        const t = Date.parse(r.createdAt);
        return Number.isFinite(t) && t > cutoff;
      });
      removed += rows.length - kept.length;
      if (kept.length !== rows.length) write(c, kept);
    }
    return removed;
  },
};
