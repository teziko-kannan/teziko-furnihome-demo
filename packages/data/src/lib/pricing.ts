import type {
  CartLine,
  Coupon,
  PriceBreakdown,
  PricedLine,
  Product,
  ProductVariant,
} from "@teziko/types";
import { productById } from "../catalog";
import { couponByCode } from "../catalog/marketing";

export const FREE_SHIPPING_THRESHOLD = 4999;
export const STANDARD_SHIPPING = 149;
export const BULKY_SHIPPING = 499;
export const MAX_QTY_PER_LINE = 10;

export function getVariant(product: Product, sku: string): ProductVariant | undefined {
  return product.variants.find((v) => v.sku === sku);
}

export function variantPrice(product: Product, variant?: ProductVariant) {
  const delta = variant?.priceDelta ?? 0;
  return { price: product.price + delta, mrp: product.mrp + delta };
}

export function variantLabel(v: ProductVariant) {
  return [v.colour.name, v.size, v.material].filter(Boolean).join(" · ");
}

export function discountPercent(price: number, mrp: number) {
  return mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;
}

/** GST contained in a GST-inclusive amount. */
export function gstIncluded(amount: number, rate: number) {
  return (amount * rate) / (100 + rate);
}

export interface CouponCheck {
  coupon: Coupon | null;
  error: string | null;
}

export function validateCoupon(
  code: string | null | undefined,
  lines: PricedLine[],
  subtotal: number,
  now = new Date(),
): CouponCheck {
  if (!code) return { coupon: null, error: null };
  const coupon = couponByCode.get(code.trim().toUpperCase());
  if (!coupon) return { coupon: null, error: "This code isn't valid." };
  if (!coupon.active || Date.parse(coupon.expiresAt) < now.getTime()) {
    return { coupon: null, error: "This code has expired." };
  }
  const eligible = coupon.department
    ? lines.filter((l) => l.department === coupon.department).reduce((s, l) => s + l.lineTotal, 0)
    : subtotal;
  if (coupon.department && eligible === 0) {
    return {
      coupon: null,
      error: `This code only applies to ${coupon.department === "appliances" ? "home appliances" : coupon.department}.`,
    };
  }
  if (eligible < coupon.minSubtotal) {
    return {
      coupon: null,
      error: `Add items worth ₹${(coupon.minSubtotal - eligible).toLocaleString("en-IN")} more to use this code.`,
    };
  }
  return { coupon, error: null };
}

/**
 * Single source of truth for cart and order totals. Used by the cart UI and the order route handler,
 * which recomputes everything server-side and ignores any client-sent amounts.
 */
export function priceCart(
  cart: CartLine[],
  couponCode?: string | null,
  now = new Date(),
): PriceBreakdown {
  const lines: PricedLine[] = [];
  for (const item of cart) {
    const product = productById.get(item.productId);
    if (!product) continue;
    const variant = getVariant(product, item.sku) ?? product.variants[0];
    if (!variant) continue;
    const { price, mrp } = variantPrice(product, variant);
    const quantity = Math.max(1, Math.min(MAX_QTY_PER_LINE, Math.floor(item.quantity)));
    lines.push({
      productId: product.id,
      sku: variant.sku,
      name: product.name,
      slug: product.slug,
      variantLabel: variantLabel(variant),
      kind: product.kind,
      hex: variant.colour.hex.replace("#", ""),
      quantity,
      unitPrice: price,
      unitMrp: mrp,
      lineTotal: price * quantity,
      gstRate: product.gstRate,
      department: product.department,
      bulky: product.bulky,
      available: variant.stock >= quantity,
    });
  }

  const subtotal = lines.reduce((s, l) => s + l.lineTotal, 0);
  const mrpTotal = lines.reduce((s, l) => s + l.unitMrp * l.quantity, 0);
  const itemCount = lines.reduce((s, l) => s + l.quantity, 0);

  const { coupon, error } = validateCoupon(couponCode, lines, subtotal, now);

  // Discount allocation per line so GST can be computed on the discounted value.
  const eligible = (l: PricedLine) => !coupon?.department || l.department === coupon.department;
  const eligibleTotal = lines.filter(eligible).reduce((s, l) => s + l.lineTotal, 0);
  let couponDiscount = 0;
  if (coupon && coupon.kind === "percent") {
    couponDiscount = (eligibleTotal * coupon.value) / 100;
    if (coupon.maxDiscount) couponDiscount = Math.min(couponDiscount, coupon.maxDiscount);
  } else if (coupon && coupon.kind === "flat") {
    couponDiscount = Math.min(coupon.value, eligibleTotal);
  }
  couponDiscount = Math.round(couponDiscount);

  const afterDiscount = subtotal - couponDiscount;
  let shipping = 0;
  if (lines.length > 0 && afterDiscount < FREE_SHIPPING_THRESHOLD) {
    shipping = lines.some((l) => l.bulky) ? BULKY_SHIPPING : STANDARD_SHIPPING;
  }
  if (coupon?.kind === "free-shipping") shipping = 0;

  const gst = lines.reduce((s, l) => {
    const share =
      eligible(l) && eligibleTotal > 0 ? (l.lineTotal / eligibleTotal) * couponDiscount : 0;
    return s + gstIncluded(l.lineTotal - share, l.gstRate);
  }, 0);

  return {
    lines,
    itemCount,
    mrpTotal,
    subtotal,
    productDiscount: mrpTotal - subtotal,
    couponCode: coupon?.code ?? null,
    couponDiscount,
    couponError: error,
    shipping,
    gstIncluded: Math.round(gst),
    total: afterDiscount + shipping,
  };
}
