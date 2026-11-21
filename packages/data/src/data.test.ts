import { describe, expect, it } from "vitest";
import { ART_KINDS, parseArtFile, renderArt } from "./art";
import {
  brands,
  categories,
  categoryBySlug,
  listProducts,
  parseFilters,
  priceCart,
  productBySlug,
  products,
  reviews,
  rooms,
  seedOrders,
  withSimulatedProgress,
} from "./index";

const byName = (name: string) => products.find((p) => p.name === name)!;

describe("catalogue", () => {
  it("meets the minimum size requirements", () => {
    expect(products.length).toBeGreaterThanOrEqual(60);
    expect(categories.filter((c) => c.parent).length).toBeGreaterThanOrEqual(12);
    expect(brands.length).toBeGreaterThanOrEqual(8);
    expect(reviews.length).toBeGreaterThanOrEqual(100);
  });

  it("has unique ids, slugs and SKUs", () => {
    expect(new Set(products.map((p) => p.id)).size).toBe(products.length);
    expect(new Set(products.map((p) => p.slug)).size).toBe(products.length);
    const skus = products.flatMap((p) => p.variants.map((v) => v.sku));
    expect(new Set(skus).size).toBe(skus.length);
  });

  it("every product is well formed", () => {
    for (const p of products) {
      expect(p.imageCount, p.name).toBeGreaterThanOrEqual(3);
      expect(p.imageCount, p.name).toBeLessThanOrEqual(5);
      expect(p.mrp, p.name).toBeGreaterThanOrEqual(p.price);
      expect(p.variants.length, p.name).toBeGreaterThan(0);
      expect(categoryBySlug.get(p.subcategory)?.parent, p.name).toBe(p.category);
      expect(p.rating).toBeGreaterThan(0);
      expect(ART_KINDS).toContain(p.kind);
    }
  });

  it("every seeded review is labelled demo", () => {
    expect(reviews.every((r) => r.demo === true)).toBe(true);
  });

  it("room inspiration references real products", () => {
    for (const room of rooms)
      for (const slug of room.productSlugs) expect(productBySlug.has(slug), slug).toBe(true);
  });
});

