import { NextResponse } from "next/server";
import { getSession } from "@/lib/server/auth";

export async function GET() {
  const s = await getSession();
  return NextResponse.json(
    { ok: true, user: s ? { email: s.email, name: s.name, role: s.role } : null },
    { headers: { "cache-control": "no-store" } },
  );
}
