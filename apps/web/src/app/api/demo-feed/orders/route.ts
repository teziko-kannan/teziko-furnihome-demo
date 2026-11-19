import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { readFeed } from "@/lib/server/demo-feed";
import { jsonError } from "@/lib/server/http";

function safeEqual(a: string, b: string) {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

/** Server-to-server feed of live demo orders for the admin app. Requires DEMO_FEED_TOKEN. */
export function GET(req: Request) {
  const expected =
    process.env.DEMO_FEED_TOKEN ??
    (process.env.NODE_ENV === "production" ? "" : "local-demo-feed-token");
  const got = req.headers.get("x-demo-feed-token") ?? "";
  if (!expected || !safeEqual(got, expected)) return jsonError("Unauthorized", 401);
  return NextResponse.json(
    { ok: true, orders: readFeed() },
    { headers: { "cache-control": "no-store" } },
  );
}
