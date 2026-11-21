"use client";

import type { ProductKind } from "@teziko/types";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const storage = createJSONStorage(() => localStorage);

export interface CartItem {
  productId: string;
  sku: string;
  quantity: number;
  /** Display snapshot for instant rendering. Totals are always re-priced from the catalogue. */
  name: string;
  slug: string;
  variantLabel: string;
  unitPrice: number;
  unitMrp: number;
  kind: ProductKind;
  hex: string;
}

interface CartState {
  items: CartItem[];
  couponCode: string | null;
  add: (item: Omit<CartItem, "quantity">, qty?: number) => void;
  setQuantity: (sku: string, qty: number) => void;
  remove: (sku: string) => void;
  clear: () => void;
  applyCoupon: (code: string) => void;
  removeCoupon: () => void;
}

export const MAX_QTY = 10;

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      couponCode: null,
      add: (item, qty = 1) =>
        set((s) => {
          const existing = s.items.find((i) => i.sku === item.sku);
          if (existing) {
            return {
              items: s.items.map((i) =>
                i.sku === item.sku ? { ...i, quantity: Math.min(MAX_QTY, i.quantity + qty) } : i,
              ),
            };
          }
          return { items: [{ ...item, quantity: Math.min(MAX_QTY, qty) }, ...s.items] };
        }),
      setQuantity: (sku, qty) =>
        set((s) => ({
          items: s.items.map((i) =>
            i.sku === sku ? { ...i, quantity: Math.max(1, Math.min(MAX_QTY, qty)) } : i,
          ),
        })),
      remove: (sku) => set((s) => ({ items: s.items.filter((i) => i.sku !== sku) })),
      clear: () => set({ items: [], couponCode: null }),
      applyCoupon: (code) => set({ couponCode: code.trim().toUpperCase() }),
      removeCoupon: () => set({ couponCode: null }),
    }),
    { name: "tz-cart", storage, version: 1 },
  ),
);

interface IdListState {
  ids: string[];
  toggle: (id: string) => boolean;
  remove: (id: string) => void;
  clear: () => void;
}

export const useWishlist = create<IdListState>()(
  persist(
    (set, get) => ({
      ids: [],
      toggle: (id) => {
        const has = get().ids.includes(id);
        set({ ids: has ? get().ids.filter((x) => x !== id) : [id, ...get().ids] });
        return !has;
      },
      remove: (id) => set((s) => ({ ids: s.ids.filter((x) => x !== id) })),
      clear: () => set({ ids: [] }),
    }),
    { name: "tz-wishlist", storage, version: 1 },
  ),
);

export const COMPARE_MAX = 4;

export interface CompareCategory {
  slug: string;
  name: string;
}

interface CompareState {
  ids: string[];
  /** Subcategory being compared: only like-for-like products can be compared side by side. */
  category: CompareCategory | null;
  toggle: (id: string, category: CompareCategory) => "added" | "removed" | "full" | "mismatch";
  /** Starts a new comparison with this product (offered after a category mismatch). */
  replace: (id: string, category: CompareCategory) => void;
  remove: (id: string) => void;
  clear: () => void;
}

export const useCompare = create<CompareState>()(
  persist(
    (set, get) => ({
      ids: [],
      category: null,
      toggle: (id, category) => {
        const { ids, category: current } = get();
        if (ids.includes(id)) {
          const next = ids.filter((x) => x !== id);
          set({ ids: next, category: next.length ? current : null });
          return "removed";
        }
        if (ids.length > 0 && current && current.slug !== category.slug) return "mismatch";
        if (ids.length >= COMPARE_MAX) return "full";
        set({ ids: [...ids, id], category });
        return "added";
      },
      replace: (id, category) => set({ ids: [id], category }),
      remove: (id) =>
        set((s) => {
          const ids = s.ids.filter((x) => x !== id);
          return { ids, category: ids.length ? s.category : null };
        }),
      clear: () => set({ ids: [], category: null }),
    }),
    // v2 adds the category lock; lists saved by v1 may mix categories, so they are cleared.
    { name: "tz-compare", storage, version: 2, migrate: () => ({ ids: [], category: null }) },
  ),
);

interface RecentState {
  ids: string[];
  push: (id: string) => void;
  clear: () => void;
}

export const useRecentlyViewed = create<RecentState>()(
  persist(
    (set) => ({
      ids: [],
      push: (id) => set((s) => ({ ids: [id, ...s.ids.filter((x) => x !== id)].slice(0, 12) })),
      clear: () => set({ ids: [] }),
    }),
    { name: "tz-recent", storage, version: 1 },
  ),
);

/** Non-persisted UI state. */
interface UiState {
  cartOpen: boolean;
  searchOpen: boolean;
  setCartOpen: (open: boolean) => void;
  setSearchOpen: (open: boolean) => void;
}

export const useUi = create<UiState>()((set) => ({
  cartOpen: false,
  searchOpen: false,
  setCartOpen: (cartOpen) => set({ cartOpen }),
  setSearchOpen: (searchOpen) => set({ searchOpen }),
}));
