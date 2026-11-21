"use client";

import { Button } from "@teziko/ui/components/button";
import { Input } from "@teziko/ui/components/input";
import { TicketPercentIcon, XIcon } from "lucide-react";
import { useState, type FormEvent } from "react";
import type { PriceBreakdown } from "@teziko/types";
import { useCart } from "../shopper/stores";
import { NO_JS_FORM } from "@/lib/no-js-form";

export function CouponForm({ quote }: { quote: PriceBreakdown | null }) {
  const couponCode = useCart((s) => s.couponCode);
  const apply = useCart((s) => s.applyCoupon);
  const remove = useCart((s) => s.removeCoupon);
  const [value, setValue] = useState("");

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (value.trim()) apply(value);
  }

  if (couponCode && quote?.couponCode) {
    return (
      <div className="border-success/30 bg-success/5 flex items-center justify-between rounded-lg border px-3 py-2.5 text-sm">
        <span className="flex items-center gap-2">
          <TicketPercentIcon className="text-success size-4" aria-hidden="true" />
          <span>
            <strong>{quote.couponCode}</strong> applied
          </span>
        </span>
        <button
          type="button"
          onClick={remove}
          className="hover:bg-muted inline-flex size-8 items-center justify-center rounded-full"
          aria-label={`Remove coupon ${quote.couponCode}`}
        >
          <XIcon className="size-4" />
        </button>
      </div>
    );
  }

  const error = couponCode && quote?.couponError ? quote.couponError : null;

  return (
    <form {...NO_JS_FORM} onSubmit={onSubmit} className="space-y-1.5" noValidate>
      <label htmlFor="coupon" className="text-sm font-medium">
        Coupon code
      </label>
      <div className="flex gap-2">
        <Input
          id="coupon"
          value={value}
          onChange={(e) => setValue(e.target.value.toUpperCase())}
          placeholder="e.g. WELCOME10"
          autoComplete="off"
          maxLength={20}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? "coupon-error" : "coupon-hint"}
          className="h-10 uppercase"
        />
        <Button type="submit" variant="outline" size="sm" className="h-10">
          Apply
        </Button>
      </div>
      {error ? (
        <p id="coupon-error" role="alert" className="text-error text-xs font-medium">
          {couponCode}: {error}
        </p>
      ) : (
        <p id="coupon-hint" className="text-muted-foreground text-xs">
          Try WELCOME10, FESTIVE15, APPLIANCE5, FLAT500 or FREESHIP.
        </p>
      )}
    </form>
  );
}
