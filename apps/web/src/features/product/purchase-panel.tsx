"use client";

import { getProductImages } from "@teziko/data/images";
import { Button } from "@teziko/ui/components/button";
import { Input } from "@teziko/ui/components/input";
import type { Product } from "@teziko/types";
import { GitCompareArrowsIcon, ShieldCheckIcon, TruckIcon, WrenchIcon } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Price } from "@/components/price";
import { StockBadge } from "@/components/stock-badge";
import { cn, deliveryWindow } from "@/lib/format";
import type { CardProduct } from "../catalog/card-data";
import { QuantityStepper } from "../cart/quantity-stepper";
import { useAddToCart, useToggleCompare } from "../shopper/actions";
import { useCompare, useRecentlyViewed } from "../shopper/stores";
import { WishlistButton } from "../shopper/wishlist-button";
import { Gallery } from "./gallery";

type Props = {
  product: Pick<
    Product,
    | "id"
    | "slug"
    | "name"
    | "kind"
    | "variants"
    | "imageCount"
    | "price"
    | "mrp"
    | "deliveryDays"
    | "assembly"
    | "warrantyMonths"
  >;
  card: CardProduct;
  children?: React.ReactNode;
};

/** Gallery + variant selection + add to cart. The selected SKU is kept in the URL (?sku=). */
export function PurchasePanel({ product, card, children }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const skuParam = sp.get("sku");
  const variant =
    product.variants.find((v) => v.sku === skuParam) ??
    product.variants.find((v) => v.stock > 0) ??
    product.variants[0]!;
  const [qty, setQty] = useState(1);
  const addToCart = useAddToCart();
  const toggleCompare = useToggleCompare();
  const inCompare = useCompare((s) => s.ids.includes(product.id));
  const pushRecent = useRecentlyViewed((s) => s.push);
  const images = useMemo(
    () => getProductImages(product, variant.colour.hex),
    [product, variant.colour.hex],
  );

  useEffect(() => pushRecent(product.id), [product.id, pushRecent]);

  const colours = [...new Map(product.variants.map((v) => [v.colour.name, v.colour])).values()];
  const sizes = [
    ...new Set(
      product.variants.map((v) => v.size ?? v.material).filter((x): x is string => Boolean(x)),
    ),
  ];
  const axisLabel = product.variants.some((v) => v.size) ? "Size" : "Material";
  const currentAxis = variant.size ?? variant.material;

  function select(colour: string, axis?: string) {
    const next =
      product.variants.find((v) => v.colour.name === colour && (v.size ?? v.material) === axis) ??
      product.variants.find((v) => v.colour.name === colour)!;
    const p = new URLSearchParams(sp.toString());
    p.set("sku", next.sku);
    router.replace(`${pathname}?${p}`, { scroll: false });
    setQty(1);
  }

  const status =
    variant.stock <= 0 ? "out-of-stock" : variant.stock <= 5 ? "low-stock" : "in-stock";
  const maxQty = Math.max(1, Math.min(10, variant.stock));

  return (
    <div className="grid gap-8 lg:grid-cols-[1.15fr_1fr] lg:gap-14 [&>*]:min-w-0">
      <Gallery images={images} slug={product.slug} name={product.name} />

      <div className="flex flex-col gap-6">
        {children}

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <Price
            price={product.price + variant.priceDelta}
            mrp={product.mrp + variant.priceDelta}
            size="lg"
          />
          <StockBadge status={status} />
        </div>
        <p className="text-muted-foreground -mt-4 text-xs">
          Inclusive of all taxes. EMI options shown at checkout (demo).
        </p>

        <fieldset>
          <legend className="mb-2.5 text-sm font-medium">
            Colour: <span className="text-muted-foreground font-normal">{variant.colour.name}</span>
          </legend>
          <div className="flex flex-wrap gap-2.5">
            {colours.map((c) => {
              const anyStock = product.variants.some(
                (v) => v.colour.name === c.name && v.stock > 0,
              );
              return (
                <button
                  key={c.name}
                  type="button"
                  onClick={() => select(c.name, currentAxis)}
                  aria-pressed={c.name === variant.colour.name}
                  aria-label={`${c.name}${anyStock ? "" : " (out of stock)"}`}
                  className={cn(
                    "relative size-10 rounded-full border border-black/10 ring-offset-2 transition-shadow",
                    c.name === variant.colour.name
                      ? "ring-foreground ring-2"
                      : "hover:ring-foreground/40 hover:ring-1",
                    !anyStock && "opacity-50",
                  )}
                  style={{ backgroundColor: c.hex }}
                />
              );
            })}
          </div>
        </fieldset>

        {sizes.length > 0 ? (
          <fieldset>
            <legend className="mb-2.5 text-sm font-medium">{axisLabel}</legend>
            <div className="flex flex-wrap gap-2">
              {sizes.map((s) => {
                const v = product.variants.find(
                  (x) => x.colour.name === variant.colour.name && (x.size ?? x.material) === s,
                );
                const out = !v || v.stock <= 0;
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => select(variant.colour.name, s)}
                    aria-pressed={s === currentAxis}
                    className={cn(
                      "h-10 rounded-full border px-4 text-sm font-medium transition-colors",
                      s === currentAxis
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border hover:border-foreground",
                      out && "text-muted-foreground line-through",
                    )}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
          </fieldset>
        ) : null}

        <div className="flex flex-wrap items-center gap-3">
          <QuantityStepper
            value={qty}
            onChange={setQty}
            label={product.name}
            max={maxQty}
            className="h-12"
          />
          <Button
            size="lg"
            variant="default"
            className="min-w-0 flex-1"
            disabled={status === "out-of-stock"}
            onClick={() => addToCart(card, variant.sku, qty, true)}
          >
            {status === "out-of-stock" ? "Out of stock" : "Add to cart"}
          </Button>
          <WishlistButton
            id={product.id}
            name={product.name}
            className="border-border size-12 border shadow-none"
          />
        </div>
        <div className="flex flex-wrap gap-3">
          <Button
            size="lg"
            variant="accent"
            className="flex-1"
            disabled={status === "out-of-stock"}
            onClick={() => {
              addToCart(card, variant.sku, qty, false);
              router.push("/checkout");
            }}
          >
            Buy now
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => toggleCompare(product.id, product.name)}
            aria-pressed={inCompare}
          >
            <GitCompareArrowsIcon aria-hidden="true" />
            {inCompare ? "In compare" : "Compare"}
          </Button>
        </div>

        <DeliveryCheck days={product.deliveryDays} />

        <ul className="border-border grid gap-3 rounded-xl border p-4 text-sm sm:grid-cols-3">
          <li className="flex items-center gap-2.5">
            <TruckIcon className="size-4 shrink-0" aria-hidden="true" />
            {product.deliveryDays[0]}–{product.deliveryDays[1]} day delivery
          </li>
          <li className="flex items-center gap-2.5">
            <WrenchIcon className="size-4 shrink-0" aria-hidden="true" />
            {product.assembly === "free-installation"
              ? "Free installation"
              : product.assembly === "self"
                ? "Easy self-assembly"
                : "No assembly needed"}
          </li>
          <li className="flex items-center gap-2.5">
            <ShieldCheckIcon className="size-4 shrink-0" aria-hidden="true" />
            {product.warrantyMonths ? `${product.warrantyMonths}-month warranty` : "10-day returns"}
          </li>
        </ul>
      </div>
    </div>
  );
}

function DeliveryCheck({ days }: { days: [number, number] }) {
  const [pin, setPin] = useState("");
  const [result, setResult] = useState<{ ok: boolean; text: string } | null>(null);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!/^[1-9]\d{5}$/.test(pin)) {
      setResult({ ok: false, text: "Enter a valid 6-digit PIN code." });
      return;
    }
    const remote = /^(79|744|737|194)/.test(pin);
    const eta = deliveryWindow(remote ? [days[0] + 3, days[1] + 4] : days);
    setResult({
      ok: true,
      text: `Delivers ${eta}${remote ? " (remote area)" : ""}. Simulated estimate.`,
    });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-2" noValidate>
      <label htmlFor="pincode" className="text-sm font-medium">
        Check delivery
      </label>
      <div className="flex gap-2">
        <Input
          id="pincode"
          inputMode="numeric"
          autoComplete="postal-code"
          maxLength={6}
          placeholder="PIN code"
          value={pin}
          onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
          aria-describedby={result ? "pincode-result" : undefined}
          aria-invalid={result ? !result.ok : undefined}
          className="h-10 max-w-40"
        />
        <Button type="submit" variant="outline" size="sm" className="h-10">
          Check
        </Button>
      </div>
      {result ? (
        <p
          id="pincode-result"
          role="status"
          className={cn("text-xs", result.ok ? "text-success" : "text-error")}
        >
          {result.text}
        </p>
      ) : null}
    </form>
  );
}
