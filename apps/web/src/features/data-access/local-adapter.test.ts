import type { Order } from "@teziko/types";
import { beforeEach, describe, expect, it } from "vitest";
import { localAdapter } from "./local-adapter";

const order = (number: string, daysAgo: number) =>
  ({
    number,
    email: "customer@demo.com",
    createdAt: new Date(Date.now() - daysAgo * 86400000).toISOString(),
  }) as Order;

describe("local adapter", () => {
  beforeEach(() => localStorage.clear());

  it("stores and reads orders scoped by email", async () => {
    await localAdapter.saveOrder(order("TZ-261117-AAAA", 0));
    expect(await localAdapter.listOrders("customer@demo.com")).toHaveLength(1);
    expect(await localAdapter.listOrders("someone@else.com")).toHaveLength(0);
    expect(await localAdapter.getOrder("tz-261117-aaaa", "someone@else.com")).toBeNull();
  });

  it("purges records older than 14 days", async () => {
    await localAdapter.saveOrder(order("TZ-261101-OLD1", 15));
    await localAdapter.saveOrder(order("TZ-261117-NEW1", 1));
    await localAdapter.addReview({
      id: "r",
      productId: "p001",
      author: "A",
      rating: 5,
      title: "t",
      body: "b",
      createdAt: new Date(Date.now() - 20 * 86400000).toISOString(),
    });
    expect(await localAdapter.purgeExpired()).toBe(2);
    const left = await localAdapter.listOrders("customer@demo.com");
    expect(left.map((o) => o.number)).toEqual(["TZ-261117-NEW1"]);
  });

  it("survives corrupted storage", async () => {
    localStorage.setItem("tz-data:orders", "{not json");
    expect(await localAdapter.listOrders("customer@demo.com")).toEqual([]);
  });
});
