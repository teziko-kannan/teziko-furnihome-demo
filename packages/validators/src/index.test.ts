import { describe, expect, it } from "vitest";
import { addressSchema, contactSchema, placeOrderSchema } from "./index";

const address = {
  fullName: "Ananya Rao",
  phone: "9876543210",
  line1: "12, 4th Cross, Indiranagar",
  city: "Bengaluru",
  state: "Karnataka",
  pincode: "560038",
};

describe("validators", () => {
  it("accepts a valid Indian address", () => {
    expect(addressSchema.safeParse({ ...address, label: "Home" }).success).toBe(true);
  });

  it("rejects a bad PIN code", () => {
    expect(addressSchema.safeParse({ ...address, label: "Home", pincode: "012345" }).success).toBe(
      false,
    );
  });

  it("rejects filled honeypot", () => {
    const r = contactSchema.safeParse({
      name: "Bot",
      email: "bot@example.com",
      topic: "other",
      message: "Buy cheap things now please",
      website: "http://spam",
    });
    expect(r.success).toBe(false);
  });

  it("strips client-sent amounts from order payloads", () => {
    const r = placeOrderSchema.safeParse({
      email: "customer@demo.com",
      address,
      lines: [{ productId: "p1", sku: "p1-a", quantity: 1 }],
      paymentMethod: "upi",
      simulateOutcome: "success",
      total: 1,
    });
    expect(r.success).toBe(true);
    expect(r.success && "total" in r.data).toBe(false);
  });
});

import { signSession, verifySession } from "./session";

describe("session", () => {
  it("round-trips and rejects tampering", async () => {
    const t = await signSession(
      { email: "admin@demo.com", name: "A", role: "admin" },
      "x".repeat(32),
    );
    expect((await verifySession(t, "x".repeat(32)))?.role).toBe("admin");
    expect(await verifySession(t, "y".repeat(32))).toBeNull();
    const [data, sig] = t.split(".");
    const forged = Buffer.from(
      JSON.stringify({ email: "a@b.co", name: "x", role: "admin", exp: 9e9 }),
    ).toString("base64url");
    expect(await verifySession(`${forged}.${sig}`, "x".repeat(32))).toBeNull();
    expect(data).toBeTruthy();
  });
});
