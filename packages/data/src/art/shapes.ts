import type { ProductKind } from "@teziko/types";

/** Palette passed to each shape. All values are hex colours. */
export interface ArtPalette {
  /** Main body colour (the variant colour). */
  c: string;
  /** Darker shade of the body. */
  d: string;
  /** Lighter shade of the body. */
  l: string;
  /** Secondary material: wood legs, metal trims. */
  w: string;
  /** Neutral dark for details (handles, screens). */
  k: string;
}

/**
 * Each shape is drawn inside an 800×800 canvas with the floor line at y≈600.
 * Shapes are intentionally simple, flat illustrations so the catalogue looks consistent.
 */
export const shapes: Record<ProductKind, (p: ArtPalette) => string> = {
  sofa: ({ c, d, l, w }) => `
    <rect x="150" y="300" width="500" height="190" rx="40" fill="${d}"/>
    <rect x="118" y="420" width="564" height="140" rx="30" fill="${c}"/>
    <rect x="186" y="392" width="140" height="62" rx="20" fill="${l}"/>
    <rect x="330" y="392" width="140" height="62" rx="20" fill="${l}"/>
    <rect x="474" y="392" width="140" height="62" rx="20" fill="${l}"/>
    <rect x="96" y="370" width="92" height="196" rx="42" fill="${c}"/>
    <rect x="612" y="370" width="92" height="196" rx="42" fill="${c}"/>
    <rect x="138" y="562" width="16" height="40" rx="4" fill="${w}"/>
    <rect x="646" y="562" width="16" height="40" rx="4" fill="${w}"/>`,
  sectional: ({ c, d, l, w }) => `
    <rect x="90" y="300" width="470" height="180" rx="36" fill="${d}"/>
    <rect x="520" y="300" width="200" height="180" rx="36" fill="${d}"/>
    <rect x="70" y="420" width="660" height="130" rx="28" fill="${c}"/>
    <rect x="500" y="420" width="230" height="170" rx="28" fill="${c}"/>
    <rect x="130" y="392" width="160" height="58" rx="20" fill="${l}"/>
    <rect x="300" y="392" width="160" height="58" rx="20" fill="${l}"/>
    <rect x="540" y="392" width="160" height="58" rx="20" fill="${l}"/>
    <rect x="52" y="370" width="80" height="186" rx="38" fill="${c}"/>
    <rect x="92" y="552" width="14" height="44" rx="4" fill="${w}"/>
    <rect x="700" y="586" width="14" height="16" rx="4" fill="${w}"/>`,
  armchair: ({ c, d, l, w }) => `
    <path d="M250 200 Q400 150 550 200 L560 470 L240 470 Z" fill="${d}"/>
    <rect x="232" y="420" width="336" height="130" rx="30" fill="${c}"/>
    <rect x="276" y="398" width="248" height="60" rx="22" fill="${l}"/>
    <rect x="196" y="340" width="86" height="214" rx="40" fill="${c}"/>
    <rect x="518" y="340" width="86" height="214" rx="40" fill="${c}"/>
    <path d="M250 550 L232 604 M550 550 L568 604" stroke="${w}" stroke-width="16" stroke-linecap="round"/>`,
  "dining-chair": ({ c, d, w }) => `
    <rect x="290" y="150" width="220" height="250" rx="26" fill="${d}"/>
    <rect x="312" y="174" width="176" height="200" rx="18" fill="${c}" opacity="0.55"/>
    <rect x="270" y="390" width="260" height="56" rx="18" fill="${c}"/>
    <path d="M300 446 L286 604 M500 446 L514 604 M330 446 L338 590 M470 446 L462 590" stroke="${w}" stroke-width="14" stroke-linecap="round"/>`,
  "office-chair": ({ c, d, k }) => `
    <rect x="300" y="140" width="200" height="250" rx="60" fill="${c}"/>
    <rect x="322" y="166" width="156" height="200" rx="48" fill="${d}" opacity="0.5"/>
    <rect x="270" y="400" width="260" height="62" rx="26" fill="${c}"/>
    <rect x="230" y="330" width="40" height="14" rx="7" fill="${k}"/>
    <rect x="530" y="330" width="40" height="14" rx="7" fill="${k}"/>
    <path d="M250 340 L270 410 M550 340 L530 410" stroke="${k}" stroke-width="12" stroke-linecap="round"/>
    <rect x="390" y="460" width="20" height="90" fill="${k}"/>
    <path d="M400 550 L270 590 M400 550 L530 590 M400 550 L330 604 M400 550 L470 604" stroke="${k}" stroke-width="14" stroke-linecap="round"/>
    <circle cx="270" cy="594" r="10" fill="${k}"/><circle cx="530" cy="594" r="10" fill="${k}"/>`,
  bed: ({ c, d, l, w }) => `
    <rect x="110" y="250" width="580" height="250" rx="30" fill="${d}"/>
    <rect x="80" y="430" width="640" height="130" rx="20" fill="${c}"/>
    <rect x="100" y="400" width="600" height="56" rx="16" fill="#f7f5f0"/>
    <rect x="150" y="350" width="220" height="70" rx="26" fill="${l}"/>
    <rect x="430" y="350" width="220" height="70" rx="26" fill="${l}"/>
    <rect x="360" y="420" width="360" height="40" rx="14" fill="${l}" opacity="0.7"/>
    <rect x="96" y="556" width="18" height="44" rx="4" fill="${w}"/>
    <rect x="686" y="556" width="18" height="44" rx="4" fill="${w}"/>`,
  "dining-table": ({ c, d, w }) => `
    <rect x="110" y="360" width="580" height="34" rx="10" fill="${c}"/>
    <rect x="130" y="394" width="540" height="16" fill="${d}"/>
    <path d="M170 410 L180 604 M630 410 L620 604" stroke="${w}" stroke-width="22" stroke-linecap="round"/>
    <rect x="80" y="300" width="90" height="130" rx="18" fill="${d}" opacity="0.85"/>
    <rect x="630" y="300" width="90" height="130" rx="18" fill="${d}" opacity="0.85"/>
    <path d="M100 430 L96 604 M150 430 L154 604 M650 430 L646 604 M700 430 L704 604" stroke="${w}" stroke-width="10" stroke-linecap="round"/>`,
  "coffee-table": ({ c, d, w }) => `
    <ellipse cx="400" cy="440" rx="270" ry="58" fill="${d}"/>
    <ellipse cx="400" cy="428" rx="270" ry="58" fill="${c}"/>
    <path d="M220 470 L200 600 M580 470 L600 600 M330 482 L322 604 M470 482 L478 604" stroke="${w}" stroke-width="14" stroke-linecap="round"/>
    <ellipse cx="330" cy="418" rx="34" ry="10" fill="#ffffff" opacity="0.5"/>`,
  desk: ({ c, d, w, k }) => `
    <rect x="120" y="360" width="560" height="30" rx="8" fill="${c}"/>
    <rect x="480" y="390" width="180" height="150" rx="8" fill="${d}"/>
    <rect x="496" y="410" width="148" height="52" rx="6" fill="${c}"/>
    <rect x="496" y="472" width="148" height="52" rx="6" fill="${c}"/>
    <rect x="556" y="430" width="28" height="8" rx="4" fill="${k}"/>
    <rect x="556" y="492" width="28" height="8" rx="4" fill="${k}"/>
    <path d="M150 390 L150 604 M660 540 L660 604" stroke="${w}" stroke-width="16" stroke-linecap="round"/>
    <rect x="200" y="250" width="170" height="110" rx="8" fill="${k}"/>
    <rect x="276" y="352" width="18" height="10" fill="${k}"/>`,
  wardrobe: ({ c, d, k }) => `
    <rect x="170" y="110" width="460" height="480" rx="10" fill="${d}"/>
    <rect x="182" y="122" width="142" height="456" rx="6" fill="${c}"/>
    <rect x="330" y="122" width="140" height="456" rx="6" fill="#dfe6ea"/>
    <rect x="476" y="122" width="142" height="456" rx="6" fill="${c}"/>
    <path d="M350 160 L440 260 M360 230 L450 330" stroke="#ffffff" stroke-width="10" opacity="0.6"/>
    <rect x="308" y="320" width="8" height="70" rx="4" fill="${k}"/>
    <rect x="484" y="320" width="8" height="70" rx="4" fill="${k}"/>
    <rect x="186" y="588" width="20" height="14" fill="${k}"/><rect x="594" y="588" width="20" height="14" fill="${k}"/>`,
  bookshelf: ({ c, d }) => `
    <rect x="230" y="110" width="340" height="490" rx="8" fill="${d}"/>
    <rect x="248" y="128" width="304" height="454" fill="${c}" opacity="0.35"/>
    ${[200, 300, 400, 500].map((y) => `<rect x="240" y="${y}" width="320" height="14" fill="${d}"/>`).join("")}
    <rect x="262" y="140" width="22" height="60" fill="#3e5c76"/><rect x="288" y="150" width="18" height="50" fill="#c06c4e"/><rect x="310" y="136" width="24" height="64" fill="#e3d8c3"/>
    <rect x="420" y="250" width="70" height="50" rx="24" fill="#8fa58a"/>
    <rect x="270" y="346" width="20" height="54" fill="#2f4858"/><rect x="294" y="340" width="26" height="60" fill="#c9a66b"/>
    <circle cx="470" cy="470" r="26" fill="#b5654a"/>
    <rect x="300" y="452" width="80" height="48" fill="#eeeae2"/>`,
  "tv-unit": ({ c, d, k, w }) => `
    <rect x="90" y="440" width="620" height="130" rx="10" fill="${c}"/>
    <rect x="104" y="454" width="190" height="102" rx="6" fill="${d}"/>
    <rect x="304" y="454" width="192" height="46" rx="4" fill="${d}" opacity="0.6"/>
    <rect x="304" y="508" width="192" height="48" rx="4" fill="${d}" opacity="0.6"/>
    <rect x="506" y="454" width="190" height="102" rx="6" fill="${d}"/>
    <path d="M120 570 L116 604 M680 570 L684 604" stroke="${w}" stroke-width="12" stroke-linecap="round"/>
    <rect x="200" y="180" width="400" height="236" rx="10" fill="${k}"/>
    <rect x="212" y="192" width="376" height="212" rx="4" fill="#2f3b48"/>
    <rect x="380" y="416" width="40" height="24" fill="${k}"/>`,
  refrigerator: ({ c, d, k }) => `
    <rect x="250" y="80" width="300" height="520" rx="22" fill="${c}"/>
    <rect x="250" y="80" width="300" height="190" rx="22" fill="${d}" opacity="0.35"/>
    <rect x="250" y="272" width="300" height="6" fill="${d}"/>
    <rect x="512" y="150" width="12" height="90" rx="6" fill="${k}"/>
    <rect x="512" y="310" width="12" height="140" rx="6" fill="${k}"/>
    <rect x="280" y="110" width="60" height="26" rx="6" fill="${k}" opacity="0.7"/>
    <path d="M270 120 L330 260" stroke="#ffffff" stroke-width="18" opacity="0.18"/>`,
  "washing-machine": ({ c, d, k, l }) => `
    <rect x="230" y="150" width="340" height="450" rx="20" fill="${c}"/>
    <rect x="230" y="150" width="340" height="90" rx="20" fill="${d}" opacity="0.4"/>
    <rect x="260" y="180" width="110" height="30" rx="8" fill="${k}"/>
    <circle cx="520" cy="195" r="20" fill="${d}"/>
    <circle cx="400" cy="410" r="128" fill="${d}"/>
    <circle cx="400" cy="410" r="104" fill="#34495e"/>
    <circle cx="400" cy="410" r="86" fill="${l}" opacity="0.4"/>
    <path d="M340 370 Q400 330 460 380" stroke="#ffffff" stroke-width="10" fill="none" opacity="0.5"/>`,
  television: ({ k, c }) => `
    <rect x="90" y="150" width="620" height="360" rx="12" fill="${k}"/>
    <rect x="104" y="164" width="592" height="332" rx="4" fill="#1f2a36"/>
    <path d="M104 420 Q300 300 470 360 T696 260 L696 496 L104 496 Z" fill="${c}" opacity="0.75"/>
    <circle cx="560" cy="250" r="40" fill="#f1c27d" opacity="0.8"/>
    <path d="M300 510 L260 600 M500 510 L540 600" stroke="${k}" stroke-width="14" stroke-linecap="round"/>`,
  "air-conditioner": ({ c, d, k }) => `
    <rect x="110" y="220" width="580" height="190" rx="40" fill="${c}"/>
    <rect x="110" y="340" width="580" height="70" rx="30" fill="${d}" opacity="0.35"/>
    <rect x="150" y="370" width="500" height="10" rx="5" fill="${k}" opacity="0.6"/>
    <rect x="560" y="258" width="80" height="22" rx="6" fill="${k}" opacity="0.8"/>
    <text x="600" y="275" font-family="sans-serif" font-size="16" fill="#7fe0ff" text-anchor="middle">24°</text>
    <path d="M240 440 q20 30 0 60 M400 440 q20 30 0 60 M560 440 q20 30 0 60" stroke="#9fd3ea" stroke-width="8" fill="none" stroke-linecap="round" opacity="0.8"/>`,
  microwave: ({ c, d, k }) => `
    <rect x="150" y="270" width="500" height="300" rx="20" fill="${c}"/>
    <rect x="180" y="300" width="320" height="240" rx="12" fill="${k}"/>
    <rect x="200" y="320" width="280" height="200" rx="8" fill="#38424d"/>
    <rect x="520" y="300" width="110" height="240" rx="10" fill="${d}"/>
    <rect x="535" y="318" width="80" height="30" rx="5" fill="#0d1a12"/>
    <text x="575" y="340" font-family="monospace" font-size="18" fill="#7fffa8" text-anchor="middle">12:00</text>
    <circle cx="575" cy="430" r="30" fill="${k}"/>
    <path d="M200 340 L280 500" stroke="#ffffff" stroke-width="14" opacity="0.12"/>`,
  mixer: ({ c, d, l, k }) => `
    <path d="M300 420 L500 420 L520 600 L280 600 Z" fill="${c}"/>
    <rect x="320" y="470" width="160" height="40" rx="10" fill="${d}"/>
    <circle cx="400" cy="560" r="18" fill="${k}"/>
    <path d="M320 140 L480 140 L460 420 L340 420 Z" fill="${l}" opacity="0.55" stroke="${d}" stroke-width="6"/>
    <rect x="310" y="120" width="180" height="30" rx="10" fill="${k}"/>
    <path d="M480 200 Q540 200 540 260 L540 330 Q540 370 470 370" stroke="${d}" stroke-width="16" fill="none"/>`,
  "air-purifier": ({ c, d, k }) => `
    <rect x="290" y="140" width="220" height="460" rx="40" fill="${c}"/>
    <rect x="290" y="140" width="220" height="80" rx="40" fill="${d}" opacity="0.4"/>
    ${Array.from({ length: 10 }, (_, i) => `<rect x="320" y="${260 + i * 30}" width="160" height="10" rx="5" fill="${d}" opacity="0.45"/>`).join("")}
    <circle cx="400" cy="180" r="18" fill="#7bd389"/>
    <rect x="360" y="226" width="80" height="8" rx="4" fill="${k}" opacity="0.5"/>`,
  dishwasher: ({ c, d, k }) => `
    <rect x="230" y="150" width="340" height="450" rx="16" fill="${c}"/>
    <rect x="230" y="150" width="340" height="70" rx="16" fill="${d}"/>
    <rect x="300" y="174" width="120" height="24" rx="6" fill="${k}"/>
    <circle cx="510" cy="186" r="12" fill="#7bd389"/>
    <rect x="300" y="250" width="200" height="14" rx="7" fill="${k}" opacity="0.7"/>
    <path d="M260 300 L330 580" stroke="#ffffff" stroke-width="20" opacity="0.15"/>`,
  lamp: ({ c, d, w }) => `
    <path d="M300 150 L500 150 L560 330 L240 330 Z" fill="${c}"/>
    <path d="M300 150 L500 150 L510 180 L290 180 Z" fill="${d}" opacity="0.35"/>
    <ellipse cx="400" cy="330" rx="160" ry="16" fill="#fff6d8" opacity="0.8"/>
    <rect x="392" y="330" width="16" height="240" fill="${w}"/>
    <ellipse cx="400" cy="590" rx="90" ry="18" fill="${w}"/>`,
  vase: ({ c, d, l }) => `
    <path d="M360 210 Q340 260 300 320 Q250 420 300 520 Q330 590 400 596 Q470 590 500 520 Q550 420 500 320 Q460 260 440 210 Z" fill="${c}"/>
    <rect x="352" y="190" width="96" height="30" rx="10" fill="${d}"/>
    <path d="M320 380 Q400 410 480 380" stroke="${l}" stroke-width="10" fill="none" opacity="0.7"/>
    <path d="M310 450 Q400 480 490 450" stroke="${l}" stroke-width="10" fill="none" opacity="0.7"/>
    <path d="M400 190 Q380 110 330 80 M400 190 Q430 120 480 100 M400 190 Q400 100 410 60" stroke="#6b7f5a" stroke-width="6" fill="none"/>
    <circle cx="330" cy="80" r="14" fill="#c9a66b"/><circle cx="480" cy="100" r="14" fill="#c9a66b"/><circle cx="410" cy="60" r="12" fill="#c9a66b"/>`,
  rug: ({ c, d, l }) => `
    <path d="M140 360 L660 360 L740 590 L60 590 Z" fill="${c}"/>
    <path d="M180 380 L620 380 L688 570 L112 570 Z" fill="none" stroke="${l}" stroke-width="10"/>
    <path d="M400 410 L470 470 L400 530 L330 470 Z" fill="${d}"/>
    <path d="M250 430 L290 470 L250 510 L210 470 Z M550 430 L590 470 L550 510 L510 470 Z" fill="${l}" opacity="0.8"/>
    ${Array.from({ length: 22 }, (_, i) => `<rect x="${72 + i * 30}" y="590" width="4" height="16" fill="${d}"/>`).join("")}`,
  mirror: ({ c, d }) => `
    <path d="M280 600 L280 260 A120 120 0 0 1 520 260 L520 600 Z" fill="${c}"/>
    <path d="M300 584 L300 262 A100 100 0 0 1 500 262 L500 584 Z" fill="#dbe7ee"/>
    <path d="M330 300 L420 200 M340 380 L470 240" stroke="#ffffff" stroke-width="16" opacity="0.6"/>
    <rect x="270" y="590" width="260" height="12" rx="6" fill="${d}"/>`,
  "wall-art": ({ c, d, l }) => `
    <rect x="110" y="200" width="170" height="260" fill="#ffffff" stroke="${d}" stroke-width="10"/>
    <rect x="315" y="170" width="170" height="320" fill="#ffffff" stroke="${d}" stroke-width="10"/>
    <rect x="520" y="200" width="170" height="260" fill="#ffffff" stroke="${d}" stroke-width="10"/>
    <circle cx="195" cy="300" r="50" fill="${c}"/>
    <path d="M330 420 Q400 250 470 420 Z" fill="${l}"/>
    <rect x="550" y="260" width="110" height="110" fill="${c}" opacity="0.7"/>
    <path d="M330 300 L470 300" stroke="${c}" stroke-width="12"/>`,
  cushion: ({ c, d, l }) => `
    <path d="M200 260 Q400 220 600 260 Q640 400 600 540 Q400 580 200 540 Q160 400 200 260 Z" fill="${c}"/>
    <path d="M250 300 Q400 280 550 300 Q580 400 550 500 Q400 520 250 500 Q220 400 250 300 Z" fill="none" stroke="${l}" stroke-width="8" stroke-dasharray="20 14"/>
    <circle cx="400" cy="400" r="40" fill="${d}"/>
    <circle cx="400" cy="400" r="18" fill="${l}"/>`,
  clock: ({ c, d, k }) => `
    <circle cx="400" cy="360" r="220" fill="${c}"/>
    <circle cx="400" cy="360" r="196" fill="#fbfaf7"/>
    ${Array.from({ length: 12 }, (_, i) => {
      const a = (i * Math.PI) / 6;
      const x1 = 400 + Math.sin(a) * 170;
      const y1 = 360 - Math.cos(a) * 170;
      const x2 = 400 + Math.sin(a) * 186;
      const y2 = 360 - Math.cos(a) * 186;
      return `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="${d}" stroke-width="${i % 3 === 0 ? 8 : 4}"/>`;
    }).join("")}
    <line x1="400" y1="360" x2="400" y2="240" stroke="${k}" stroke-width="10" stroke-linecap="round"/>
    <line x1="400" y1="360" x2="490" y2="410" stroke="${k}" stroke-width="7" stroke-linecap="round"/>
    <circle cx="400" cy="360" r="12" fill="${k}"/>`,
  planter: ({ c, d }) => `
    <path d="M280 400 L520 400 L490 600 L310 600 Z" fill="${c}"/>
    ${[430, 470, 510, 550].map((y) => `<path d="M${286 + (y - 400) * 0.15} ${y} L${514 - (y - 400) * 0.15} ${y}" stroke="${d}" stroke-width="6" opacity="0.5"/>`).join("")}
    <rect x="270" y="390" width="260" height="22" rx="8" fill="${d}"/>
    <path d="M400 390 Q330 280 250 250 Q320 330 380 390 Z" fill="#5f7f52"/>
    <path d="M400 390 Q470 250 560 220 Q480 320 420 390 Z" fill="#6f9460"/>
    <path d="M400 390 Q400 230 430 150 Q440 280 410 390 Z" fill="#4f6d45"/>`,
};

export const ART_KINDS = Object.keys(shapes) as ProductKind[];
