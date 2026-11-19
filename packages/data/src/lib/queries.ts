import type { Department, FilterState, Product, SortKey, StockStatus } from "@teziko/types";
import { brandBySlug } from "../catalog/brands";
import { categoryBySlug } from "../catalog/categories";
import { products } from "../catalog";

export const PAGE_SIZE = 12;
export const LOW_STOCK_THRESHOLD = 5;

export function totalStock(p: Product) {
  return p.variants.reduce((s, v) => s + v.stock, 0);
}

export function stockStatus(stock: number): StockStatus {
  if (stock <= 0) return "out-of-stock";
  if (stock <= LOW_STOCK_THRESHOLD) return "low-stock";
  return "in-stock";
}

export function productStockStatus(p: Product) {
  return stockStatus(totalStock(p));
}

function normalise(s: string) {
  return s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9 ]/g, " ");
}

/** Lightweight relevance search over name, brand, category and tags. */
export function searchProducts(query: string, list: Product[] = products): Product[] {
  const terms = normalise(query).split(/\s+/).filter(Boolean);
  if (terms.length === 0) return list;
  const scored = list
    .map((p) => {
      const brand = brandBySlug.get(p.brand)?.name ?? "";
      const cat = categoryBySlug.get(p.subcategory)?.name ?? "";
      const hay = normalise(
        `${p.name} ${brand} ${cat} ${p.kind} ${p.tags.join(" ")} ${p.shortDescription}`,
      );
      const name = normalise(p.name);
      let score = 0;
      for (const t of terms) {
        if (!hay.includes(t)) return { p, score: -1 };
        score += name.includes(t) ? 3 : 1;
      }
      return { p, score };
    })
    .filter((x) => x.score > 0);
  return scored.sort((a, b) => b.score - a.score || b.p.sold - a.p.sold).map((x) => x.p);
}

