import { coupons } from "@teziko/data";
import type { Metadata } from "next";
import { CouponsManager } from "@/features/modules/marketing";
import { PageHeader } from "@/features/shell/page-header";

export const metadata: Metadata = { title: "Coupons" };

export default function Page() {
  return (
    <>
      <PageHeader
        title="Coupons"
        description="Toggle and create codes. The storefront validates codes from the static catalogue, so edits here are demo-only."
      />
      <CouponsManager coupons={coupons} />
    </>
  );
}
