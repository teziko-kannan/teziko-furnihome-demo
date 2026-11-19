import { isArtKind, parseArtFile, renderArt } from "@teziko/data/art";

/** Serves catalogue illustrations. Deterministic output, so responses are cached aggressively. */
export async function GET(_req: Request, ctx: RouteContext<"/media/art/[kind]/[file]">) {
  const { kind, file } = await ctx.params;
  const parsed = parseArtFile(file);
  if (!isArtKind(kind) || !parsed) return new Response("Not found", { status: 404 });
  return new Response(renderArt(kind, parsed.hex, parsed.view), {
    headers: {
      "content-type": "image/svg+xml; charset=utf-8",
      "cache-control": "public, max-age=31536000, immutable",
      "content-security-policy": "default-src 'none'; style-src 'unsafe-inline'; sandbox",
      "x-content-type-options": "nosniff",
    },
  });
}
