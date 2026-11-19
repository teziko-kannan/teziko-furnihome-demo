import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";
import { ComparePage } from "@/features/shopper/compare-page";

export const metadata: Metadata = { title: "Compare products", robots: { index: false } };

export default function Page() {
  return (
    <PageShell
      title="Compare products"
      description="See specifications side by side (up to 4 products)."
      crumbs={[{ label: "Compare" }]}
    >
      <ComparePage />
    </PageShell>
  );
}
