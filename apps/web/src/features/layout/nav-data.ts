import {
  categories,
  departments,
  getCategoryImage,
  getSubcategories,
  products,
  searchFields,
} from "@teziko/data";
import type { ProductImage } from "@teziko/data/images";

export interface NavDepartment {
  slug: string;
  name: string;
  href: string;
  description: string;
  image: ProductImage;
  columns: { slug: string; name: string; href: string; items: { name: string; href: string }[] }[];
}

export interface SearchEntry {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  kind: string;
  hex: string;
  keywords: string;
  body: string;
}

/** Built on the server and passed to client chrome, so the full catalogue never ships to the browser. */
export function buildNav(): NavDepartment[] {
  return departments.map((d) => {
    const cat = categories.find((c) => c.slug === d.slug)!;
    return {
      slug: d.slug,
      name: d.name,
      href: `/${d.slug}`,
      description: cat.description,
      image: getCategoryImage(cat, 3),
      columns: getSubcategories(d.slug).map((s) => ({
        slug: s.slug,
        name: s.name,
        href: `/category/${s.slug}`,
        items: products
          .filter((p) => p.subcategory === s.slug)
          .sort((a, b) => b.sold - a.sold)
          .slice(0, 3)
          .map((p) => ({ name: p.name, href: `/product/${p.slug}` })),
      })),
    };
  });
}

export function buildSearchIndex(): SearchEntry[] {
  return products.map((p) => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    brand: p.brand,
    category: categories.find((c) => c.slug === p.subcategory)?.name ?? "",
    price: p.price,
    kind: p.kind,
    hex: p.variants[0]!.colour.hex.replace("#", ""),
    keywords: searchFields(p).keywords,
    body: `${searchFields(p).body} ${p.variants.map((v) => v.colour.name).join(" ")}`,
  }));
}
