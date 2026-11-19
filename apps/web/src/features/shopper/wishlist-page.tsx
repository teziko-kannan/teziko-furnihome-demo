"use client";

import { Button } from "@teziko/ui/components/button";
import { StateBlock } from "@teziko/ui/components/states";
import { Skeleton } from "@teziko/ui/components/skeleton";
import { useHydrated } from "@teziko/ui/hooks/use-hydrated";
import { HeartIcon, ServerCrashIcon } from "lucide-react";
import { AnimatePresence, m } from "motion/react";
import Link from "next/link";
import { ProductCard } from "../catalog/product-card";
import { useProductsById } from "../catalog/use-products";
import { useWishlist } from "./stores";

export function WishlistPage() {
  const hydrated = useHydrated();
  const ids = useWishlist((s) => s.ids);
  const clear = useWishlist((s) => s.clear);
  const { products, loading, error } = useProductsById(hydrated ? ids : []);

  if (!hydrated || loading) {
    return (
      <div
        className="grid grid-cols-2 gap-6 md:grid-cols-4"
        aria-busy="true"
        aria-label="Loading wishlist"
      >
        {Array.from({ length: 4 }, (_, i) => (
          <Skeleton key={i} className="aspect-square rounded-xl" />
        ))}
      </div>
    );
  }
  if (error)
    return (
      <StateBlock
        icon={ServerCrashIcon}
        tone="error"
        title="Couldn't load your wishlist"
        description="Please refresh the page to try again."
      />
    );
  if (ids.length === 0) {
    return (
      <StateBlock
        icon={HeartIcon}
        title="Your wishlist is empty"
        description="Tap the heart on any product to save it here."
        action={
          <Button asChild>
            <Link href="/shop">Discover products</Link>
          </Button>
        }
      />
    );
  }
  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <p className="text-muted-foreground text-sm">{products.length} saved</p>
        <Button variant="ghost" size="sm" onClick={clear}>
          Clear wishlist
        </Button>
      </div>
      <ul className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-3 lg:grid-cols-4">
        <AnimatePresence initial={false}>
          {products.map((p) => (
            <m.li
              key={p.id}
              layout
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25 }}
            >
              <ProductCard product={p} />
            </m.li>
          ))}
        </AnimatePresence>
      </ul>
    </>
  );
}
