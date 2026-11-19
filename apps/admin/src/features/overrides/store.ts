"use client";

import type { Coupon, OrderStatus } from "@teziko/types";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const RETENTION_MS = 14 * 86400000;

type Stamped<T> = T & { at: string };

/**
 * DEMO PERSISTENCE: admin edits are stored in this browser's localStorage (same retention rules as
 * the storefront's local adapter: purged after 14 days). They do not change the catalogue on the
 * storefront, which reads static data.
 */
interface OverridesState {
  products: Record<string, Stamped<{ price?: number; stock?: number; hidden?: boolean }>>;
  orders: Record<string, Stamped<{ status: OrderStatus }>>;
  coupons: Record<string, Stamped<{ active: boolean }>>;
  newCoupons: Stamped<Coupon>[];
  banners: Record<string, Stamped<{ active: boolean }>>;
  reviews: Record<string, Stamped<{ hidden: boolean }>>;
  settings: Stamped<{
    storeName: string;
    supportEmail: string;
    freeShippingThreshold: number;
    codEnabled: boolean;
    maintenance: boolean;
  }> | null;
  setProduct: (id: string, patch: { price?: number; stock?: number; hidden?: boolean }) => void;
  setOrderStatus: (number: string, status: OrderStatus) => void;
  setCouponActive: (code: string, active: boolean) => void;
  addCoupon: (c: Coupon) => void;
  setBannerActive: (id: string, active: boolean) => void;
  setReviewHidden: (id: string, hidden: boolean) => void;
  saveSettings: (s: NonNullable<OverridesState["settings"]>) => void;
  resetAll: () => void;
  purge: () => void;
}

const now = () => new Date().toISOString();
const fresh = (at: string) => Date.now() - Date.parse(at) < RETENTION_MS;
const keepFresh = <T extends { at: string }>(rec: Record<string, T>) =>
  Object.fromEntries(Object.entries(rec).filter(([, v]) => fresh(v.at)));

const empty = {
  products: {},
  orders: {},
  coupons: {},
  newCoupons: [],
  banners: {},
  reviews: {},
  settings: null,
};

export const useOverrides = create<OverridesState>()(
  persist(
    (set) => ({
      ...empty,
      setProduct: (id, patch) =>
        set((s) => ({
          products: { ...s.products, [id]: { ...s.products[id], ...patch, at: now() } },
        })),
      setOrderStatus: (number, status) =>
        set((s) => ({ orders: { ...s.orders, [number]: { status, at: now() } } })),
      setCouponActive: (code, active) =>
        set((s) => ({ coupons: { ...s.coupons, [code]: { active, at: now() } } })),
      addCoupon: (c) =>
        set((s) => ({
          newCoupons: [{ ...c, at: now() }, ...s.newCoupons.filter((x) => x.code !== c.code)],
        })),
      setBannerActive: (id, active) =>
        set((s) => ({ banners: { ...s.banners, [id]: { active, at: now() } } })),
      setReviewHidden: (id, hidden) =>
        set((s) => ({ reviews: { ...s.reviews, [id]: { hidden, at: now() } } })),
      saveSettings: (settings) => set({ settings: { ...settings, at: now() } }),
      resetAll: () => set(empty),
      purge: () =>
        set((s) => ({
          products: keepFresh(s.products),
          orders: keepFresh(s.orders),
          coupons: keepFresh(s.coupons),
          banners: keepFresh(s.banners),
          reviews: keepFresh(s.reviews),
          newCoupons: s.newCoupons.filter((c) => fresh(c.at)),
          settings: s.settings && fresh(s.settings.at) ? s.settings : null,
        })),
    }),
    {
      name: "tz-admin-overrides",
      storage: createJSONStorage(() => localStorage),
      version: 1,
      onRehydrateStorage: () => (state) => state?.purge(),
    },
  ),
);
