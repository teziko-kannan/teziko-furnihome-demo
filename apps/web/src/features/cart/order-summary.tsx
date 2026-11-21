"use client";

import { Skeleton } from "@teziko/ui/components/skeleton";
import type { PriceBreakdown } from "@teziko/types";
import { cn, formatINR } from "@/lib/format";
import { AnimatedPrice } from "./animated-price";

const FREE_SHIP = 4999;

export function OrderSummary({
  quote,
  loading,
  className,
}: {
  quote: PriceBreakdown | null;
  loading?: boolean;
  className?: string;
}) {
  if (!quote) {
    return (
      <div className={cn("space-y-3", className)} aria-busy="true">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-6 w-full" />
      </div>
    );
  }
  const toFree = FREE_SHIP - (quote.subtotal - quote.couponDiscount);
  return (
    <div
      className={cn("space-y-2.5 text-sm", loading && "opacity-70 transition-opacity", className)}
      aria-busy={loading}
    >
      {quote.shipping > 0 && toFree > 0 ? (
        <p className="bg-muted rounded-lg px-3 py-2 text-xs">
          Add <strong>{formatINR(toFree)}</strong> more for free delivery.
        </p>
      ) : null}
      <Row
        label={`MRP (${quote.itemCount} item${quote.itemCount === 1 ? "" : "s"})`}
        value={<AnimatedPrice value={quote.mrpTotal} />}
      />
      {quote.productDiscount > 0 ? (
        <Row
          label="Discount on MRP"
          value={<span className="text-success">−{formatINR(quote.productDiscount)}</span>}
        />
      ) : null}
      {quote.couponDiscount > 0 ? (
        <Row
          label={`Coupon (${quote.couponCode})`}
          value={<span className="text-success">−{formatINR(quote.couponDiscount)}</span>}
        />
      ) : null}
      <div className="border-border space-y-2.5 border-t pt-2.5">
        <Row
          label="Taxable value"
          value={formatINR(quote.subtotal - quote.couponDiscount - quote.gstIncluded)}
        />
        <Row label="GST" value={formatINR(quote.gstIncluded)} />
      </div>
      <Row
        label="Shipping"
        value={
          quote.shipping === 0 ? (
            <span className="text-success">Free</span>
          ) : (
            formatINR(quote.shipping)
          )
        }
      />
      <div className="border-border flex items-baseline justify-between border-t pt-3">
        <span className="font-semibold">Total</span>
        <AnimatedPrice value={quote.total} className="text-lg font-semibold" />
      </div>
      <p className="text-muted-foreground text-xs">
        Prices include GST at indicative rates; the GST line above is already part of the total.
      </p>
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <span className="text-muted-foreground">{label}</span>
      <span className="tabular-nums">{value}</span>
    </div>
  );
}
