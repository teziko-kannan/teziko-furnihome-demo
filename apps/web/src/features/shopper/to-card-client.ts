import type { Product } from "@teziko/types";
import type { CardProduct } from "../catalog/card-data";

/** Minimal card shape for add-to-cart from a full product on the client (no catalogue import). */
export function toCardClient(
  p: Product,
): Pick<CardProduct, "id" | "slug" | "name" | "kind" | "price" | "mrp" | "colours"> {
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    kind: p.kind,
    price: p.price,
    mrp: p.mrp,
    colours: p.variants.map((v) => ({
      name: v.colour.name,
      hex: v.colour.hex,
      sku: v.sku,
      stock: v.stock <= 0 ? "out-of-stock" : v.stock <= 5 ? "low-stock" : "in-stock",
      label: [v.colour.name, v.size, v.material].filter(Boolean).join(" · "),
      priceDelta: v.priceDelta,
    })),
  };
}
