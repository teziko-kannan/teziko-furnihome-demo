import {
  bestSellers,
  brandBySlug,
  LOW_STOCK_THRESHOLD,
  monthlySales,
  products,
  seedCustomers,
} from "@teziko/data";
import { Card, CardContent, CardHeader, CardTitle } from "@teziko/ui/components/card";
import { Reveal } from "@teziko/ui/motion/reveal";
import {
  AlertTriangleIcon,
  ClockIcon,
  IndianRupeeIcon,
  PackageIcon,
  ShoppingCartIcon,
  UsersIcon,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { BarSeries } from "@/features/dashboard/charts";
import { StatTile } from "@/features/dashboard/stat-tile";
import { RecentOrders } from "@/features/modules/recent-orders";
import { PageHeader } from "@/features/shell/page-header";
import { formatINR } from "@/lib/format";
import { getAllOrders } from "@/lib/orders";

export const metadata: Metadata = { title: "Dashboard" };

export default async function Dashboard() {
  const { orders, liveCount, liveError } = await getAllOrders();
  const revenue = monthlySales.reduce((s, m) => s + m.revenue, 0);
  const orderCount = monthlySales.reduce((s, m) => s + m.orders, 0) + liveCount;
  const pending = orders.filter((o) => ["placed", "confirmed", "packed"].includes(o.status)).length;
  const lowStock = products.flatMap((p) =>
    p.variants.filter((v) => v.stock <= LOW_STOCK_THRESHOLD).map((v) => ({ p, v })),
  );
  const best = bestSellers(undefined, 6);

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Last 12 months. Figures are seeded demo analytics plus live orders placed on the storefront."
      />
      <p className="text-muted-foreground mb-6 text-xs" role="status">
        {liveError
          ? `Live order feed unavailable (${liveError}). Showing seeded orders only.`
          : `${liveCount} live demo order${liveCount === 1 ? "" : "s"} from the storefront.`}
      </p>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatTile
          label="Revenue (12 mo)"
          value={revenue}
          prefix="₹"
          hint="Seeded demo figure"
          icon={IndianRupeeIcon}
          href="/reports"
        />
        <StatTile
          label="Orders"
          value={orderCount}
          hint={`${liveCount} live this session`}
          icon={ShoppingCartIcon}
          href="/orders"
          delay={0.05}
        />
        <StatTile
          label="Customers"
          value={seedCustomers.length}
          hint="Seeded demo customers"
          icon={UsersIcon}
          href="/customers"
          delay={0.1}
        />
        <StatTile
          label="Products"
          value={products.length}
          hint="Across 3 departments"
          icon={PackageIcon}
          href="/products"
          delay={0.15}
        />
        <StatTile
          label="Pending orders"
          value={pending}
          hint="Placed, confirmed or packed"
          icon={ClockIcon}
          href="/orders?status=pending"
          delay={0.2}
        />
        <StatTile
          label="Low-stock variants"
          value={lowStock.length}
          hint={`≤ ${LOW_STOCK_THRESHOLD} units`}
          icon={AlertTriangleIcon}
          href="/inventory"
          delay={0.25}
        />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.6fr_1fr] [&>*]:min-w-0">
        <Reveal>
          <Card>
            <CardHeader>
              <CardTitle>Monthly revenue</CardTitle>
              <p className="text-muted-foreground text-xs">Latest month highlighted</p>
            </CardHeader>
            <CardContent>
              <BarSeries
                title="Monthly revenue"
                data={monthlySales.map((m) => ({ label: m.month, value: m.revenue }))}
              />
            </CardContent>
          </Card>
        </Reveal>
        <Reveal delay={0.08}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Best sellers</CardTitle>
              <p className="text-muted-foreground text-xs">Units sold, last 90 days</p>
            </CardHeader>
            <CardContent>
              <ol className="space-y-3">
                {best.map((p, i) => (
                  <li key={p.id} className="flex items-center gap-3 text-sm">
                    <span className="text-muted-foreground w-5 tabular-nums">{i + 1}</span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-medium">{p.name}</span>
                      <span className="text-muted-foreground text-xs">
                        {brandBySlug.get(p.brand)?.name}
                      </span>
                    </span>
                    <span className="tabular-nums">{p.sold}</span>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        </Reveal>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.6fr_1fr] [&>*]:min-w-0">
        <Reveal>
          <Card>
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle>Recent orders</CardTitle>
              <Link
                href="/orders"
                className="text-sm font-medium underline-offset-4 hover:underline"
              >
                View all
              </Link>
            </CardHeader>
            <CardContent>
              <RecentOrders orders={orders.slice(0, 8)} />
            </CardContent>
          </Card>
        </Reveal>
        <Reveal delay={0.08}>
          <Card>
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle>Low stock</CardTitle>
              <Link
                href="/inventory"
                className="text-sm font-medium underline-offset-4 hover:underline"
              >
                Inventory
              </Link>
            </CardHeader>
            <CardContent>
              <ul className="divide-border divide-y text-sm">
                {lowStock.slice(0, 8).map(({ p, v }) => (
                  <li key={v.sku} className="flex items-center justify-between gap-3 py-2.5">
                    <span className="min-w-0">
                      <span className="block truncate">{p.name}</span>
                      <span className="text-muted-foreground text-xs">
                        {v.colour.name} · {formatINR(p.price + v.priceDelta)}
                      </span>
                    </span>
                    <span
                      className={
                        v.stock === 0
                          ? "text-error font-semibold"
                          : "text-warning-strong font-semibold"
                      }
                    >
                      {v.stock === 0 ? "Out" : `${v.stock} left`}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </Reveal>
      </div>
    </>
  );
}
