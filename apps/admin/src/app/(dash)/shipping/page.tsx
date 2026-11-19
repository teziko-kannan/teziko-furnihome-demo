import { BULKY_SHIPPING, FREE_SHIPPING_THRESHOLD, STANDARD_SHIPPING } from "@teziko/data";
import type { Metadata } from "next";
import { StatusBadge } from "@/features/modules/order-status";
import { PageHeader } from "@/features/shell/page-header";
import { SimpleTable } from "@/features/shell/simple-table";
import { formatDateTime, formatINR } from "@/lib/format";
import { getAllOrders } from "@/lib/orders";

export const metadata: Metadata = { title: "Shipping" };

export default async function Page() {
  const { orders } = await getAllOrders();
  const inTransit = orders.filter((o) =>
    ["packed", "shipped", "out-for-delivery"].includes(o.status),
  );
  const rules = [
    ["Free delivery", `Orders of ${formatINR(FREE_SHIPPING_THRESHOLD)} or more (after coupons)`],
    ["Standard delivery", `${formatINR(STANDARD_SHIPPING)} below the threshold`],
    [
      "Large items",
      `${formatINR(BULKY_SHIPPING)} below the threshold when the cart contains furniture or large appliances`,
    ],
    ["FREESHIP coupon", "Waives delivery on orders above ₹999"],
    ["Installation", "Free for sofas, beds, wardrobes and large appliances (simulated scheduling)"],
  ];
  return (
    <>
      <PageHeader
        title="Shipping"
        description="Delivery rules applied by the pricing engine, and shipments currently moving through the demo timeline."
      />
      <div className="grid gap-6 xl:grid-cols-[1fr_1.4fr] [&>*]:min-w-0">
        <section
          aria-labelledby="rules-h"
          className="border-border bg-background rounded-2xl border p-5"
        >
          <h2 id="rules-h" className="font-sans text-base font-semibold tracking-normal">
            Delivery rules
          </h2>
          <dl className="divide-border mt-4 divide-y text-sm">
            {rules.map(([k, v]) => (
              <div key={k} className="grid gap-1 py-3 sm:grid-cols-[150px_1fr]">
                <dt className="font-medium">{k}</dt>
                <dd className="text-muted-foreground">{v}</dd>
              </div>
            ))}
          </dl>
        </section>
        <section aria-labelledby="transit-h">
          <h2 id="transit-h" className="mb-3 font-sans text-base font-semibold tracking-normal">
            In transit ({inTransit.length})
          </h2>
          <SimpleTable
            caption="Shipments in transit"
            head={["Order", "Destination", "Placed", "Status", "Delivery fee"]}
            rows={inTransit.map((o) => [
              o.number,
              `${o.shippingAddress.city}`,
              formatDateTime(o.createdAt),
              <StatusBadge key="s" status={o.status} />,
              o.pricing.shipping ? formatINR(o.pricing.shipping) : "Free",
            ])}
          />
        </section>
      </div>
    </>
  );
}
