"use client";

import type { Product } from "@teziko/types";
import { useEffect, useState } from "react";
import type { CardProduct } from "./card-data";

interface State<T> {
  key: string;
  data: T[];
  error: boolean;
}

/** Loads products by id from /api/products (wishlist, compare, recently viewed live in localStorage). */
export function useProductsById<F extends boolean = false>(
  ids: string[],
  opts?: { full?: F; enabled?: boolean },
) {
  type T = F extends true ? Product : CardProduct;
  const key = ids.join(",");
  const enabled = opts?.enabled ?? true;
  const [state, setState] = useState<State<T>>({ key: "", data: [], error: false });

  useEffect(() => {
    if (!enabled || !key) return;
    const ctrl = new AbortController();
    fetch(`/api/products?ids=${encodeURIComponent(key)}${opts?.full ? "&full=1" : ""}`, {
      signal: ctrl.signal,
    })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("failed"))))
      .then((j: { products: T[] }) => setState({ key, data: j.products, error: false }))
      .catch((e: Error) => {
        if (e.name !== "AbortError") setState({ key, data: [], error: true });
      });
    return () => ctrl.abort();
  }, [key, enabled, opts?.full]);

  if (!key) return { products: [] as T[], loading: false, error: false };
  // Keep order consistent with ids.
  const byId = new Map(state.data.map((p) => [p.id, p]));
  return {
    products: ids.map((id) => byId.get(id)).filter((p): p is T => Boolean(p)),
    loading: enabled && state.key !== key,
    error: state.key === key && state.error,
  };
}
