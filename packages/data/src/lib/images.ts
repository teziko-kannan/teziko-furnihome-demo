import type { Category, Product, ProductKind } from "@teziko/types";
import { artBlurDataUrl, artUrl } from "../art/url";

export interface ProductImage {
  src: string;
  alt: string;
  blurDataURL: string;
  width: number;
  height: number;
}

const VIEW_LABELS = [
  "front view",
  "three-quarter view",
  "close-up detail",
  "styled in a room",
  "dimensions",
];

/**
 * The single place product images are resolved. Swap this implementation to point at a CDN
 * or real photography (e.g. `${CDN}/${product.slug}/${index}.jpg`) and every page follows.
 */
export function getProductImage(
  product: Pick<Product, "kind" | "name" | "variants">,
  index = 0,
  colourHex?: string,
): ProductImage {
  const hex = (colourHex ?? product.variants[0]?.colour.hex ?? "#cccccc").replace("#", "");
  return {
    src: artUrl(product.kind, hex, index),
    alt: `${product.name}, ${VIEW_LABELS[index % VIEW_LABELS.length]}`,
    blurDataURL: artBlurDataUrl(hex),
    width: 800,
    height: 800,
  };
}

export function getProductImages(
  product: Pick<Product, "kind" | "name" | "variants" | "imageCount">,
  colourHex?: string,
) {
  return Array.from({ length: product.imageCount }, (_, i) =>
    getProductImage(product, i, colourHex),
  );
}

export function getKindImage(kind: ProductKind, hex: string, view = 0, alt = ""): ProductImage {
  return {
    src: artUrl(kind, hex, view),
    alt,
    blurDataURL: artBlurDataUrl(hex),
    width: 800,
    height: 800,
  };
}

export function getCategoryImage(category: Pick<Category, "heroKind" | "tint" | "name">, view = 0) {
  return getKindImage(category.heroKind, category.tint, view, category.name);
}
