import type {
  AdminUser,
  MonthlySales,
  Order,
  OrderStatus,
  PaymentMethod,
  SeedCustomer,
} from "@teziko/types";
import { hash, mulberry32 } from "../catalog/build";
import { products } from "../catalog";
import { priceCart } from "./pricing";

/** Seeded, clearly fictional analytics for the admin dashboard. */
export const monthlySales: MonthlySales[] = [
  ["Dec 25", 3820000, 214],
  ["Jan 26", 3410000, 188],
  ["Feb 26", 3590000, 197],
  ["Mar 26", 4120000, 231],
  ["Apr 26", 4870000, 262],
  ["May 26", 5630000, 301],
  ["Jun 26", 4980000, 276],
  ["Jul 26", 4210000, 240],
  ["Aug 26", 4560000, 255],
  ["Sep 26", 5240000, 289],
  ["Oct 26", 6910000, 372],
  ["Nov 26", 5480000, 296],
].map(([month, revenue, orders]) => ({
  month: month as string,
  revenue: revenue as number,
  orders: orders as number,
}));

const names = [
  "Ananya Rao",
  "Rohit Mehta",
  "Priya Nair",
  "Karthik Iyer",
  "Meera Shah",
  "Arjun Kapoor",
  "Sneha Kulkarni",
  "Vikram Singh",
  "Divya Menon",
  "Rahul Verma",
  "Ishita Banerjee",
  "Aditya Joshi",
  "Neha Gupta",
  "Siddharth Reddy",
  "Pooja Desai",
  "Manish Agarwal",
  "Kavya Pillai",
  "Nikhil Chawla",
  "Riya Sethi",
  "Harsh Patel",
  "Lakshmi Krishnan",
  "Farhan Qureshi",
  "Tanvi Bhatt",
  "Gaurav Malhotra",
];
const cities = [
  "Bengaluru",
  "Mumbai",
  "Pune",
  "Hyderabad",
  "Chennai",
  "Delhi",
  "Gurugram",
  "Kolkata",
  "Ahmedabad",
  "Jaipur",
  "Kochi",
  "Indore",
];

export const seedCustomers: SeedCustomer[] = names.map((name, i) => {
  const r = mulberry32(hash(name));
  const orders = 1 + Math.floor(r() * 7);
  return {
    id: `c${String(i + 1).padStart(3, "0")}`,
    name,
    email: `${name.toLowerCase().replace(/[^a-z]+/g, ".")}@example.com`,
    city: cities[i % cities.length]!,
    orders,
    lifetimeValue: Math.round(orders * (8000 + r() * 45000)),
    joinedAt: new Date(
      Date.UTC(2025, Math.floor(r() * 18), 1 + Math.floor(r() * 27)),
    ).toISOString(),
  };
});

export const adminUsers: AdminUser[] = [
  {
    id: "a1",
    name: "Demo Admin",
    email: "admin@demo.com",
    role: "owner",
    lastActive: "2026-11-17T09:12:00.000Z",
  },
  {
    id: "a2",
    name: "Kiran Joshi",
    email: "kiran.ops@example.com",
    role: "manager",
    lastActive: "2026-11-16T15:40:00.000Z",
  },
  {
    id: "a3",
    name: "Sana Ali",
    email: "sana.support@example.com",
    role: "support",
    lastActive: "2026-11-17T07:02:00.000Z",
  },
  {
    id: "a4",
    name: "Dev Prakash",
    email: "dev.catalogue@example.com",
    role: "manager",
    lastActive: "2026-11-12T11:25:00.000Z",
  },
];

const statuses: OrderStatus[] = [
  "delivered",
  "delivered",
  "delivered",
  "shipped",
  "out-for-delivery",
  "packed",
  "confirmed",
  "placed",
  "cancelled",
];
const methods: PaymentMethod[] = ["upi", "upi", "card", "netbanking", "cod"];

/** 48 seeded historical orders spread over the last 60 days, for the admin tables. */
export function seedOrders(now = Date.UTC(2026, 10, 17, 10)): Order[] {
  const r = mulberry32(42);
  return Array.from({ length: 48 }, (_, i) => {
    const customer = seedCustomers[i % seedCustomers.length]!;
    const created = new Date(now - Math.floor(r() * 60 * 86400000));
    const lineCount = 1 + Math.floor(r() * 3);
    const cart = Array.from({ length: lineCount }, () => {
      const p = products[Math.floor(r() * products.length)]!;
      return { productId: p.id, sku: p.variants[0]!.sku, quantity: 1 + Math.floor(r() * 2) };
    });
    const pricing = priceCart(cart, r() < 0.3 ? "WELCOME10" : null, created);
    const ageDays = (now - created.getTime()) / 86400000;
    const status: OrderStatus =
      ageDays > 10
        ? r() < 0.92
          ? "delivered"
          : "cancelled"
        : statuses[Math.floor(r() * statuses.length)]!;
    const paymentMethod = methods[Math.floor(r() * methods.length)]!;
    const number = `TZ-${created.toISOString().slice(2, 10).replace(/-/g, "")}-S${String(i).padStart(3, "0")}`;
    return {
      id: `seed-${i}`,
      number,
      email: customer.email,
      customerName: customer.name,
      createdAt: created.toISOString(),
      status,
      paymentMethod,
      paymentStatus: paymentMethod === "cod" ? (status === "delivered" ? "paid" : "cod") : "paid",
      shippingAddress: {
        fullName: customer.name,
        phone: "9800000000",
        line1: "Demo address",
        city: customer.city,
        state: "—",
        pincode: "560001",
      },
      pricing,
      events: [{ status, at: created.toISOString(), note: "Seeded demo order" }],
      demo: true,
    } satisfies Order;
  }).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}
