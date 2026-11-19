/* Shared domain types for the Teziko demo store. */

export type Department = "furniture" | "appliances" | "decor";

/** Visual archetype used by the SVG product-art renderer. */
export type ProductKind =
  | "sofa"
  | "sectional"
  | "armchair"
  | "dining-chair"
  | "office-chair"
  | "bed"
  | "dining-table"
  | "coffee-table"
  | "desk"
  | "wardrobe"
  | "bookshelf"
  | "tv-unit"
  | "refrigerator"
  | "washing-machine"
  | "television"
  | "air-conditioner"
  | "microwave"
  | "mixer"
  | "air-purifier"
  | "dishwasher"
  | "lamp"
  | "vase"
  | "rug"
  | "mirror"
  | "wall-art"
  | "cushion"
  | "clock"
  | "planter";

export interface Category {
  slug: string;
  name: string;
  department: Department;
  /** Parent category slug for subcategories. Top-level departments have none. */
  parent?: string;
  description: string;
  /** Representative product kind for the category tile illustration. */
  heroKind: ProductKind;
  /** Hex tint for the tile background. */
  tint: string;
}

export interface Brand {
  slug: string;
  name: string;
  tagline: string;
  origin: string;
  departments: Department[];
  founded: number;
}

export interface ColourOption {
  name: string;
  hex: string;
}

export interface ProductVariant {
  sku: string;
  colour: ColourOption;
  size?: string;
  material?: string;
  /** Price delta from the base price, in rupees. */
  priceDelta: number;
  stock: number;
}

export interface ProductSpec {
  label: string;
  value: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  brand: string;
  department: Department;
  category: string;
  subcategory: string;
  kind: ProductKind;
  shortDescription: string;
  description: string;
  highlights: string[];
  /** Selling price in rupees (GST inclusive) for the default variant. */
  price: number;
  /** Maximum retail price in rupees (GST inclusive). */
  mrp: number;
  /** GST rate in percent applied to this product. */
  gstRate: number;
  variants: ProductVariant[];
  specs: ProductSpec[];
  materials: string[];
  warrantyMonths: number;
  /** Number of illustrations (3 to 5). */
  imageCount: number;
  rating: number;
  reviewCount: number;
  /** Units sold in the last 90 days (seeded) – used for popularity sort. */
  sold: number;
  /** ISO date the product was listed. */
  listedAt: string;
  tags: ProductTag[];
  /** Ships flat-packed or needs assembly at home. */
  assembly: "none" | "self" | "free-installation";
  deliveryDays: [min: number, max: number];
  /** Bulky items carry a separate shipping charge below the free threshold. */
  bulky: boolean;
}

export type ProductTag = "new" | "bestseller" | "trending" | "sale" | "seasonal" | "featured";

export type StockStatus = "in-stock" | "low-stock" | "out-of-stock";

export interface Review {
  id: string;
  productId: string;
  author: string;
  city: string;
  rating: 1 | 2 | 3 | 4 | 5;
  title: string;
  body: string;
  /** ISO date */
  createdAt: string;
  verified: boolean;
  /** Seeded reviews are always demo content. */
  demo: true;
  helpful: number;
}

export type CouponKind = "percent" | "flat" | "free-shipping";

export interface Coupon {
  code: string;
  kind: CouponKind;
  /** Percent (0-100) or flat rupee amount. Ignored for free-shipping. */
  value: number;
  minSubtotal: number;
  maxDiscount?: number;
  /** Restricts the discount to items from this department. */
  department?: Department;
  description: string;
  active: boolean;
  /** ISO date */
  expiresAt: string;
}

export interface Banner {
  id: string;
  eyebrow: string;
  title: string;
  body: string;
  cta: { label: string; href: string };
  kind: ProductKind;
  tint: string;
  placement: "hero" | "promo" | "seasonal";
  active: boolean;
}

export interface CartLine {
  productId: string;
  sku: string;
  quantity: number;
}

export interface PricedLine {
  productId: string;
  sku: string;
  name: string;
  slug: string;
  variantLabel: string;
  /** For rendering the line illustration without a catalogue lookup. */
  kind: ProductKind;
  hex: string;
  quantity: number;
  unitPrice: number;
  unitMrp: number;
  lineTotal: number;
  gstRate: number;
  department: Department;
  bulky: boolean;
  available: boolean;
}

export interface PriceBreakdown {
  lines: PricedLine[];
  itemCount: number;
  /** Sum of MRP × qty */
  mrpTotal: number;
  /** Sum of selling price × qty */
  subtotal: number;
  /** MRP savings */
  productDiscount: number;
  couponCode: string | null;
  couponDiscount: number;
  couponError: string | null;
  shipping: number;
  /** GST included in the payable amount (prices are GST inclusive). */
  gstIncluded: number;
  total: number;
}

export type PaymentMethod = "upi" | "card" | "netbanking" | "cod";

export type OrderStatus =
  | "placed"
  | "confirmed"
  | "packed"
  | "shipped"
  | "out-for-delivery"
  | "delivered"
  | "cancelled"
  | "payment-failed";

export interface Address {
  id: string;
  label: string;
  fullName: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

export interface OrderEvent {
  status: OrderStatus;
  at: string;
  note: string;
}

export interface Order {
  id: string;
  number: string;
  email: string;
  customerName: string;
  createdAt: string;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: "paid" | "pending" | "failed" | "cod";
  shippingAddress: Omit<Address, "id" | "isDefault" | "label">;
  pricing: PriceBreakdown;
  events: OrderEvent[];
  demo: true;
}

export type Role = "customer" | "admin";

export interface SessionUser {
  email: string;
  name: string;
  role: Role;
}

export interface CustomerProfile {
  email: string;
  name: string;
  phone: string;
  addresses: Address[];
  createdAt: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  topic: string;
  message: string;
  createdAt: string;
}

export interface NewsletterSubscription {
  id: string;
  email: string;
  createdAt: string;
}

export interface MonthlySales {
  month: string;
  revenue: number;
  orders: number;
}

export interface SeedCustomer {
  id: string;
  name: string;
  email: string;
  city: string;
  orders: number;
  lifetimeValue: number;
  joinedAt: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "owner" | "manager" | "support";
  lastActive: string;
}

export interface FilterState {
  q?: string;
  department?: Department;
  category?: string[];
  brand?: string[];
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  availability?: "in-stock";
  colour?: string[];
  material?: string[];
  sort?: SortKey;
  page?: number;
}

export type SortKey = "popular" | "newest" | "price-asc" | "price-desc" | "rating";
