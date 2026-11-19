import type { Product, Review } from "@teziko/types";
import { buildProduct } from "./build";
import { appliances } from "./products-appliances";
import { decor } from "./products-decor";
import { furniture } from "./products-furniture";
import { generateReviews } from "./reviews";

const base = [...furniture, ...appliances, ...decor].map(buildProduct);

export const reviews: Review[] = generateReviews(base);

const reviewsByProduct = new Map<string, Review[]>();
for (const r of reviews) {
  const list = reviewsByProduct.get(r.productId) ?? [];
  list.push(r);
  reviewsByProduct.set(r.productId, list);
}

/** Final catalogue. Ratings and counts are derived from the seeded demo reviews. */
export const products: Product[] = base.map((p) => {
  const list = reviewsByProduct.get(p.id) ?? [];
  const avg = list.length ? list.reduce((s, r) => s + r.rating, 0) / list.length : 0;
  return { ...p, rating: Math.round(avg * 10) / 10, reviewCount: list.length };
});

export const productById = new Map(products.map((p) => [p.id, p]));
export const productBySlug = new Map(products.map((p) => [p.slug, p]));

export function getReviewsForProduct(productId: string) {
  return [...(reviewsByProduct.get(productId) ?? [])].sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt),
  );
}
