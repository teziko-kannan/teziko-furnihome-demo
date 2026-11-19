import { LOW_STOCK_THRESHOLD, products } from "@teziko/data";
import type { Metadata } from "next";
import { InventoryTable } from "@/features/modules/catalog-tables";
import { PageHeader } from "@/features/shell/page-header";

export const metadata: Metadata = { title: "Inventory" };

export default function Page() {
  const rows = products.flatMap((p) =>
    p.variants.map((v) => ({
      sku: v.sku,
      productId: p.id,
      name: p.name,
      variant: [v.colour.name, v.size, v.material].filter(Boolean).join(" · "),
      stock: v.stock,
    })),
  );
  return (
    <>
      <PageHeader
        title="Inventory"
        description={`${rows.length} variants. Low stock is ${LOW_STOCK_THRESHOLD} units or fewer. Adjustments are saved in this browser (demo).`}
      />
      <InventoryTable rows={rows} threshold={LOW_STOCK_THRESHOLD} />
    </>
  );
}
