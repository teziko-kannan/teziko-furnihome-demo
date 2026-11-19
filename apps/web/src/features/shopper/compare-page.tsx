"use client";

import { getProductImage } from "@teziko/data/images";
import { Button } from "@teziko/ui/components/button";
import { Rating } from "@teziko/ui/components/rating";
import { StateBlock } from "@teziko/ui/components/states";
import { useHydrated } from "@teziko/ui/hooks/use-hydrated";
import { GitCompareArrowsIcon, ServerCrashIcon, XIcon } from "lucide-react";
import Link from "next/link";
import { Price } from "@/components/price";
import { ProductImage } from "@/components/product-image";
import { useProductsById } from "../catalog/use-products";
import { useAddToCart } from "./actions";
import { COMPARE_MAX, useCompare } from "./stores";
import { toCardClient } from "./to-card-client";

export function ComparePage() {
  const hydrated = useHydrated();
  const ids = useCompare((s) => s.ids);
  const remove = useCompare((s) => s.remove);
  const clear = useCompare((s) => s.clear);
  const addToCart = useAddToCart();
  const { products, loading, error } = useProductsById(hydrated ? ids : [], { full: true });

  if (!hydrated || loading)
    return (
      <div className="skeleton h-96 rounded-2xl" aria-busy="true" aria-label="Loading comparison" />
    );
  if (error)
    return (
      <StateBlock
        icon={ServerCrashIcon}
        tone="error"
        title="Couldn't load products"
        description="Please refresh to try again."
      />
    );
  if (products.length === 0) {
    return (
      <StateBlock
        icon={GitCompareArrowsIcon}
        title="Nothing to compare yet"
        description={`Use “Compare” on up to ${COMPARE_MAX} products to see them side by side.`}
        action={
          <Button asChild>
            <Link href="/shop">Browse products</Link>
          </Button>
        }
      />
    );
  }

  const labels = [...new Set(products.flatMap((p) => p.specs.map((s) => s.label)))];

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-muted-foreground text-sm">
          {products.length} of {COMPARE_MAX} products
        </p>
        <Button variant="ghost" size="sm" onClick={clear}>
          Clear all
        </Button>
      </div>
      <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
        <table className="w-full min-w-[640px] table-fixed border-collapse text-sm">
          <caption className="sr-only">Product comparison</caption>
          <thead>
            <tr>
              <th
                scope="col"
                className="text-muted-foreground w-36 p-3 text-left align-bottom text-xs font-semibold uppercase"
              >
                Product
              </th>
              {products.map((p) => (
                <th key={p.id} scope="col" className="p-3 text-left align-top font-normal">
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => remove(p.id)}
                      className="shadow-soft absolute top-2 right-2 z-10 inline-flex size-8 items-center justify-center rounded-full bg-white/90"
                      aria-label={`Remove ${p.name} from compare`}
                    >
                      <XIcon className="size-4" />
                    </button>
                    <Link
                      href={`/product/${p.slug}`}
                      className="bg-muted block aspect-square overflow-hidden rounded-xl"
                    >
                      <ProductImage image={getProductImage(p, 0)} sizes="220px" alt="" />
                    </Link>
                    <Link
                      href={`/product/${p.slug}`}
                      className="mt-3 line-clamp-2 font-medium hover:underline"
                    >
                      {p.name}
                    </Link>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-border divide-y">
            <Row label="Price">
              {products.map((p) => (
                <td key={p.id} className="p-3">
                  <Price price={p.price} mrp={p.mrp} size="sm" />
                </td>
              ))}
            </Row>
            <Row label="Rating">
              {products.map((p) => (
                <td key={p.id} className="p-3">
                  <Rating value={p.rating} count={p.reviewCount} />
                </td>
              ))}
            </Row>
            <Row label="Colours">
              {products.map((p) => (
                <td key={p.id} className="p-3">
                  {[...new Set(p.variants.map((v) => v.colour.name))].join(", ")}
                </td>
              ))}
            </Row>
            <Row label="Warranty">
              {products.map((p) => (
                <td key={p.id} className="p-3">
                  {p.warrantyMonths ? `${p.warrantyMonths} months` : "—"}
                </td>
              ))}
            </Row>
            {labels.map((label) => (
              <Row key={label} label={label}>
                {products.map((p) => (
                  <td key={p.id} className="p-3">
                    {p.specs.find((s) => s.label === label)?.value ?? "—"}
                  </td>
                ))}
              </Row>
            ))}
            <tr>
              <td />
              {products.map((p) => (
                <td key={p.id} className="p-3">
                  <Button size="sm" className="w-full" onClick={() => addToCart(toCardClient(p))}>
                    Add to cart
                  </Button>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <tr>
      <th
        scope="row"
        className="text-muted-foreground p-3 text-left align-top text-xs font-semibold"
      >
        {label}
      </th>
      {children}
    </tr>
  );
}
