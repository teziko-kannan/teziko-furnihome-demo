import type { Banner, Coupon } from "@teziko/types";

export const coupons: Coupon[] = [
  {
    code: "WELCOME10",
    kind: "percent",
    value: 10,
    minSubtotal: 2999,
    maxDiscount: 2000,
    description: "10% off your first order, up to ₹2,000",
    active: true,
    expiresAt: "2027-03-31",
  },
  {
    code: "FESTIVE15",
    kind: "percent",
    value: 15,
    minSubtotal: 19999,
    maxDiscount: 7500,
    description: "15% off orders above ₹19,999, up to ₹7,500",
    active: true,
    expiresAt: "2027-01-15",
  },
  {
    code: "APPLIANCE5",
    kind: "percent",
    value: 5,
    minSubtotal: 9999,
    maxDiscount: 3000,
    department: "appliances",
    description: "Extra 5% off home appliances, up to ₹3,000",
    active: true,
    expiresAt: "2027-02-28",
  },
  {
    code: "FLAT500",
    kind: "flat",
    value: 500,
    minSubtotal: 4999,
    description: "₹500 off orders above ₹4,999",
    active: true,
    expiresAt: "2027-06-30",
  },
  {
    code: "FREESHIP",
    kind: "free-shipping",
    value: 0,
    minSubtotal: 999,
    description: "Free delivery on orders above ₹999",
    active: true,
    expiresAt: "2027-12-31",
  },
  {
    code: "MONSOON20",
    kind: "percent",
    value: 20,
    minSubtotal: 9999,
    maxDiscount: 5000,
    description: "Monsoon sale (ended)",
    active: false,
    expiresAt: "2026-08-31",
  },
];

export const couponByCode = new Map(coupons.map((c) => [c.code, c]));

export const announcements = [
  "Festive Edit: extra 15% off above ₹19,999 with code FESTIVE15",
  "Free delivery on orders above ₹4,999",
  "New here? Take 10% off with WELCOME10",
  "Free installation on sofas, beds and large appliances",
];

export const banners: Banner[] = [
  {
    id: "b-hero-1",
    eyebrow: "The Festive Edit 2026",
    title: "Rooms that gather people",
    body: "Sofas, dining sets and lighting chosen for long evenings with family. Up to 40% off, with free installation.",
    cta: { label: "Shop the edit", href: "/shop?tag=featured" },
    kind: "sofa",
    tint: "#b5654a",
    placement: "hero",
    active: true,
  },
  {
    id: "b-promo-1",
    eyebrow: "Appliance week",
    title: "Extra 5% off on appliances",
    body: "Stack APPLIANCE5 with sale prices on refrigerators, ACs and TVs.",
    cta: { label: "Shop appliances", href: "/home-appliances" },
    kind: "refrigerator",
    tint: "#3d5a80",
    placement: "promo",
    active: true,
  },
  {
    id: "b-promo-2",
    eyebrow: "Work from home",
    title: "Desks and chairs that fit",
    body: "Ergonomic chairs and standing desks, delivered in 5 to 10 days.",
    cta: { label: "Shop study & office", href: "/category/study-office" },
    kind: "office-chair",
    tint: "#5a6068",
    placement: "promo",
    active: true,
  },
  {
    id: "b-seasonal-1",
    eyebrow: "Winter, handled",
    title: "Clean air and warm textiles",
    body: "HEPA purifiers for smoggy months, plus throws and rugs for cooler nights.",
    cta: { label: "Shop the season", href: "/shop?tag=seasonal" },
    kind: "air-purifier",
    tint: "#6f7d5a",
    placement: "seasonal",
    active: true,
  },
];

export interface RoomInspiration {
  slug: string;
  title: string;
  blurb: string;
  tint: string;
  productSlugs: string[];
}

