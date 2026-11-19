"use client";

import { Button } from "@teziko/ui/components/button";
import { StateBlock } from "@teziko/ui/components/states";
import { useHydrated } from "@teziko/ui/hooks/use-hydrated";
import { ShoppingBagIcon } from "lucide-react";
import Link from "next/link";
import { useCart } from "../shopper/stores";
import { CartLines } from "./cart-lines";
import { CouponForm } from "./coupon-form";
import { OrderSummary } from "./order-summary";
import { useQuote } from "./use-quote";

export function CartPage() {
  const hydrated = useHydrated();
  const items = useCart((s) => s.items);
  const couponCode = useCart((s) => s.couponCode);
  const clear = useCart((s) => s.clear);
  const { quote, loading, error } = useQuote(hydrated ? items : [], couponCode);

  if (!hydrated)
    return <div className="skeleton h-80 rounded-2xl" aria-busy="true" aria-label="Loading cart" />;

  if (items.length === 0) {
    return (
      <StateBlock
        icon={ShoppingBagIcon}
        title="Your cart is empty"
        description="Looks like you haven't added anything yet."
        action={
          <div className="flex flex-wrap justify-center gap-3">
            <Button asChild>
              <Link href="/shop">Start shopping</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/wishlist">View wishlist</Link>
            </Button>
          </div>
        }
      />
    );
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
      <section aria-label="Cart items">
        <CartLines items={items} quote={quote} />
        <div className="border-border mt-4 flex flex-wrap justify-between gap-3 border-t pt-4">
          <Button asChild variant="ghost">
            <Link href="/shop">← Continue shopping</Link>
          </Button>
          <Button variant="ghost" onClick={clear}>
            Clear cart
          </Button>
        </div>
      </section>
      <aside
        className="border-border h-fit space-y-5 rounded-2xl border p-5 lg:sticky lg:top-32"
        aria-label="Order summary"
      >
        <h2 className="font-sans text-lg font-semibold tracking-normal">Order summary</h2>
        <CouponForm quote={quote} />
        {error ? (
          <p role="alert" className="text-error text-sm">
            {error}
          </p>
        ) : (
          <OrderSummary quote={quote} loading={loading} />
        )}
        <Button asChild variant="accent" size="lg" className="w-full">
          <Link href="/checkout">Proceed to checkout</Link>
        </Button>
        <p className="text-muted-foreground text-center text-xs">
          Demo store. No payment is taken.
        </p>
      </aside>
    </div>
  );
}
