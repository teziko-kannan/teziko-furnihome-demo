"use client";

import { ORDER_STATUS_LABEL } from "@teziko/data/orders";
import type { Order, OrderStatus } from "@teziko/types";
import { Badge } from "@teziko/ui/components/badge";
import { NativeSelect } from "@teziko/ui/components/input";
import { toast } from "@teziko/ui/components/toaster";
import { useMemo, useState } from "react";
import { formatDateTime, formatINR } from "@/lib/format";
import { useOverrides } from "../overrides/store";
import { DataTable, type AdminColumnDef } from "../table/data-table";
import { StatusBadge, useOrdersWithOverrides } from "./order-status";

const STATUSES = Object.keys(ORDER_STATUS_LABEL) as OrderStatus[];
const PENDING: OrderStatus[] = ["placed", "confirmed", "packed"];

export function OrdersTable({
  orders,
  initialQuery,
  initialStatus,
}: {
  orders: Order[];
  initialQuery?: string;
  initialStatus?: string;
}) {
  const list = useOrdersWithOverrides(orders);
  const setStatus = useOverrides((s) => s.setOrderStatus);
  const [filter, setFilter] = useState(initialStatus ?? "all");

  const data = useMemo(() => {
    let rows = list;
    if (filter === "pending") rows = rows.filter((o) => PENDING.includes(o.status));
    else if (filter !== "all") rows = rows.filter((o) => o.status === filter);
    if (initialQuery) rows = rows.filter((o) => o.number.includes(initialQuery.toUpperCase()));
    return rows;
  }, [list, filter, initialQuery]);

  const columns = useMemo<AdminColumnDef<Order>[]>(
    () => [
      {
        accessorKey: "number",
        header: "Order",
        cell: ({ row }) => (
          <div>
            <p className="font-medium">{row.original.number}</p>
            {row.original.id.startsWith("seed-") ? null : (
              <Badge variant="info" className="mt-1">
                Live demo
              </Badge>
            )}
          </div>
        ),
      },
      {
        accessorKey: "customerName",
        header: "Customer",
        cell: ({ row }) => (
          <div>
            <p>{row.original.customerName}</p>
            <p className="text-muted-foreground text-xs">{row.original.email}</p>
          </div>
        ),
      },
      {
        accessorKey: "createdAt",
        header: "Date",
        cell: ({ getValue }) => (
          <span className="whitespace-nowrap">{formatDateTime(getValue() as string)}</span>
        ),
      },
      { id: "items", header: "Items", accessorFn: (o) => o.pricing.itemCount },
      {
        id: "total",
        header: "Total",
        accessorFn: (o) => o.pricing.total,
        cell: ({ getValue }) => (
          <span className="font-semibold tabular-nums">{formatINR(getValue() as number)}</span>
        ),
      },
      {
        accessorKey: "paymentMethod",
        header: "Payment",
        cell: ({ row }) => <span className="uppercase">{row.original.paymentMethod}</span>,
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => <StatusBadge status={row.original.status} />,
      },
      {
        id: "update",
        header: "Update status",
        enableSorting: false,
        cell: ({ row }) => (
          <NativeSelect
            aria-label={`Update status for ${row.original.number}`}
            value={row.original.status}
            onChange={(e) => {
              setStatus(row.original.number, e.target.value as OrderStatus);
              toast.success(
                `${row.original.number} → ${ORDER_STATUS_LABEL[e.target.value as OrderStatus]}`,
                { description: "Saved in this browser (demo)." },
              );
            }}
            className="h-9 w-40 text-sm"
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {ORDER_STATUS_LABEL[s]}
              </option>
            ))}
          </NativeSelect>
        ),
      },
    ],
    [setStatus],
  );

  return (
    <DataTable
      caption="Orders"
      data={data}
      columns={columns}
      getRowId={(o) => o.number}
      searchPlaceholder="Search orders, customers…"
      toolbar={
        <NativeSelect
          aria-label="Filter by status"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="h-10 w-44 text-sm"
        >
          <option value="all">All statuses</option>
          <option value="pending">Pending (placed → packed)</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {ORDER_STATUS_LABEL[s]}
            </option>
          ))}
        </NativeSelect>
      }
    />
  );
}
