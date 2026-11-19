import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { Prose } from "@/components/prose";

export const metadata: Metadata = {
  title: "Returns and refunds",
  description: "How returns, replacements and refunds would work at Teziko Home (demo policy).",
  alternates: { canonical: "/returns-policy" },
};

export default function Page() {
  return (
    <PageShell
      title="Returns and refunds"
      description="A sample policy written for this demo store."
      crumbs={[{ label: "Returns and refunds" }]}
    >
      <Prose>
        <h2>10-day returns</h2>
        <p>
          Most items can be returned within 10 days of delivery if unused, undamaged and in their
          original packaging. Large furniture is collected from your home at no charge.
        </p>
        <h2>Not returnable</h2>
        <ul>
          <li>Items that have been assembled and then damaged during use.</li>
          <li>Made-to-order or customised items.</li>
          <li>
            Appliances that have been installed, unless faulty (covered by the manufacturer
            warranty).
          </li>
        </ul>
        <h2>Damaged or wrong items</h2>
        <p>
          Report damage within 48 hours of delivery with a photo. We arrange a free replacement or a
          full refund.
        </p>
        <h2>Refunds</h2>
        <p>
          Refunds go back to the original payment method within 5 to 7 working days of pickup. Cash
          on delivery orders are refunded by bank transfer.
        </p>
        <h2>Cancellations</h2>
        <p>
          You can cancel any order before it ships from{" "}
          <Link href="/account/orders">My orders</Link>.
        </p>
        <p className="text-muted-foreground text-sm">
          Reminder: this is a demo. No real orders, returns or refunds take place.
        </p>
      </Prose>
    </PageShell>
  );
}
