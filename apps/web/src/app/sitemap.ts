import { categories, products } from "@teziko/data";
import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date("2026-11-17");
  const staticPaths = [
    "/",
    "/shop",
    "/about",
    "/contact",
    "/faqs",
    "/track-order",
    "/privacy-policy",
    "/terms",
    "/returns-policy",
  ];
  return [
    ...staticPaths.map((p) => ({
      url: absoluteUrl(p),
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: p === "/" ? 1 : 0.5,
    })),
    ...categories.map((c) => ({
      url: absoluteUrl(c.parent ? `/category/${c.slug}` : `/${c.slug}`),
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...products.map((p) => ({
      url: absoluteUrl(`/product/${p.slug}`),
      lastModified: new Date(p.listedAt),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
