import { banners } from "@teziko/data";
import type { Metadata } from "next";
import { BannersManager } from "@/features/modules/marketing";
import { PageHeader } from "@/features/shell/page-header";

export const metadata: Metadata = { title: "Banners" };

export default function Page() {
  return (
    <>
      <PageHeader
        title="Banners"
        description="Hero, promo and seasonal banners. Pausing a banner is a demo flag saved in this browser."
      />
      <BannersManager banners={banners} />
    </>
  );
}
