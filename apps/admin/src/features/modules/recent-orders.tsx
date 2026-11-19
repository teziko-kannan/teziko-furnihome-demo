"use client";

import type { Order } from "@teziko/types";
import Link from "next/link";
import { formatDateTime, formatINR } from "@/lib/format";
import { StatusBadge, useOrdersWithOverrides } from "./order-status";

export function RecentOrders({ orders }: { orders: Order[] }) {
  const list = useOrdersWithOverrides(orders);
  return (
    <ul className="divide-border divide-y">
      {list.map((o) => (
        <li key={o.number}>
          <Link
            href={`/orders?q=${o.number}`}
            className="hover:bg-muted/40 flex items-center gap-3 py-3 text-sm"
          >
            <div className="min-w-0 flex-1">
              <p className="font-medium">{o.number}</p>
              <p className="text-muted-foreground truncate text-xs">
                {o.customerName} · {formatDateTime(o.createdAt)}
              </p>
            </div>
            <StatusBadge status={o.status} />
            <span className="w-24 text-right font-semibold tabular-nums">
              {formatINR(o.pricing.total)}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
