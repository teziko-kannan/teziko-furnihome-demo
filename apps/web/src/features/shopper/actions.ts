"use client";

import { toast } from "@teziko/ui/components/toaster";
import { useCallback } from "react";
import type { CardProduct } from "../catalog/card-data";
import { COMPARE_MAX, useCart, useCompare, useUi, useWishlist } from "./stores";

/** Adds a product variant to the cart with feedback. */
export function useAddToCart() {
  const add = useCart((s) => s.add);
  const setCartOpen = useUi((s) => s.setCartOpen);
  return useCallback(
    (
      p: Pick<CardProduct, "id" | "slug" | "name" | "kind" | "price" | "mrp" | "colours">,
      sku?: string,
      qty = 1,
      openDrawer = false,
    ) => {
      const variant =
        p.colours.find((c) => c.sku === sku) ??
        p.colours.find((c) => c.stock !== "out-of-stock") ??
        p.colours[0];
      if (!variant) return;
      if (variant.stock === "out-of-stock") {
        toast.error("This option is out of stock", { description: "Try another colour or size." });
        return;
      }
      add(
        {
          productId: p.id,
          sku: variant.sku,
          name: p.name,
          slug: p.slug,
          variantLabel: variant.label,
          unitPrice: p.price + variant.priceDelta,
          unitMrp: p.mrp + variant.priceDelta,
          kind: p.kind,
          hex: variant.hex.replace("#", ""),
        },
        qty,
      );
      if (openDrawer) {
        setCartOpen(true);
      } else {
        toast.success("Added to cart", {
          description: `${p.name} · ${variant.label}`,
          action: { label: "View cart", onClick: () => setCartOpen(true) },
        });
      }
    },
    [add, setCartOpen],
  );
}

export function useToggleWishlist() {
  const toggle = useWishlist((s) => s.toggle);
  return useCallback(
    (id: string, name: string) => {
      const added = toggle(id);
      toast(added ? "Saved to wishlist" : "Removed from wishlist", { description: name });
      return added;
    },
    [toggle],
  );
}

export function useToggleCompare() {
  const toggle = useCompare((s) => s.toggle);
  return useCallback(
    (id: string, name: string) => {
      const r = toggle(id);
      if (r === "full")
        toast.error(`You can compare up to ${COMPARE_MAX} products`, {
          description: "Remove one from the compare list first.",
        });
      else
        toast(r === "added" ? "Added to compare" : "Removed from compare", { description: name });
      return r;
    },
    [toggle],
  );
}
