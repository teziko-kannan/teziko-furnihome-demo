import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";
import { CartPage } from "@/features/cart/cart-page";

export const metadata: Metadata = { title: "Your cart", robots: { index: false } };

export default function Page() {
  return (
    <PageShell title="Your cart" crumbs={[{ label: "Cart" }]}>
      <CartPage />
    </PageShell>
  );
}
