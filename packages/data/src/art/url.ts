/* Lightweight art helpers that are safe for client bundles (no shape data). */
import type { ProductKind } from "@teziko/types";

/** Mix a hex colour toward white (amt > 0) or black (amt < 0). amt in [-1, 1]. */
export function shade(hex: string, amt: number): string {
  const n = parseInt(hex.replace("#", ""), 16);
  const ch = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => {
    const t = amt >= 0 ? v + (255 - v) * amt : v * (1 + amt);
    return Math.round(Math.max(0, Math.min(255, t)));
  });
  return `#${ch.map((v) => v.toString(16).padStart(2, "0")).join("")}`;
}

/** Soft background tint derived from the product colour. */
export function artBackground(hex: string) {
  return shade(hex, 0.86);
}

/** Public URL for an illustration served by each app's `/media/art/[kind]/[file]` route. */
export function artUrl(kind: ProductKind, hex: string, view = 0) {
  return `/media/art/${kind}/${view}-${hex.replace("#", "").toLowerCase()}.svg`;
}

/** Tiny solid-colour SVG for next/image blur-up placeholders. */
export function artBlurDataUrl(hex: string) {
  const fill = artBackground(`#${hex.replace("#", "")}`);
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8"><rect width="8" height="8" fill="${fill}"/></svg>`)}`;
}

/** Parses `${view}-${hex}.svg` from the media route. */
export function parseArtFile(file: string): { view: number; hex: string } | null {
  const m = /^([0-4])-([0-9a-f]{6})\.svg$/.exec(file);
  if (!m) return null;
  return { view: Number(m[1]), hex: m[2]! };
}
