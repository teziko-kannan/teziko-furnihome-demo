import { z } from "zod";

const phone = z
  .string()
  .trim()
  .regex(/^[6-9]\d{9}$/, "Enter a 10-digit Indian mobile number");

const pincode = z
  .string()
  .trim()
  .regex(/^[1-9]\d{5}$/, "Enter a valid 6-digit PIN code");

const name = z
  .string()
  .trim()
  .min(2, "Enter at least 2 characters")
  .max(80, "Keep it under 80 characters");

export const emailSchema = z.email("Enter a valid email address").trim().toLowerCase().max(120);

/** Honeypot: real users never see or fill this field. */
export const honeypot = z.string().max(0, "Spam check failed").optional();

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(6, "Password must be at least 6 characters").max(100),
});
export type LoginInput = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  name,
  email: emailSchema,
  password: z.string().min(8, "Use at least 8 characters").max(100),
});
export type RegisterInput = z.infer<typeof registerSchema>;

export const addressSchema = z.object({
  label: z.string().trim().min(1, "Give this address a label").max(30),
  fullName: name,
  phone,
  line1: z.string().trim().min(5, "Enter house number and street").max(120),
  line2: z.string().trim().max(120).optional().or(z.literal("")),
  city: z.string().trim().min(2, "Enter your city").max(60),
  state: z.string().trim().min(2, "Select your state").max(60),
  pincode,
});
export type AddressInput = z.infer<typeof addressSchema>;

export const profileSchema = z.object({
  name,
  phone: phone.or(z.literal("")),
});
export type ProfileInput = z.infer<typeof profileSchema>;

export const paymentMethodSchema = z.enum(["upi", "card", "netbanking", "cod"]);

export const cartLineSchema = z.object({
  productId: z.string().min(1).max(40),
  sku: z.string().min(1).max(60),
  quantity: z.number().int().min(1).max(10),
});

/** What the client sends when placing an order. Amounts are never trusted from the client. */
export const placeOrderSchema = z.object({
  email: emailSchema,
  address: addressSchema.omit({ label: true }),
  lines: z.array(cartLineSchema).min(1, "Your cart is empty").max(30),
  couponCode: z.string().trim().toUpperCase().max(20).optional().nullable(),
  paymentMethod: paymentMethodSchema,
  /** Result picked on the simulated payment screen. */
  simulateOutcome: z.enum(["success", "failure"]),
  website: honeypot,
});
export type PlaceOrderInput = z.infer<typeof placeOrderSchema>;

export const quoteSchema = z.object({
  lines: z.array(cartLineSchema).max(30),
  couponCode: z.string().trim().toUpperCase().max(20).optional().nullable(),
});

export const contactSchema = z.object({
  name,
  email: emailSchema,
  topic: z.enum(["order", "product", "delivery", "returns", "other"], {
    error: "Choose a topic",
  }),
  message: z.string().trim().min(10, "Tell us a little more (10+ characters)").max(1500),
  website: honeypot,
});
export type ContactInput = z.infer<typeof contactSchema>;

export const newsletterSchema = z.object({
  email: emailSchema,
  website: honeypot,
});
export type NewsletterInput = z.infer<typeof newsletterSchema>;

export const reviewSchema = z.object({
  rating: z.number().int().min(1, "Choose a rating").max(5),
  title: z.string().trim().min(3, "Add a short title").max(80),
  body: z.string().trim().min(20, "Write at least 20 characters").max(1200),
  author: name,
});
export type ReviewInput = z.infer<typeof reviewSchema>;

export const couponFormSchema = z.object({
  code: z
    .string()
    .trim()
    .toUpperCase()
    .regex(/^[A-Z0-9]{3,20}$/, "Use 3-20 letters or digits"),
  kind: z.enum(["percent", "flat", "free-shipping"]),
  value: z.number().min(0).max(100000),
  minSubtotal: z.number().min(0).max(1000000),
  description: z.string().trim().min(3).max(120),
});
export type CouponFormInput = z.infer<typeof couponFormSchema>;

export const orderStatusSchema = z.enum([
  "placed",
  "confirmed",
  "packed",
  "shipped",
  "out-for-delivery",
  "delivered",
  "cancelled",
  "payment-failed",
]);

export const trackOrderSchema = z.object({
  orderNumber: z
    .string()
    .trim()
    .toUpperCase()
    .regex(/^TZ-\d{6}-[A-Z0-9]{4}$/, "Order numbers look like TZ-251117-AB12"),
  email: emailSchema,
});
export type TrackOrderInput = z.infer<typeof trackOrderSchema>;
