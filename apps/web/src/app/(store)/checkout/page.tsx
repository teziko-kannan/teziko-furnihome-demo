import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";
import { CheckoutFlow } from "@/features/checkout/checkout-flow";

export const metadata: Metadata = { title: "Checkout", robots: { index: false } };

export default function Page() {
  return (
    <PageShell title="Checkout" crumbs={[{ label: "Cart", href: "/cart" }, { label: "Checkout" }]}>
      <CheckoutFlow />
    </PageShell>
  );
}
