"use client";

import { Button } from "@teziko/ui/components/button";
import { StateBlock } from "@teziko/ui/components/states";
import { Reveal } from "@teziko/ui/motion/reveal";
import { PackageSearchIcon } from "lucide-react";
import Link from "next/link";
import { OrderDetails } from "./order-details";
import { SuccessCheck } from "./success-check";
import { useOrder } from "./use-order";

export function OrderConfirmation({ number, email }: { number: string; email?: string }) {
  const { order, status, replace } = useOrder(number, email);

  if (status === "loading")
    return (
      <div className="skeleton h-96 rounded-2xl" aria-busy="true" aria-label="Loading order" />
    );
  if (!order) {
    return (
      <StateBlock
        icon={PackageSearchIcon}
        title="We couldn't find that order"
        description="Demo orders are stored in the browser where they were placed and are deleted after 14 days."
        tone={status === "error" ? "error" : "default"}
        action={
          <Button asChild variant="outline">
            <Link href="/track-order">Track another order</Link>
          </Button>
        }
      />
    );
  }

  const failed = order.status === "payment-failed";
  return (
    <div>
      <Reveal className="mb-10 flex flex-col items-center text-center" y={16}>
        {failed ? null : <SuccessCheck />}
        <h1 className="mt-4 text-3xl sm:text-4xl">
          {failed ? "Payment didn't go through" : "Thank you, your order is placed"}
        </h1>
        <p className="text-muted-foreground mt-2">
          Order <strong className="text-foreground">{order.number}</strong> · confirmation would be
          sent to {order.email} (demo, nothing is emailed)
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {failed ? (
            <Button asChild variant="accent">
              <Link href="/cart">Back to cart</Link>
            </Button>
          ) : (
            <Button asChild variant="accent">
              <Link href="/shop">Continue shopping</Link>
            </Button>
          )}
          <Button asChild variant="outline">
            <Link href="/account/orders">My orders</Link>
          </Button>
        </div>
      </Reveal>
      <OrderDetails order={order} onReplace={replace} />
    </div>
  );
}
