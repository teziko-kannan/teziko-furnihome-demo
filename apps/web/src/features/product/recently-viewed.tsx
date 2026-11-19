"use client";

import { useHydrated } from "@teziko/ui/hooks/use-hydrated";
import { SectionHeader } from "@/components/section-header";
import { ProductRail } from "../catalog/product-rail";
import { useProductsById } from "../catalog/use-products";
import { useRecentlyViewed } from "../shopper/stores";

export function RecentlyViewed({ excludeId }: { excludeId?: string }) {
  const hydrated = useHydrated();
  const ids = useRecentlyViewed((s) => s.ids).filter((id) => id !== excludeId);
  const { products } = useProductsById(hydrated ? ids : []);
  if (!hydrated || products.length === 0) return null;
  return (
    <section className="container-page py-14" aria-label="Recently viewed">
      <ProductRail
        products={products}
        label="Recently viewed"
        header={<SectionHeader title="Recently viewed" className="mb-0 sm:mb-0" />}
      />
    </section>
  );
}
