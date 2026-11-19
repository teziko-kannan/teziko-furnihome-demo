import type { Product, ProductKind, ProductTag, ProductVariant } from "@teziko/types";
import { categoryBySlug } from "./categories";

export interface VariantOpt {
  label: string;
  /** Rupees added to (or removed from) the base price. */
  delta?: number;
}

export interface ProductDef {
  name: string;
  brand: string;
  sub: string;
  kind: ProductKind;
  price: number;
  mrp: number;
  short: string;
  description: string;
  highlights: string[];
  specs: [label: string, value: string][];
  /** [name, hex] */
  colours: [string, string][];
  sizes?: VariantOpt[];
  materials?: VariantOpt[];
  warranty: number;
  listed: string;
  sold: number;
  tags?: ProductTag[];
  assembly?: Product["assembly"];
  delivery?: [number, number];
  bulky?: boolean;
  gst?: number;
  images?: number;
}

/** Deterministic 32-bit string hash (FNV-1a). */
export function hash(str: string) {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/** Small deterministic PRNG so seeded data is identical on server and client. */
export function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/["'()]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function key(s: string) {
  return slugify(s).slice(0, 10);
}

function stockFor(sku: string, index: number) {
  const h = hash(sku);
  if (index > 0 && h % 9 === 0) return 0;
  if (h % 6 === 0) return 2 + (h % 4);
  return 8 + (h % 40);
}

export function buildProduct(
  def: ProductDef,
  index: number,
): Omit<Product, "rating" | "reviewCount"> {
  const sub = categoryBySlug.get(def.sub);
  if (!sub?.parent) throw new Error(`Unknown subcategory ${def.sub}`);
  const id = `p${String(index + 1).padStart(3, "0")}`;
  const slug = slugify(def.name);
  const axis: VariantOpt[] = def.sizes ?? def.materials ?? [{ label: "" }];
  const axisKind = def.sizes ? "size" : def.materials ? "material" : null;

  const variants: ProductVariant[] = [];
  def.colours.forEach(([name, hex]) => {
    axis.forEach((opt) => {
      const sku = [id, key(name), opt.label ? key(opt.label) : null]
        .filter(Boolean)
        .join("-")
        .toUpperCase();
      variants.push({
        sku,
        colour: { name, hex },
        size: axisKind === "size" ? opt.label : undefined,
        material: axisKind === "material" ? opt.label : undefined,
        priceDelta: opt.delta ?? 0,
        stock: stockFor(sku, variants.length),
      });
    });
  });

  const materials =
    def.materials?.map((m) => m.label) ??
    def.specs.filter(([l]) => /material|fabric|finish/i.test(l)).map(([, v]) => v);

  return {
    id,
    slug,
    name: def.name,
    brand: def.brand,
    department: sub.department,
    category: sub.parent,
    subcategory: def.sub,
    kind: def.kind,
    shortDescription: def.short,
    description: def.description,
    highlights: def.highlights,
    price: def.price,
    mrp: def.mrp,
    gstRate: def.gst ?? 18,
    variants,
    specs: def.specs.map(([label, value]) => ({ label, value })),
    materials,
    warrantyMonths: def.warranty,
    imageCount: def.images ?? 4,
    sold: def.sold,
    listedAt: def.listed,
    tags: def.tags ?? [],
    assembly:
      def.assembly ??
      (sub.department === "furniture"
        ? "free-installation"
        : sub.department === "appliances"
          ? "free-installation"
          : "none"),
    deliveryDays: def.delivery ?? (sub.department === "decor" ? [3, 6] : [5, 10]),
    bulky: def.bulky ?? sub.department !== "decor",
  };
}
