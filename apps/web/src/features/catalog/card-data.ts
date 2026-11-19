import { brandBySlug, categoryBySlug, productStockStatus, stockStatus } from "@teziko/data";
import type { Department, Product, ProductKind, ProductTag, StockStatus } from "@teziko/types";

/** Serializable product summary passed from Server Components to client cards. */
export interface CardProduct {
  id: string;
  slug: string;
  name: string;
  brandName: string;
  subcategoryName: string;
  department: Department;
  kind: ProductKind;
  price: number;
  mrp: number;
  rating: number;
  reviewCount: number;
  imageCount: number;
  tags: ProductTag[];
  stock: StockStatus;
  colours: {
    name: string;
    hex: string;
    sku: string;
    stock: StockStatus;
    label: string;
    priceDelta: number;
  }[];
}

export function toCard(p: Product): CardProduct {
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    brandName: brandBySlug.get(p.brand)?.name ?? p.brand,
    subcategoryName: categoryBySlug.get(p.subcategory)?.name ?? "",
    department: p.department,
    kind: p.kind,
    price: p.price,
    mrp: p.mrp,
    rating: p.rating,
    reviewCount: p.reviewCount,
    imageCount: p.imageCount,
    tags: p.tags,
    stock: productStockStatus(p),
    colours: p.variants.map((v) => ({
      name: v.colour.name,
      hex: v.colour.hex,
      sku: v.sku,
      stock: stockStatus(v.stock),
      label: [v.colour.name, v.size, v.material].filter(Boolean).join(" · "),
      priceDelta: v.priceDelta,
    })),
  };
}
