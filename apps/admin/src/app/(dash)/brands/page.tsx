import { brands, products } from "@teziko/data";
import type { Metadata } from "next";
import { PageHeader } from "@/features/shell/page-header";
import { SimpleTable } from "@/features/shell/simple-table";
import { formatINR } from "@/lib/format";

export const metadata: Metadata = { title: "Brands" };

export default function Page() {
  return (
    <>
      <PageHeader title="Brands" description="All brands are fictional demo brands." />
      <SimpleTable
        caption="Brands"
        head={[
          "Brand",
          "Origin",
          "Founded",
          "Departments",
          "Products",
          "Units sold (90d)",
          "Avg. price",
        ]}
        rows={brands.map((b) => {
          const list = products.filter((p) => p.brand === b.slug);
          return [
            <div key="b">
              <p className="font-medium">{b.name}</p>
              <p className="text-muted-foreground text-xs">{b.tagline}</p>
            </div>,
            b.origin,
            b.founded,
            b.departments.join(", "),
            list.length,
            list.reduce((s, p) => s + p.sold, 0).toLocaleString("en-IN"),
            list.length ? formatINR(list.reduce((s, p) => s + p.price, 0) / list.length) : "—",
          ];
        })}
      />
    </>
  );
}