export const rooms: RoomInspiration[] = [
  {
    slug: "living-room",
    title: "A warm living room",
    blurb: "Terracotta, velvet and brass for long evenings.",
    tint: "#b5654a",
    productSlugs: [
      "oslo-velvet-3-seater-sofa",
      "orbit-round-coffee-table",
      "deepa-arc-floor-lamp",
      "kilim-hand-woven-rug",
    ],
  },
  {
    slug: "bedroom",
    title: "A calm bedroom",
    blurb: "Soft greys, storage and silent cooling.",
    tint: "#7d7f82",
    productSlugs: [
      "kenzo-upholstered-bed-with-storage",
      "deepa-ceramic-table-lamp",
      "pavana-1-ton-3-star-inverter-split-ac",
      "cotton-waffle-throw",
    ],
  },
  {
    slug: "home-office",
    title: "A focused home office",
    blurb: "Ergonomics first, clutter last.",
    tint: "#5a6068",
    productSlugs: [
      "rise-electric-standing-desk",
      "ergopro-mesh-office-chair",
      "tier-ladder-bookshelf",
      "minimal-wall-clock-40-cm",
    ],
  },
  {
    slug: "dining",
    title: "A dining room for six",
    blurb: "Solid wood, cane and a pendant overhead.",
    tint: "#b07a44",
    productSlugs: [
      "haveli-6-seater-sheesham-dining-set",
      "cane-back-dining-chair-set-of-2",
      "deepa-rattan-pendant-light",
      "terracotta-vase-set-of-3",
    ],
  },
];

/** Labelled demo testimonials. Not real customers. */
export const testimonials = [
  {
    name: "Aparna, Pune",
    quote:
      "The sofa arrived on the promised day and the installers were careful with our walls. It looks exactly like the photos.",
    product: "Arden 3-Seater Fabric Sofa",
  },
  {
    name: "Rahul, Bengaluru",
    quote:
      "Ordering the AC, fridge and TV together was simple and the installation team handled all three in one visit.",
    product: "Himavat 1.5 Ton 5-Star Inverter Split AC",
  },
  {
    name: "Fatima, Hyderabad",
    quote: "The block-print covers have such lovely detail. You can tell they are hand printed.",
    product: "Block-Print Cushion Covers (Set of 2)",
  },
  {
    name: "Jaideep, Delhi",
    quote:
      "My back thanks me for the ErgoPro. The lumbar adjustment makes a real difference over a long workday.",
    product: "ErgoPro Mesh Office Chair",
  },
];

export const faqs: {
  q: string;
  a: string;
  group: "Orders" | "Delivery" | "Returns" | "Payments" | "Demo";
}[] = [
  {
    group: "Demo",
    q: "Is this a real store?",
    a: "No. Home Vibe is a demonstration store. Orders are not fulfilled, no money is charged and all data you enter is deleted automatically after 14 days.",
  },
  {
    group: "Orders",
    q: "How do I track my order?",
    a: "Go to My Orders, or use Track Order with your order number and email. The demo timeline advances automatically over a few minutes.",
  },
  {
    group: "Orders",
    q: "Can I change or cancel an order?",
    a: "In this demo you can cancel an order from My Orders before it is shipped.",
  },
  {
    group: "Delivery",
    q: "How much does delivery cost?",
    a: "Delivery is free above ₹4,999. Below that, standard delivery is ₹149 and large items such as sofas and appliances cost ₹499.",
  },
  {
    group: "Delivery",
    q: "Do you install furniture and appliances?",
    a: "Sofas, beds, wardrobes and large appliances include free installation, typically within 48 hours of delivery (simulated in this demo).",
  },
  {
    group: "Returns",
    q: "What is the return window?",
    a: "Most items can be returned within 10 days of delivery if unused and in original packaging. See the Returns & Refunds policy for details.",
  },
  {
    group: "Payments",
    q: "Which payment methods are available?",
    a: "UPI, cards, net banking and Cash on Delivery. In this demo, payments are simulated and no card details are collected.",
  },
  {
    group: "Payments",
    q: "Are prices inclusive of GST?",
    a: "Yes. All prices include GST. Your order summary shows the GST component separately.",
  },
];
