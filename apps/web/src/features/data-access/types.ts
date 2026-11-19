import type { CustomerProfile, Order } from "@teziko/types";

export const RETENTION_DAYS = 14;
export const RETENTION_MS = RETENTION_DAYS * 86400000;

/** A review written by a visitor in this demo (as opposed to seeded demo reviews). */
export interface UserReview {
  id: string;
  productId: string;
  author: string;
  rating: 1 | 2 | 3 | 4 | 5;
  title: string;
  body: string;
  createdAt: string;
}

/**
 * Persistence for shopper-generated data. Two interchangeable implementations:
 * - local: browser localStorage with a 14-day purge on load (default)
 * - supabase: server route handlers backed by Supabase tables with expires_at + pg_cron purge
 */
export interface DataAdapter {
  kind: "local" | "supabase";
  saveOrder(order: Order): Promise<void>;
  listOrders(email: string): Promise<Order[]>;
  getOrder(number: string, email?: string): Promise<Order | null>;
  updateOrder(order: Order): Promise<void>;
  getProfile(email: string): Promise<CustomerProfile | null>;
  saveProfile(profile: CustomerProfile): Promise<void>;
  listReviews(productId: string): Promise<UserReview[]>;
  addReview(review: UserReview): Promise<void>;
  /** Records a contact message / newsletter signup locally after the server accepted it. */
  recordSubmission(
    kind: "contact" | "newsletter",
    record: { id: string; createdAt: string } & Record<string, unknown>,
  ): Promise<void>;
  purgeExpired(): Promise<number>;
}
