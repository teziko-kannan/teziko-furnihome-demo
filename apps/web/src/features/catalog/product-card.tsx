"use client";

import { getProductImage } from "@teziko/data/images";
import { Badge } from "@teziko/ui/components/badge";
import { Rating } from "@teziko/ui/components/rating";
import { useHydrated } from "@teziko/ui/hooks/use-hydrated";
import { GitCompareArrowsIcon, PlusIcon } from "lucide-react";
import Link from "next/link";
import { useRef, useState, type MouseEvent } from "react";
import { Price } from "@/components/price";
import { ProductImage } from "@/components/product-image";
import { cn, discountPercent } from "@/lib/format";
import { productImageTransitionName, useTransitionNavigate } from "../navigation/view-transition";
import { useAddToCart, useToggleCompare } from "../shopper/actions";
import { useCompare } from "../shopper/stores";
import { WishlistButton } from "../shopper/wishlist-button";
import type { CardProduct } from "./card-data";

interface ProductCardProps {
  product: CardProduct;
  priority?: boolean;
  sizes?: string;
  className?: string;
}

export function ProductCard({
  product: p,
  priority,
  className,
  sizes = "(min-width: 1280px) 22vw, (min-width: 768px) 30vw, 46vw",
}: ProductCardProps) {
  const [colourIdx, setColourIdx] = useState(0);
  const colour = p.colours[colourIdx] ?? p.colours[0]!;
  const href = `/product/${p.slug}${colourIdx > 0 ? `?sku=${encodeURIComponent(colour.sku)}` : ""}`;
  const imageRef = useRef<HTMLDivElement>(null);
  const navigate = useTransitionNavigate();
  const addToCart = useAddToCart();
  const toggleCompare = useToggleCompare();
  const hydrated = useHydrated();
  const inCompare = useCompare((s) => s.ids.includes(p.id)) && hydrated;
  const off = discountPercent(p.price, p.mrp);
  const swatches = [...new Map(p.colours.map((c, i) => [c.hex, i])).entries()];
  const primary = getProductImage({ kind: p.kind, name: p.name, variants: [] }, 0, colour.hex);
  const secondary = getProductImage({ kind: p.kind, name: p.name, variants: [] }, 3, colour.hex);

  function onNavigate(e: MouseEvent<HTMLAnchorElement>) {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    navigate(href, productImageTransitionName(p.slug), imageRef.current);
  }

  return (
    <article className={cn("group/card relative flex flex-col", className)}>
      <div className="relative transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] lg:group-hover/card:-translate-y-1">
        <Link
          href={href}
          onClick={onNavigate}
          className="block rounded-xl"
          aria-hidden="true"
          tabIndex={-1}
        >
          <div
            ref={imageRef}
            className="bg-muted relative aspect-square overflow-hidden rounded-xl"
          >
            <ProductImage
              image={primary}
              sizes={sizes}
              priority={priority}
              className="transition-[transform,opacity] duration-700 ease-out lg:group-hover/card:scale-[1.04] lg:group-hover/card:opacity-0"
            />
            <ProductImage
              image={secondary}
              sizes={sizes}
              alt=""
              className="absolute inset-0 hidden opacity-0 transition-[transform,opacity] duration-700 ease-out lg:block lg:scale-[1.04] lg:group-hover/card:scale-100 lg:group-hover/card:opacity-100"
            />
          </div>
        </Link>

        <div className="pointer-events-none absolute top-3 left-3 flex flex-col items-start gap-1.5">
          {off >= 20 ? <Badge variant="sale">−{off}%</Badge> : null}
          {p.tags.includes("new") ? (
            <Badge variant="inverse" className="shadow-soft">
              New
            </Badge>
          ) : null}
          {p.stock === "out-of-stock" ? <Badge variant="muted">Sold out</Badge> : null}
        </div>

        <WishlistButton id={p.id} name={p.name} className="absolute top-3 right-3" />

        {/* Quick add: slides up on hover (desktop), always visible as an icon button on touch/small screens */}
        <div className="absolute inset-x-3 bottom-3 flex justify-end lg:translate-y-3 lg:opacity-0 lg:transition-[transform,opacity] lg:duration-300 lg:group-focus-within/card:translate-y-0 lg:group-focus-within/card:opacity-100 lg:group-hover/card:translate-y-0 lg:group-hover/card:opacity-100">
          <button
            type="button"
            onClick={() => addToCart(p, colour.sku)}
            disabled={p.stock === "out-of-stock"}
            className="bg-primary text-primary-foreground shadow-lift hover:bg-secondary inline-flex h-10 items-center justify-center gap-1.5 rounded-full px-3 text-[13px] font-semibold transition-colors disabled:opacity-50 lg:w-full"
            aria-label={`Quick add ${p.name}, ${colour.label}, to cart`}
          >
            <PlusIcon className="size-4" aria-hidden="true" />
            <span className="hidden lg:inline">Quick add</span>
          </button>
        </div>
      </div>

      <div className="mt-3.5 flex flex-1 flex-col gap-1.5">
        <p className="text-muted-foreground text-xs">{p.brandName}</p>
        <h3 className="font-sans text-[15px] leading-snug font-medium tracking-normal">
          <Link
            href={href}
            onClick={onNavigate}
            className="line-clamp-2 rounded-sm hover:underline"
          >
            {p.name}
          </Link>
        </h3>
        <Rating value={p.rating} count={p.reviewCount} />
        <Price
          price={p.price + colour.priceDelta}
          mrp={p.mrp + colour.priceDelta}
          size="sm"
          className="mt-0.5"
        />
        <div className="mt-1.5 flex flex-wrap items-center justify-between gap-2">
          {swatches.length > 1 ? (
            <div className="flex items-center gap-1.5" role="group" aria-label="Colours">
              {swatches.map(([hex, idx]) => (
                <button
                  key={hex}
                  type="button"
                  onClick={() => setColourIdx(idx)}
                  aria-label={p.colours[idx]!.name}
                  aria-pressed={colourIdx === idx}
                  className={cn(
                    "size-5 rounded-full border border-black/10 ring-offset-2 transition-shadow",
                    colourIdx === idx
                      ? "ring-foreground ring-2"
                      : "hover:ring-foreground/40 hover:ring-1",
                  )}
                  style={{ backgroundColor: hex }}
                />
              ))}
            </div>
          ) : (
            <span />
          )}
          <button
            type="button"
            onClick={() => toggleCompare(p.id, p.name)}
            aria-pressed={inCompare}
            className={cn(
              "inline-flex h-8 items-center gap-1 rounded-full px-2 text-xs font-medium transition-colors",
              inCompare
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            <GitCompareArrowsIcon className="size-3.5" aria-hidden="true" />
            <span className="max-sm:sr-only">{inCompare ? "Comparing" : "Compare"}</span>
          </button>
        </div>
      </div>
    </article>
  );
}
