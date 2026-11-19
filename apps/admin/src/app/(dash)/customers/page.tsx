import { seedCustomers } from "@teziko/data";
import { Badge } from "@teziko/ui/components/badge";
import type { Metadata } from "next";
import { PageHeader } from "@/features/shell/page-header";
import { SimpleTable } from "@/features/shell/simple-table";
import { formatDate, formatINR } from "@/lib/format";
import { getAllOrders } from "@/lib/orders";

export const metadata: Metadata = { title: "Customers" };

export default async function Page() {
  const { orders } = await getAllOrders();
  const live = new Map<string, { name: string; count: number; total: number; first: string }>();
  for (const o of orders.filter((x) => !x.id.startsWith("seed-"))) {
    const cur = live.get(o.email) ?? {
      name: o.customerName,
      count: 0,
      total: 0,
      first: o.createdAt,
    };
    live.set(o.email, {
      ...cur,
      count: cur.count + 1,
      total: cur.total + o.pricing.total,
      first: o.createdAt < cur.first ? o.createdAt : cur.first,
    });
  }
  const rows = [
    ...[...live.entries()].map(([email, c]) => [
      <div key="n">
        <p className="font-medium">{c.name}</p>
        <p className="text-muted-foreground text-xs">{email}</p>
      </div>,
      "—",
      c.count,
      formatINR(c.total),
      formatDate(c.first),
      <Badge key="t" variant="info">
        Live demo
      </Badge>,
    ]),
    ...seedCustomers.map((c) => [
      <div key="n">
        <p className="font-medium">{c.name}</p>
        <p className="text-muted-foreground text-xs">{c.email}</p>
      </div>,
      c.city,
      c.orders,
      formatINR(c.lifetimeValue),
      formatDate(c.joinedAt),
      <Badge key="t" variant="muted">
        Seeded
      </Badge>,
    ]),
  ];
  return (
    <>
      <PageHeader
        title="Customers"
        description="Seeded demo customers plus anyone who placed a live demo order. Fictional data; emails use example.com."
      />
      <SimpleTable
        caption="Customers"
        head={["Customer", "City", "Orders", "Lifetime value", "Joined", "Source"]}
        rows={rows}
      />
    </>
  );
}
