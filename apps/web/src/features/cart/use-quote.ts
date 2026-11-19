"use client";

import type { PriceBreakdown } from "@teziko/types";
import { useEffect, useMemo, useState } from "react";
import type { CartItem } from "../shopper/stores";

interface QuoteState {
  key: string;
  data: PriceBreakdown | null;
  error: string | null;
}

/**
 * Prices the cart on the server using the catalogue (single source of truth).
 * The client-side snapshot is only used for instant rendering while the quote loads.
 */
export function useQuote(items: CartItem[], couponCode: string | null) {
  const key = useMemo(
    () => JSON.stringify({ l: items.map((i) => [i.productId, i.sku, i.quantity]), c: couponCode }),
    [items, couponCode],
  );
  const [state, setState] = useState<QuoteState>({ key: "", data: null, error: null });

  useEffect(() => {
    if (items.length === 0) return;
    const ctrl = new AbortController();
    const t = setTimeout(async () => {
      try {
        const res = await fetch("/api/cart/quote", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            lines: items.map(({ productId, sku, quantity }) => ({ productId, sku, quantity })),
            couponCode,
          }),
          signal: ctrl.signal,
        });
        if (!res.ok) throw new Error("Could not price your cart");
        const json = (await res.json()) as { quote: PriceBreakdown };
        setState({ key, data: json.quote, error: null });
      } catch (e) {
        if ((e as Error).name !== "AbortError")
          setState({ key, data: null, error: (e as Error).message });
      }
    }, 120);
    return () => {
      clearTimeout(t);
      ctrl.abort();
    };
  }, [key, items, couponCode]);

  const empty = items.length === 0;
  return {
    quote: empty ? null : state.data,
    loading: !empty && state.key !== key,
    error: empty ? null : state.error,
  };
}
