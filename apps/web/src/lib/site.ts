export const site = {
  name: "Home Vibe",
  shortName: "Home Vibe",
  tagline: "Furniture, appliances and decor for considered homes",
  description:
    "Home Vibe is a demo store for furniture, home appliances and decor. Browse sofas, beds, refrigerators, ACs and more. Orders are not real.",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, ""),
  adminUrl: (process.env.NEXT_PUBLIC_ADMIN_URL ?? "http://localhost:3001").replace(/\/$/, ""),
  /** Digits only, with country code. Unset in the demo, so the chat button falls back to the contact page. */
  whatsappNumber: (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "").replace(/\D/g, ""),
  supportEmail: "support@homevibe-demo.example",
  supportPhone: "+91 00000 00000",
  demoNotice: "Demo store. Orders are not real. Data is deleted automatically after 14 days.",
} as const;

export function absoluteUrl(path = "/") {
  return `${site.url}${path.startsWith("/") ? path : `/${path}`}`;
}