describe("pricing", () => {
  const sofa = byName("Arden 3-Seater Fabric Sofa");
  const mixer = byName("Rasoika 750 W Mixer Grinder");
  const tv = byName('Lumora 55" 4K QLED Google TV');

  it("sums lines and gives free shipping above the threshold", () => {
    const b = priceCart([{ productId: sofa.id, sku: sofa.variants[0]!.sku, quantity: 2 }]);
    expect(b.subtotal).toBe(sofa.price * 2);
    expect(b.shipping).toBe(0);
    expect(b.total).toBe(sofa.price * 2);
  });

  it("charges standard shipping for small non-bulky orders", () => {
    const b = priceCart([{ productId: mixer.id, sku: mixer.variants[0]!.sku, quantity: 1 }]);
    expect(b.shipping).toBe(149);
    expect(b.total).toBe(mixer.price + 149);
  });

  it("applies WELCOME10 with its cap", () => {
    const b = priceCart(
      [{ productId: sofa.id, sku: sofa.variants[0]!.sku, quantity: 1 }],
      "welcome10",
    );
    expect(b.couponCode).toBe("WELCOME10");
    expect(b.couponDiscount).toBe(2000);
  });

  it("rejects a coupon below its minimum", () => {
    const b = priceCart(
      [{ productId: mixer.id, sku: mixer.variants[0]!.sku, quantity: 1 }],
      "FESTIVE15",
    );
    expect(b.couponDiscount).toBe(0);
    expect(b.couponError).toMatch(/more to use this code/);
  });

  it("rejects expired and unknown coupons", () => {
    const line = [{ productId: sofa.id, sku: sofa.variants[0]!.sku, quantity: 1 }];
    expect(priceCart(line, "MONSOON20").couponError).toMatch(/expired/);
    expect(priceCart(line, "NOPE").couponError).toMatch(/isn't valid/);
  });

  it("restricts department coupons", () => {
    const b = priceCart(
      [
        { productId: sofa.id, sku: sofa.variants[0]!.sku, quantity: 1 },
        { productId: tv.id, sku: tv.variants[0]!.sku, quantity: 1 },
      ],
      "APPLIANCE5",
    );
    expect(b.couponDiscount).toBe(Math.round(Math.min(tv.price * 0.05, 3000)));
  });

  it("computes GST included in the price", () => {
    const b = priceCart([{ productId: sofa.id, sku: sofa.variants[0]!.sku, quantity: 1 }]);
    expect(b.gstIncluded).toBe(Math.round((sofa.price * 18) / 118));
  });

  it("clamps quantities and ignores unknown products", () => {
    const b = priceCart([
      { productId: sofa.id, sku: sofa.variants[0]!.sku, quantity: 99 },
      { productId: "nope", sku: "x", quantity: 1 },
    ]);
    expect(b.lines).toHaveLength(1);
    expect(b.lines[0]!.quantity).toBe(10);
  });
});

describe("listing", () => {
  it("parses and applies URL filters", () => {
    const f = parseFilters({ brand: "lumora", sort: "price-asc", min: "20000" });
    const r = listProducts({ department: "appliances" }, f);
    expect(r.items.every((p) => p.brand === "lumora" && p.price >= 20000)).toBe(true);
    const prices = r.items.map((p) => p.price);
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
  });

  it("ignores invalid sort values", () => {
    expect(parseFilters({ sort: "drop table" }).sort).toBeUndefined();
  });

  it("finds products by search", () => {
    const r = listProducts({}, parseFilters({ q: "sofa" }));
    expect(r.total).toBeGreaterThan(3);
  });
});

describe("orders", () => {
  it("advances the simulated timeline", () => {
    const [o] = seedOrders();
    const fresh = { ...o!, status: "placed" as const, createdAt: new Date(0).toISOString() };
    expect(withSimulatedProgress(fresh, 16 * 60000).status).toBe("delivered");
    expect(withSimulatedProgress(fresh, 4 * 60000).status).toBe("packed");
  });
});

describe("art", () => {
  it("renders every kind as SVG", () => {
    for (const k of ART_KINDS)
      for (let v = 0; v < 5; v++) expect(renderArt(k, "8c8c88", v)).toMatch(/^<svg/);
  });

  it("parses only safe file names", () => {
    expect(parseArtFile("2-8c8c88.svg")).toEqual({ view: 2, hex: "8c8c88" });
    expect(parseArtFile("../../etc.svg")).toBeNull();
    expect(parseArtFile("9-8c8c88.svg")).toBeNull();
  });
});

import { relatedProducts as related } from "./lib/queries";
import { checkAddressConsistency, deliveryEstimate, statesForPincode } from "./lib/pincode";
import { scoreSearch } from "./lib/search";

describe("search synonyms", () => {
  it("finds all refrigerators for 'fridge' and 'refrigerator' alike", () => {
    const a = listProducts({}, parseFilters({ q: "fridge" })).total;
    const b = listProducts({}, parseFilters({ q: "refrigerator" })).total;
    expect(a).toBe(4);
    expect(b).toBe(4);
  });
  it("does not match a study desk for 'fridge'", () => {
    expect(
      scoreSearch("fridge", {
        name: "Focus Study Desk",
        keywords: "Study & Office desk Kosha Works",
      }),
    ).toBeLessThanOrEqual(0);
  });
  it("'ac' does not match words that merely contain the letters", () => {
    const names = listProducts({}, parseFilters({ q: "ac" })).items.map((p) => p.kind);
    expect(names.every((k) => k === "air-conditioner")).toBe(true);
  });
});

describe("pincode", () => {
  it("maps PINs to states and rejects fake ones", () => {
    expect(statesForPincode("110001")).toContain("Delhi");
    expect(statesForPincode("737101")[0]).toBe("Sikkim");
    expect(statesForPincode("999999")).toEqual([]);
  });
  it("catches PIN/state/city mismatches", () => {
    expect(checkAddressConsistency({ pincode: "110001", state: "Kerala", city: "Mumbai" }).ok).toBe(
      false,
    );
    expect(checkAddressConsistency({ pincode: "400001", state: "Kerala", city: "Mumbai" }).ok).toBe(
      false,
    );
    expect(
      checkAddressConsistency({ pincode: "400001", state: "Maharashtra", city: "Mumbai" }).ok,
    ).toBe(true);
  });
  it("gives farther states longer delivery windows", () => {
    expect(deliveryEstimate("400001", [5, 10])!.days[0]).toBeLessThan(
      deliveryEstimate("793001", [5, 10])!.days[0],
    );
  });
});

describe("related products", () => {
  it("only suggests the same or complementary categories for a sofa", () => {
    const sofa = productBySlug.get("arden-3-seater-fabric-sofa")!;
    const allowed = ["sofas", "armchairs", "tables", "rugs", "cushions-throws", "lighting"];
    expect(related(sofa).every((p) => allowed.includes(p.subcategory))).toBe(true);
  });
  it("puts wardrobes in their own category", () => {
    expect(
      products.filter((p) => p.kind === "wardrobe").every((p) => p.subcategory === "wardrobes"),
    ).toBe(true);
  });
});
