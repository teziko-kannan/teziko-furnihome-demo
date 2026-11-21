"use client";

import { canCancel, ORDER_STATUS_LABEL } from "@teziko/data/orders";
import { getKindImage } from "@teziko/data/images";
import type { Order } from "@teziko/types";
import { Badge } from "@teziko/ui/components/badge";
import { Button } from "@teziko/ui/components/button";
import { toast } from "@teziko/ui/components/toaster";
import Link from "next/link";
import { ProductImage } from "@/components/product-image";
import { formatDateTime, formatINR } from "@/lib/format";
import { OrderTimeline } from "./order-timeline";

const PAYMENT_LABEL = {
  upi: "UPI",
  card: "Card",
  netbanking: "Net banking",
  cod: "Cash on delivery",
} as const;

/** Human-readable payment line, e.g. "UPI · Paid" or "Cash on delivery · Pay when it arrives". */
function paymentLabel(order: Order) {
  const status = {
    paid: "Paid",
    pending: "Pending",
    failed: "Failed",
    cod: "Pay when it arrives",
  }[order.paymentStatus];
  return `${PAYMENT_LABEL[order.paymentMethod]} · ${status}`;
}

export function statusVariant(status: Order["status"]) {
  if (status === "delivered") return "success" as const;
  if (status === "cancelled" || status === "payment-failed") return "error" as const;
  if (status === "placed" || status === "confirmed") return "info" as const;
  return "warning" as const;
}

export function OrderDetails({
  order,
  onReplace,
}: {
  order: Order;
  onReplace?: (o: Order) => Promise<void>;
}) {
  async function cancel() {
    if (!onReplace) return;
    await onReplace({
      ...order,
      status: "cancelled",
      events: [
        ...order.events,
        { status: "cancelled", at: new Date().toISOString(), note: "Cancelled by customer" },
      ],
    });
    toast("Order cancelled", { description: `${order.number} will not be delivered (demo).` });
  }

  const p = order.pricing;
  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
      <div className="space-y-8">
        <section aria-labelledby="track-h" className="border-border rounded-2xl border p-5 sm:p-6">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <h2 id="track-h" className="font-sans text-lg font-semibold tracking-normal">
              Tracking
            </h2>
            <Badge variant={statusVariant(order.status)}>{ORDER_STATUS_LABEL[order.status]}</Badge>
          </div>
          <OrderTimeline order={order} />
          <p className="text-muted-foreground mt-5 text-xs">
            Demo timeline: stages advance automatically over about 15 minutes.
          </p>
        </section>
        <section aria-labelledby="items-h">
          <h2 id="items-h" className="mb-3 font-sans text-lg font-semibold tracking-normal">
            Items
          </h2>
          <ul className="divide-border border-border divide-y rounded-2xl border">
            {p.lines.map((l) => (
              <li key={l.sku} className="flex items-center gap-4 p-4">
                <span className="bg-muted size-16 shrink-0 overflow-hidden rounded-lg">
                  <ProductImage image={getKindImage(l.kind, l.hex)} sizes="64px" alt="" />
                </span>
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/product/${l.slug}`}
                    className="line-clamp-1 text-sm font-medium hover:underline"
                  >
                    {l.name}
                  </Link>
                  <p className="text-muted-foreground text-xs">
                    {l.variantLabel} · Qty {l.quantity}
                  </p>
                </div>
                <span className="text-sm font-semibold tabular-nums">{formatINR(l.lineTotal)}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
      <aside className="border-border h-fit space-y-5 rounded-2xl border p-5 text-sm">
        <div>
          <h2 className="font-sans text-base font-semibold tracking-normal">Summary</h2>
          <dl className="mt-3 space-y-2">
            <Row label="Placed" value={formatDateTime(order.createdAt)} />
            <Row label="Payment" value={paymentLabel(order)} />
            <Row label="Items" value={formatINR(p.subtotal)} />
            {p.couponDiscount ? (
              <Row label={`Coupon ${p.couponCode}`} value={`−${formatINR(p.couponDiscount)}`} />
            ) : null}
            <Row
              label="Taxable value"
              value={formatINR(p.subtotal - p.couponDiscount - p.gstIncluded)}
            />
            <Row label="GST" value={formatINR(p.gstIncluded)} />
            <Row label="Shipping" value={p.shipping ? formatINR(p.shipping) : "Free"} />
            <Row label="Total" value={<strong>{formatINR(p.total)}</strong>} />
          </dl>
        </div>
        <div>
          <h2 className="font-sans text-base font-semibold tracking-normal">Delivery address</h2>
          <p className="text-muted-foreground mt-2 leading-relaxed">
            {order.shippingAddress.fullName}
            <br />
            {order.shippingAddress.line1}
            {order.shippingAddress.line2 ? `, ${order.shippingAddress.line2}` : ""}
            <br />
            {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
            {order.shippingAddress.pincode}
          </p>
        </div>
        {onReplace && canCancel(order.status) ? (
          <Button variant="outline" className="w-full" onClick={cancel}>
            Cancel order
          </Button>
        ) : null}
      </aside>
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="text-right tabular-nums">{value}</dd>
    </div>
  );
}
