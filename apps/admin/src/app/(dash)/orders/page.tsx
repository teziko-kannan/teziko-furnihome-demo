import type { Metadata } from "next";
import { OrdersTable } from "@/features/modules/orders-table";
import { PageHeader } from "@/features/shell/page-header";
import { getAllOrders } from "@/lib/orders";

export const metadata: Metadata = { title: "Orders" };

export default async function Page({ searchParams }: PageProps<"/orders">) {
  const sp = await searchParams;
  const { orders, liveCount } = await getAllOrders();
  return (
    <>
      <PageHeader
        title="Orders"
        description={`${orders.length} orders (${liveCount} live from the storefront, the rest seeded). Status changes are stored in this browser.`}
      />
      <OrdersTable
        orders={orders}
        initialQuery={typeof sp.q === "string" ? sp.q : undefined}
        initialStatus={typeof sp.status === "string" ? sp.status : undefined}
      />
    </>
  );
}
