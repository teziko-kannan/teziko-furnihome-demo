import { productById, reviews } from "@teziko/data";
import type { Metadata } from "next";
import { ReviewsModeration } from "@/features/modules/marketing";
import { PageHeader } from "@/features/shell/page-header";

export const metadata: Metadata = { title: "Reviews" };

export default function Page() {
  const rows = [...reviews]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .map((r) => ({ ...r, productName: productById.get(r.productId)?.name ?? r.productId }));
  return (
    <>
      <PageHeader
        title="Reviews"
        description={`${rows.length} seeded demo reviews. Hide or restore reviews; moderation flags are saved in this browser.`}
      />
      <ReviewsModeration reviews={rows} />
    </>
  );
}
