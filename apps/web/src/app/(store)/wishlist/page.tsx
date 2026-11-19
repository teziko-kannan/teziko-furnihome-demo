import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";
import { WishlistPage } from "@/features/shopper/wishlist-page";

export const metadata: Metadata = { title: "Wishlist", robots: { index: false } };

export default function Page() {
  return (
    <PageShell
      title="Wishlist"
      description="Products you have saved in this browser."
      crumbs={[{ label: "Wishlist" }]}
    >
      <WishlistPage />
    </PageShell>
  );
}
