"use client";

import { ORDER_STATUS_LABEL, withSimulatedProgress } from "@teziko/data/orders";
import type { Order } from "@teziko/types";
import { Badge } from "@teziko/ui/components/badge";
import { Button } from "@teziko/ui/components/button";
import { StateBlock } from "@teziko/ui/components/states";
import { ChevronRightIcon, PackageIcon, ServerCrashIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { formatDate, formatINR } from "@/lib/format";
import { getDataAdapter } from "../data-access";
import { statusVariant } from "../orders/order-details";

export function OrdersList({ email }: { email: string }) {
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let alive = true;
    getDataAdapter()
      .listOrders(email)
      .then(
        (list) =>
          alive &&
          setOrders(
            list
              .map((o) => withSimulatedProgress(o))
              .sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
          ),
      )
      .catch(() => alive && setError(true));
    return () => {
      alive = false;
    };
  }, [email]);

  if (error)
    return (
      <StateBlock
        icon={ServerCrashIcon}
        tone="error"
        title="Couldn't load your orders"
        description="Please refresh to try again."
      />
    );
  if (!orders) {
    return (
      <div className="space-y-3" aria-busy="true" aria-label="Loading orders">
        {[0, 1, 2].map((i) => (
          <div key={i} className="skeleton h-20 rounded-2xl" />
        ))}
      </div>
    );
  }
  if (orders.length === 0) {
    return (
      <StateBlock
        icon={PackageIcon}
        title="No orders yet"
        description="Orders you place in this browser appear here for 14 days."
        action={
          <Button asChild>
            <Link href="/shop">Start shopping</Link>
          </Button>
        }
      />
    );
  }
  return (
    <ul className="divide-border border-border divide-y rounded-2xl border">
      {orders.map((o) => (
        <li key={o.number}>
          <Link
            href={`/order/${o.number}?email=${encodeURIComponent(o.email)}`}
            className="hover:bg-muted/60 flex flex-wrap items-center gap-x-6 gap-y-2 p-4 transition-colors sm:p-5"
          >
            <div className="min-w-0 flex-1">
              <p className="font-semibold">{o.number}</p>
              <p className="text-muted-foreground text-xs">
                {formatDate(o.createdAt)} · {o.pricing.itemCount} item
                {o.pricing.itemCount === 1 ? "" : "s"}
              </p>
            </div>
            <Badge variant={statusVariant(o.status)}>{ORDER_STATUS_LABEL[o.status]}</Badge>
            <span className="font-semibold tabular-nums">{formatINR(o.pricing.total)}</span>
            <ChevronRightIcon className="text-muted-foreground size-4" aria-hidden="true" />
          </Link>
        </li>
      ))}
    </ul>
  );
}
