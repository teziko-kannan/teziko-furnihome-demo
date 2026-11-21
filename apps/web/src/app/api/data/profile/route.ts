import { addressFields, profileSchema, refineAddress } from "@teziko/validators";
import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/server/auth";
import { jsonError } from "@/lib/server/http";
import { getProfile, upsertProfile } from "@/lib/server/store";
import { supabaseEnabled } from "@/lib/server/supabase";

const bodySchema = profileSchema.extend({
  addresses: z
    .array(
      addressFields
        .extend({ id: z.string().max(40), isDefault: z.boolean() })
        .superRefine(refineAddress),
    )
    .max(10),
});

export async function GET() {
  if (!supabaseEnabled()) return jsonError("Supabase adapter is not configured", 501);
  const session = await getSession();
  if (!session) return jsonError("Sign in required", 401);
  const profile = await getProfile(session.email);
  if (!profile) return jsonError("No profile yet", 404);
  return NextResponse.json({ ok: true, profile });
}

export async function PUT(req: Request) {
  if (!supabaseEnabled()) return jsonError("Supabase adapter is not configured", 501);
  const session = await getSession();
  if (!session) return jsonError("Sign in required", 401);
  const parsed = bodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return jsonError("Invalid profile", 422);
  const existing = await getProfile(session.email);
  await upsertProfile({
    email: session.email,
    name: parsed.data.name,
    phone: parsed.data.phone,
    addresses: parsed.data.addresses.map((a) => ({ ...a, line2: a.line2 || undefined })),
    createdAt: existing?.createdAt ?? new Date().toISOString(),
  });
  return NextResponse.json({ ok: true });
}
