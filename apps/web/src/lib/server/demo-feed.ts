import "server-only";
import type { Order } from "@teziko/types";

const MAX = 200;
const TTL_MS = 14 * 86400000;

/**
 * MOCK: in-memory feed of orders placed on this storefront instance, so the admin app can show
 * "live" demo orders without a database. Lost on restart; not shared across instances.
 */
const feed: Order[] = [];

export function pushToFeed(order: Order) {
  feed.unshift(order);
  if (feed.length > MAX) feed.length = MAX;
}

export function readFeed() {
  const cutoff = Date.now() - TTL_MS;
  return feed.filter((o) => Date.parse(o.createdAt) > cutoff);
}
