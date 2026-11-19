import "server-only";
import type { CustomerProfile, Order } from "@teziko/types";
import { getSupabase } from "./supabase";

/**
 * Server-side persistence for the optional Supabase adapter. Every table stores the record as JSONB
 * alongside indexed columns; `expires_at` defaults to now() + 14 days and pg_cron purges daily.
 * All functions are no-ops (or return null) when Supabase is not configured.
 */

export async function insertOrder(order: Order) {
  const db = getSupabase();
  if (!db) return;
  const { error } = await db.from("orders").insert({
    number: order.number,
    email: order.email,
    status: order.status,
    data: order,
    created_at: order.createdAt,
  });
  if (error) throw new Error(error.message);
}

export async function listOrdersByEmail(email: string): Promise<Order[]> {
  const db = getSupabase();
  if (!db) return [];
  const { data, error } = await db
    .from("orders")
    .select("data")
    .eq("email", email)
    .order("created_at", { ascending: false })
    .limit(50);
  if (error) throw new Error(error.message);
  return (data ?? []).map((r) => r.data as Order);
}

export async function getOrderByNumber(number: string): Promise<Order | null> {
  const db = getSupabase();
  if (!db) return null;
  const { data, error } = await db.from("orders").select("data").eq("number", number).maybeSingle();
  if (error) throw new Error(error.message);
  return (data?.data as Order | undefined) ?? null;
}

export async function updateOrder(order: Order) {
  const db = getSupabase();
  if (!db) return;
  const { error } = await db
    .from("orders")
    .update({ status: order.status, data: order })
    .eq("number", order.number);
  if (error) throw new Error(error.message);
}

export async function getProfile(email: string): Promise<CustomerProfile | null> {
  const db = getSupabase();
  if (!db) return null;
  const { data, error } = await db.from("profiles").select("data").eq("email", email).maybeSingle();
  if (error) throw new Error(error.message);
  return (data?.data as CustomerProfile | undefined) ?? null;
}

export async function upsertProfile(profile: CustomerProfile) {
  const db = getSupabase();
  if (!db) return;
  const { error } = await db.from("profiles").upsert({ email: profile.email, data: profile });
  if (error) throw new Error(error.message);
}

export async function listReviews(productId: string) {
  const db = getSupabase();
  if (!db) return [];
  const { data, error } = await db
    .from("reviews")
    .select("data")
    .eq("product_id", productId)
    .order("created_at", { ascending: false })
    .limit(50);
  if (error) throw new Error(error.message);
  return (data ?? []).map((r) => r.data as Record<string, unknown>);
}

export async function insertRow(
  table: "reviews" | "contact_messages" | "newsletter_subscribers",
  row: Record<string, unknown>,
) {
  const db = getSupabase();
  if (!db) return;
  const { error } = await db.from(table).insert(row);
  if (error) throw new Error(error.message);
}
