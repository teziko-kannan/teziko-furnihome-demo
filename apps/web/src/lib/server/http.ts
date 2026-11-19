import "server-only";
import { NextResponse } from "next/server";
import type { ZodType } from "zod";
import { clientIp, rateLimit } from "./rate-limit";

export function jsonError(message: string, status: number, extra?: Record<string, unknown>) {
  return NextResponse.json({ ok: false, error: message, ...extra }, { status });
}

/** Rate-limits, parses JSON and validates a request body. Returns either data or a ready error response. */
export async function guardedJson<T>(
  req: Request,
  schema: ZodType<T>,
  opts: { bucket: string; limit: number; windowMs: number },
): Promise<{ data: T } | { response: NextResponse }> {
  const rl = rateLimit(`${opts.bucket}:${clientIp(req)}`, opts.limit, opts.windowMs);
  if (!rl.ok) {
    return {
      response: jsonError("Too many requests. Please try again shortly.", 429, {
        retryAfter: rl.retryAfter,
      }),
    };
  }
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return { response: jsonError("Invalid JSON body", 400) };
  }
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    const honeypot = parsed.error.issues.some((i) => i.path[0] === "website");
    // Honeypot hits get a generic success-shaped reply so bots learn nothing.
    if (honeypot) return { response: NextResponse.json({ ok: true }) };
    return {
      response: jsonError("Please check the highlighted fields.", 422, {
        issues: parsed.error.flatten().fieldErrors,
      }),
    };
  }
  return { data: parsed.data };
}
