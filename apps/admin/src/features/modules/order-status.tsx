"use client";

import { ORDER_STATUS_LABEL } from "@teziko/data/orders";
import type { Order, OrderStatus } from "@teziko/types";
import { Badge } from "@teziko/ui/components/badge";
import { useHydrated } from "@teziko/ui/hooks/use-hydrated";
import { useMemo } from "react";
import { useOverrides } from "../overrides/store";

export function statusVariant(s: OrderStatus) {
  if (s === "delivered") return "success" as const;
  if (s === "cancelled" || s === "payment-failed") return "error" as const;
  if (s === "placed" || s === "confirmed") return "info" as const;
  return "warning" as const;
}

export function StatusBadge({ status }: { status: OrderStatus }) {
  return <Badge variant={statusVariant(status)}>{ORDER_STATUS_LABEL[status]}</Badge>;
}

/** Applies admin status edits (stored in this browser) on top of server-provided orders. */
export function useOrdersWithOverrides(orders: Order[]) {
  const hydrated = useHydrated();
  const overrides = useOverrides((s) => s.orders);
  return useMemo(
    () =>
      hydrated
        ? orders.map((o) =>
            overrides[o.number] ? { ...o, status: overrides[o.number]!.status } : o,
          )
        : orders,
    [orders, overrides, hydrated],
  );
}
