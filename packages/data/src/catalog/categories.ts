import type { Category, Department } from "@teziko/types";

export const departments: { slug: string; department: Department; name: string }[] = [
  { slug: "furniture", department: "furniture", name: "Furniture" },
  { slug: "home-appliances", department: "appliances", name: "Home Appliances" },
  { slug: "home-decor", department: "decor", name: "Home Decor" },
];

export const categories: Category[] = [
  // Departments (top level)
  {
    slug: "furniture",
    name: "Furniture",
    department: "furniture",
    description: "Sofas, beds, dining, storage and workspaces built for everyday living.",
    heroKind: "sofa",
    tint: "#c9b79c",
  },
  {
    slug: "home-appliances",
    name: "Home Appliances",
    department: "appliances",
    description: "Energy-efficient refrigerators, ACs, TVs and kitchen helpers.",
    heroKind: "refrigerator",
    tint: "#a9adb1",
  },
  {
    slug: "home-decor",
    name: "Home Decor",
    department: "decor",
    description: "Lighting, rugs, mirrors and handmade pieces that finish a room.",
    heroKind: "lamp",
    tint: "#b08d57",
  },

  // Furniture
  {
    slug: "sofas",
    parent: "furniture",
    name: "Sofas & Sectionals",
    department: "furniture",
    description: "Three-seaters, loveseats, L-shapes and sofa cum beds.",
    heroKind: "sofa",
    tint: "#8c8c88",
  },
  {
    slug: "armchairs",
    parent: "furniture",
    name: "Armchairs & Accent Chairs",
    department: "furniture",
    description: "Wingbacks, easy chairs and statement seats.",
    heroKind: "armchair",
    tint: "#2f6f73",
  },
  {
    slug: "beds",
    parent: "furniture",
    name: "Beds",
    department: "furniture",
    description: "Upholstered, solid wood and storage beds in single, queen and king.",
    heroKind: "bed",
    tint: "#7d7f82",
  },
  {
    slug: "dining",
    parent: "furniture",
    name: "Dining",
    department: "furniture",
    description: "Dining sets, tables and chairs for two to six.",
    heroKind: "dining-table",
    tint: "#b07a44",
  },
  {
    slug: "tables",
    parent: "furniture",
    name: "Coffee & Side Tables",
    department: "furniture",
    description: "Coffee tables, nesting sets and side tables.",
    heroKind: "coffee-table",
    tint: "#5e3c24",
  },
  {
    slug: "wardrobes",
    parent: "furniture",
    name: "Wardrobes",
    department: "furniture",
    description: "Hinged and sliding wardrobes with mirrors, lockers and soft-close doors.",
    heroKind: "wardrobe",
    tint: "#4b3a2f",
  },
  {
    slug: "storage",
    parent: "furniture",
    name: "Bookshelves & TV Units",
    department: "furniture",
    description: "Bookshelves, bookcases and media units.",
    heroKind: "bookshelf",
    tint: "#5e3c24",
  },
  {
    slug: "study-office",
    parent: "furniture",
    name: "Study & Office",
    department: "furniture",
    description: "Desks and ergonomic chairs for work from home.",
    heroKind: "office-chair",
    tint: "#5a6068",
  },

  // Appliances
  {
    slug: "refrigerators",
    parent: "home-appliances",
    name: "Refrigerators",
    department: "appliances",
    description: "Single door, double door, convertible and side-by-side.",
    heroKind: "refrigerator",
    tint: "#a9adb1",
  },
  {
    slug: "washing-machines",
    parent: "home-appliances",
    name: "Washing Machines",
    department: "appliances",
    description: "Front load, top load and washer dryers.",
    heroKind: "washing-machine",
    tint: "#d9dcdf",
  },
  {
    slug: "televisions",
    parent: "home-appliances",
    name: "Televisions",
    department: "appliances",
    description: "HD, 4K QLED and Mini-LED smart TVs.",
    heroKind: "television",
    tint: "#2b3a55",
  },
  {
    slug: "air-conditioners",
    parent: "home-appliances",
    name: "Air Conditioners",
    department: "appliances",
    description: "Inverter split ACs from 1 to 2 ton.",
    heroKind: "air-conditioner",
    tint: "#e6eaee",
  },
  {
    slug: "kitchen-appliances",
    parent: "home-appliances",
    name: "Kitchen Appliances",
    department: "appliances",
    description: "Microwaves, mixer grinders and dishwashers.",
    heroKind: "microwave",
    tint: "#3a3a3c",
  },
  {
    slug: "air-purifiers",
    parent: "home-appliances",
    name: "Air Purifiers",
    department: "appliances",
    description: "HEPA purifiers for bedrooms and living rooms.",
    heroKind: "air-purifier",
    tint: "#e9e6e0",
  },

  // Decor
  {
    slug: "lighting",
    parent: "home-decor",
    name: "Lighting",
    department: "decor",
    description: "Floor lamps, table lamps and pendants.",
    heroKind: "lamp",
    tint: "#b08d57",
  },
  {
    slug: "rugs",
    parent: "home-decor",
    name: "Rugs & Dhurries",
    department: "decor",
    description: "Hand-woven kilims, jute and tufted wool rugs.",
    heroKind: "rug",
    tint: "#b5654a",
  },
  {
    slug: "mirrors",
    parent: "home-decor",
    name: "Mirrors",
    department: "decor",
    description: "Floor, wall and sunburst mirrors.",
    heroKind: "mirror",
    tint: "#b08d57",
  },
  {
    slug: "wall-decor",
    parent: "home-decor",
    name: "Wall Decor & Clocks",
    department: "decor",
    description: "Canvas art and wall clocks.",
    heroKind: "wall-art",
    tint: "#2f5d50",
  },
  {
    slug: "vases-planters",
    parent: "home-decor",
    name: "Vases & Planters",
    department: "decor",
    description: "Terracotta, ceramic and glazed vessels.",
    heroKind: "vase",
    tint: "#b5654a",
  },
  {
    slug: "cushions-throws",
    parent: "home-decor",
    name: "Cushions & Throws",
    department: "decor",
    description: "Block-print covers and cotton throws.",
    heroKind: "cushion",
    tint: "#c99a2e",
  },
];

export const categoryBySlug = new Map(categories.map((c) => [c.slug, c]));

export function getSubcategories(parent: string) {
  return categories.filter((c) => c.parent === parent);
}

export function departmentSlug(dep: Department) {
  return departments.find((d) => d.department === dep)!.slug;
}
