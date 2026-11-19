import { productById } from "@teziko/data";
import { NextResponse, type NextRequest } from "next/server";
import { toCard } from "@/features/catalog/card-data";

/** Returns card data (or full products with ?full=1) for up to 24 ids. Used by wishlist, compare and recently viewed. */
export function GET(req: NextRequest) {
  const ids = (req.nextUrl.searchParams.get("ids") ?? "").split(",").filter(Boolean).slice(0, 24);
  const full = req.nextUrl.searchParams.get("full") === "1";
  const found = ids.map((id) => productById.get(id)).filter((p) => p !== undefined);
  return NextResponse.json({ ok: true, products: full ? found : found.map(toCard) });
}
