import { NextResponse } from "next/server";
import { buildSearchIndex } from "@/features/layout/nav-data";

export const dynamic = "force-static";

/** Lightweight product index for the search palette, fetched when the palette first opens. */
export function GET() {
  return NextResponse.json(
    { ok: true, index: buildSearchIndex() },
    { headers: { "cache-control": "public, max-age=3600" } },
  );
}
