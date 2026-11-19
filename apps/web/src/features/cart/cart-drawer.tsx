"use client";

import { Button } from "@teziko/ui/components/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
} from "@teziko/ui/components/drawer";
import { StateBlock } from "@teziko/ui/components/states";
import { useHydrated } from "@teziko/ui/hooks/use-hydrated";
import { useMediaQuery } from "@teziko/ui/hooks/use-media-query";
import { ShoppingBagIcon, XIcon } from "lucide-react";
import Link from "next/link";
import { useCart, useUi } from "../shopper/stores";
import { CartLines } from "./cart-lines";
import { CouponForm } from "./coupon-form";
import { OrderSummary } from "./order-summary";
import { useQuote } from "./use-quote";

export function CartDrawer() {
  const open = useUi((s) => s.cartOpen);
  const setOpen = useUi((s) => s.setCartOpen);
  const hydrated = useHydrated();
  const items = useCart((s) => s.items);
  const couponCode = useCart((s) => s.couponCode);
  const desktop = useMediaQuery("(min-width: 640px)");
  const { quote, loading, error } = useQuote(open && hydrated ? items : [], couponCode);
  const close = () => setOpen(false);

  return (
    <Drawer open={open} onOpenChange={setOpen} direction={desktop ? "right" : "bottom"}>
      <DrawerContent direction={desktop ? "right" : "bottom"} className="sm:max-w-md">
        <div className="border-border flex items-center justify-between border-b px-5 py-4">
          <div>
            <DrawerTitle className="font-sans text-lg font-semibold">Your cart</DrawerTitle>
            <DrawerDescription className="text-muted-foreground text-xs">
              {items.length
                ? `${items.reduce((n, i) => n + i.quantity, 0)} item(s)`
                : "Nothing here yet"}
            </DrawerDescription>
          </div>
          <button
            type="button"
            onClick={close}
            className="hover:bg-muted inline-flex size-9 items-center justify-center rounded-full"
            aria-label="Close cart"
          >
            <XIcon className="size-5" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 items-center p-5">
            <StateBlock
              icon={ShoppingBagIcon}
              title="Your cart is empty"
              description="Browse sofas, appliances and decor, then add your favourites here."
              className="w-full border-none"
              action={
                <Button asChild onClick={close}>
                  <Link href="/shop">Start shopping</Link>
                </Button>
              }
            />
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-5" data-vaul-no-drag>
              <CartLines items={items} quote={quote} compact onNavigate={close} />
            </div>
            <div className="border-border bg-background space-y-4 border-t px-5 py-4">
              <CouponForm quote={quote} />
              {error ? (
                <p role="alert" className="text-error text-sm">
                  {error}. Your items are saved; please try again.
                </p>
              ) : (
                <OrderSummary quote={quote} loading={loading} />
              )}
              <div className="grid grid-cols-2 gap-2">
                <Button asChild variant="outline" onClick={close}>
                  <Link href="/cart">View cart</Link>
                </Button>
                <Button asChild variant="accent" onClick={close}>
                  <Link href="/checkout">Checkout</Link>
                </Button>
              </div>
            </div>
          </>
        )}
      </DrawerContent>
    </Drawer>
  );
}
