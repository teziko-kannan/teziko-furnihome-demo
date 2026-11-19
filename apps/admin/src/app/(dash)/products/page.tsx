import { brandBySlug, categoryBySlug, products } from "@teziko/data";
import type { Metadata } from "next";
import { ProductsTable } from "@/features/modules/catalog-tables";
import { PageHeader } from "@/features/shell/page-header";

export const metadata: Metadata = { title: "Products" };

export default function Page() {
  const rows = products.map((p) => ({
    product: p,
    brandName: brandBySlug.get(p.brand)?.name ?? p.brand,
    categoryName: categoryBySlug.get(p.subcategory)?.name ?? "",
  }));
  return (
    <>
      <PageHeader
        title="Products"
        description="Edit prices and visibility inline. Changes are demo-persisted in this browser and do not alter the storefront's static catalogue."
      />
      <ProductsTable rows={rows} />
    </>
  );
}
