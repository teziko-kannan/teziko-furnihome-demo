import type { ProductKind } from "@teziko/types";
import { ART_KINDS, shapes, type ArtPalette } from "./shapes";
import { artBackground, shade } from "./url";

export * from "./url";
export { ART_KINDS };

export const ART_VIEW_COUNT = 5;

function luminance(hex: string) {
  const n = parseInt(hex.replace("#", ""), 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  }) as [number, number, number];
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

const WOODS = ["#7a5236", "#5e3c24", "#2f2a26"];

function palette(hex: string, kind: ProductKind): ArtPalette {
  const dark = luminance(hex) < 0.08;
  const wood = kind === "office-chair" ? "#1f1f1f" : WOODS[hex.charCodeAt(3) % WOODS.length]!;
  return {
    c: hex,
    d: dark ? shade(hex, 0.18) : shade(hex, -0.22),
    l: dark ? shade(hex, 0.32) : shade(hex, 0.28),
    w: wood,
    k: "#1d1d1f",
  };
}

export function isValidHex(hex: string) {
  return /^[0-9a-fA-F]{6}$/.test(hex);
}

export function isArtKind(kind: string): kind is ProductKind {
  return (ART_KINDS as string[]).includes(kind);
}

/**
 * Renders a product illustration as an SVG string.
 * Views: 0 studio, 1 three-quarter, 2 detail crop, 3 room setting, 4 dimension sheet.
 */
export function renderArt(kind: ProductKind, hex: string, view: number): string {
  const colour = `#${hex.replace("#", "")}`;
  const p = palette(colour, kind);
  const body = shapes[kind](p);
  const bg = artBackground(colour);
  const bg2 = shade(colour, 0.93);
  const v = ((view % ART_VIEW_COUNT) + ART_VIEW_COUNT) % ART_VIEW_COUNT;

  const defs = `<defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${bg2}"/><stop offset="1" stop-color="${bg}"/></linearGradient>
    <radialGradient id="sh" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#000" stop-opacity="0.22"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
    <pattern id="tx" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M0 10 L10 0" stroke="#fff" stroke-opacity="0.12" stroke-width="2"/></pattern>
  </defs>`;

  let scene: string;
  switch (v) {
    case 1:
      scene = `<rect width="800" height="800" fill="${shade(colour, 0.9)}"/>
        <rect y="610" width="800" height="190" fill="${shade(colour, 0.8)}"/>
        <ellipse cx="420" cy="612" rx="300" ry="26" fill="url(#sh)"/>
        <g transform="translate(800 0) scale(-1 1) translate(40 60) scale(0.9)">${body}</g>`;
      break;
    case 2:
      scene = `<rect width="800" height="800" fill="url(#bg)"/>
        <g transform="translate(-380 -330) scale(1.95)">${body}</g>
        <rect width="800" height="800" fill="url(#tx)"/>`;
      break;
    case 3: {
      const wall = shade(colour, 0.78);
      scene = `<rect width="800" height="800" fill="${wall}"/>
        <rect y="560" width="800" height="240" fill="#d9cbb5"/>
        <path d="M0 560 L800 560" stroke="#c4b49b" stroke-width="4"/>
        <rect x="80" y="120" width="120" height="150" fill="#fbfaf7" stroke="#2b2b2b" stroke-width="6"/>
        <circle cx="140" cy="195" r="34" fill="${shade(colour, -0.1)}" opacity="0.8"/>
        <path d="M700 560 L690 470 L740 470 L730 560 Z" fill="#b5654a"/>
        <path d="M715 470 Q680 380 650 360 M715 470 Q730 370 770 340 M715 470 Q715 390 720 330" stroke="#5f7f52" stroke-width="8" fill="none"/>
        <ellipse cx="400" cy="606" rx="260" ry="20" fill="url(#sh)"/>
        <g transform="translate(140 175) scale(0.65)">${body}</g>`;
      break;
    }
    case 4:
      scene = `<rect width="800" height="800" fill="#fbfbfa"/>
        <g opacity="0.92" transform="translate(60 40) scale(0.85)">${body}</g>
        <g stroke="#6b6b6b" stroke-width="2" fill="none">
          <path d="M100 690 L700 690 M100 680 L100 700 M700 680 L700 700"/>
          <path d="M740 120 L740 560 M730 120 L750 120 M730 560 L750 560"/>
        </g>
        <text x="400" y="725" font-family="sans-serif" font-size="22" fill="#6b6b6b" text-anchor="middle">W</text>
        <text x="768" y="346" font-family="sans-serif" font-size="22" fill="#6b6b6b">H</text>`;
      break;
    default:
      scene = `<rect width="800" height="800" fill="url(#bg)"/>
        <ellipse cx="400" cy="606" rx="320" ry="28" fill="url(#sh)"/>
        <g transform="translate(0 40)">${body}</g>`;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="800" height="800" role="img">${defs}${scene}</svg>`;
}
