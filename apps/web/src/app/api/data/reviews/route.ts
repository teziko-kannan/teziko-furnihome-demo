import { productById } from "@teziko/data";
import { reviewSchema } from "@teziko/validators";
import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { guardedJson, jsonError } from "@/lib/server/http";
import { insertRow, listReviews } from "@/lib/server/store";
import { supabaseEnabled } from "@/lib/server/supabase";

export async function GET(req: NextRequest) {
  if (!supabaseEnabled()) return jsonError("Supabase adapter is not configured", 501);
  const productId = req.nextUrl.searchParams.get("productId") ?? "";
  if (!productById.has(productId)) return jsonError("Unknown product", 404);
  return NextResponse.json({ ok: true, reviews: await listReviews(productId) });
}

export async function POST(req: Request) {
  if (!supabaseEnabled()) return jsonError("Supabase adapter is not configured", 501);
  const r = await guardedJson(
    req,
    reviewSchema.extend({
      id: z.uuid(),
      productId: z.string().max(10),
      createdAt: z.iso.datetime(),
    }),
    {
      bucket: "reviews",
      limit: 5,
      windowMs: 10 * 60_000,
    },
  );
  if ("response" in r) return r.response;
  if (!productById.has(r.data.productId)) return jsonError("Unknown product", 404);
  await insertRow("reviews", { id: r.data.id, product_id: r.data.productId, data: r.data });
  return NextResponse.json({ ok: true });
}
