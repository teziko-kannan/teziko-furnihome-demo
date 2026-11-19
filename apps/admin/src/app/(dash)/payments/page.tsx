import { Badge } from "@teziko/ui/components/badge";
import type { Metadata } from "next";
import { PageHeader } from "@/features/shell/page-header";
import { SimpleTable } from "@/features/shell/simple-table";
import { formatDateTime, formatINR } from "@/lib/format";
import { getAllOrders } from "@/lib/orders";

export const metadata: Metadata = { title: "Payments" };

const LABEL = {
  upi: "UPI",
  card: "Card",
  netbanking: "Net banking",
  cod: "Cash on delivery",
} as const;

export default async function Page() {
  const { orders } = await getAllOrders();
  const byMethod = (Object.keys(LABEL) as (keyof typeof LABEL)[]).map((m) => {
    const list = orders.filter((o) => o.paymentMethod === m);
    return {
      m,
      count: list.length,
      amount: list
        .filter((o) => o.paymentStatus === "paid")
        .reduce((s, o) => s + o.pricing.total, 0),
    };
  });
  const total = byMethod.reduce((s, x) => s + x.count, 0) || 1;
  return (
    <>
      <PageHeader
        title="Payments"
        description="All payments are simulated: there is no payment gateway and no card data is ever collected."
      />
      <ul className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {byMethod.map((x) => (
          <li key={x.m} className="border-border bg-background rounded-2xl border p-5">
            <p className="text-muted-foreground text-sm">{LABEL[x.m]}</p>
            <p className="font-display mt-2 text-2xl">{formatINR(x.amount)}</p>
            <p className="text-muted-foreground text-xs">
              {x.count} orders · {Math.round((x.count / total) * 100)}% share
            </p>
            <div className="bg-border mt-3 h-1.5 overflow-hidden rounded-full" aria-hidden="true">
              <div
                className="bg-secondary h-full w-full origin-left rounded-full"
                style={{ transform: `scaleX(${x.count / total})` }}
              />
            </div>
          </li>
        ))}
      </ul>
      <SimpleTable
        caption="Transactions"
        head={["Order", "Date", "Method", "Status", "Amount"]}
        rows={orders.slice(0, 30).map((o) => [
          o.number,
          formatDateTime(o.createdAt),
          LABEL[o.paymentMethod],
          <Badge
            key="s"
            variant={
              o.paymentStatus === "paid"
                ? "success"
                : o.paymentStatus === "failed"
                  ? "error"
                  : "warning"
            }
          >
            {o.paymentStatus === "cod" ? "COD pending" : o.paymentStatus}
          </Badge>,
          <span key="a" className="font-semibold tabular-nums">
            {formatINR(o.pricing.total)}
          </span>,
        ])}
      />
    </>
  );
}