export function allColours(list: Product[]) {
  const map = new Map<string, string>();
  for (const p of list) for (const v of p.variants) map.set(v.colour.name, v.colour.hex);
  return [...map.entries()]
    .map(([name, hex]) => ({ name, hex }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function allMaterials(list: Product[]) {
  return [...new Set(list.flatMap((p) => p.materials))].sort();
}

const sorters: Record<SortKey, (a: Product, b: Product) => number> = {
  popular: (a, b) => b.sold - a.sold,
  newest: (a, b) => b.listedAt.localeCompare(a.listedAt),
  "price-asc": (a, b) => a.price - b.price,
  "price-desc": (a, b) => b.price - a.price,
  rating: (a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount,
};

export interface ListingScope {
  department?: Department;
  category?: string;
  tag?: Product["tags"][number];
}

export interface ListingResult {
  items: Product[];
  total: number;
  page: number;
  pageCount: number;
  /** Facets are computed from the scope before user filters, so options never disappear. */
  facets: {
    categories: { slug: string; name: string; count: number }[];
    brands: { slug: string; name: string; count: number }[];
    colours: { name: string; hex: string }[];
    materials: string[];
    priceRange: [number, number];
  };
}

export function inScope(p: Product, scope: ListingScope) {
  if (scope.department && p.department !== scope.department) return false;
  if (scope.category && p.category !== scope.category && p.subcategory !== scope.category)
    return false;
  if (scope.tag && !p.tags.includes(scope.tag)) return false;
  return true;
}

export function listProducts(scope: ListingScope, f: FilterState): ListingResult {
  const scoped = products.filter((p) => inScope(p, scope));
  let items = f.q ? searchProducts(f.q, scoped) : scoped;

  if (f.category?.length) items = items.filter((p) => f.category!.includes(p.subcategory));
  if (f.brand?.length) items = items.filter((p) => f.brand!.includes(p.brand));
  if (f.minPrice !== undefined) items = items.filter((p) => p.price >= f.minPrice!);
  if (f.maxPrice !== undefined) items = items.filter((p) => p.price <= f.maxPrice!);
  if (f.rating) items = items.filter((p) => p.rating >= f.rating!);
  if (f.availability === "in-stock") items = items.filter((p) => totalStock(p) > 0);
  if (f.colour?.length)
    items = items.filter((p) => p.variants.some((v) => f.colour!.includes(v.colour.name)));
  if (f.material?.length)
    items = items.filter((p) => p.materials.some((m) => f.material!.includes(m)));

  if (f.sort || !f.q) items = [...items].sort(sorters[f.sort ?? "popular"]);

  const total = items.length;
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const page = Math.min(Math.max(1, f.page ?? 1), pageCount);

  const count = <K extends string>(key: (p: Product) => K) => {
    const m = new Map<K, number>();
    for (const p of scoped) m.set(key(p), (m.get(key(p)) ?? 0) + 1);
    return m;
  };
  const prices = scoped.map((p) => p.price);

  return {
    items: items.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    total,
    page,
    pageCount,
    facets: {
      categories: [...count((p) => p.subcategory)].map(([slug, n]) => ({
        slug,
        name: categoryBySlug.get(slug)?.name ?? slug,
        count: n,
      })),
      brands: [...count((p) => p.brand)]
        .map(([slug, n]) => ({ slug, name: brandBySlug.get(slug)?.name ?? slug, count: n }))
        .sort((a, b) => a.name.localeCompare(b.name)),
      colours: allColours(scoped),
      materials: allMaterials(scoped),
      priceRange: prices.length ? [Math.min(...prices), Math.max(...prices)] : [0, 0],
    },
  };
}

const SORT_KEYS: SortKey[] = ["popular", "newest", "price-asc", "price-desc", "rating"];

type Params = Record<string, string | string[] | undefined>;

function list(v: string | string[] | undefined) {
  if (!v) return undefined;
  const arr = (Array.isArray(v) ? v : v.split(",")).map((s) => s.trim()).filter(Boolean);
  return arr.length ? arr.slice(0, 20) : undefined;
}

function num(v: string | string[] | undefined) {
  const s = Array.isArray(v) ? v[0] : v;
  if (!s) return undefined;
  const n = Number(s);
  return Number.isFinite(n) && n >= 0 ? n : undefined;
}

/** Parses URL search params into a typed, sanitised filter state. */
export function parseFilters(sp: Params): FilterState {
  const sort = (Array.isArray(sp.sort) ? sp.sort[0] : sp.sort) as SortKey | undefined;
  const q = (Array.isArray(sp.q) ? sp.q[0] : sp.q)?.trim().slice(0, 80);
  const rating = num(sp.rating);
  return {
    q: q || undefined,
    category: list(sp.category),
    brand: list(sp.brand),
    colour: list(sp.colour),
    material: list(sp.material),
    minPrice: num(sp.min),
    maxPrice: num(sp.max),
    rating: rating && rating >= 1 && rating <= 5 ? rating : undefined,
    availability: sp.stock === "in" ? "in-stock" : undefined,
    sort: sort && SORT_KEYS.includes(sort) ? sort : undefined,
    page: num(sp.page),
  };
}

export function relatedProducts(p: Product, n = 8) {
  return products
    .filter((x) => x.id !== p.id && (x.subcategory === p.subcategory || x.category === p.category))
    .sort(
      (a, b) =>
        Number(b.subcategory === p.subcategory) - Number(a.subcategory === p.subcategory) ||
        b.sold - a.sold,
    )
    .slice(0, n);
}

export function productsByTag(tag: Product["tags"][number], n = 12) {
  return products
    .filter((p) => p.tags.includes(tag))
    .sort((a, b) => b.sold - a.sold)
    .slice(0, n);
}

export function newArrivals(n = 8) {
  return [...products].sort((a, b) => b.listedAt.localeCompare(a.listedAt)).slice(0, n);
}

export function bestSellers(department?: Department, n = 10) {
  return products
    .filter((p) => !department || p.department === department)
    .sort((a, b) => b.sold - a.sold)
    .slice(0, n);
}
