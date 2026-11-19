import { categories, categoryBySlug, products } from "@teziko/data";
import { Badge } from "@teziko/ui/components/badge";
import type { Metadata } from "next";
import { PageHeader } from "@/features/shell/page-header";
import { SimpleTable } from "@/features/shell/simple-table";

export const metadata: Metadata = { title: "Categories" };

export default function Page() {
  return (
    <>
      <PageHeader
        title="Categories"
        description="Category tree from the static catalogue (read-only in the demo)."
      />
      <SimpleTable
        caption="Categories"
        head={["Name", "Slug", "Parent", "Department", "Products"]}
        rows={categories.map((c) => [
          <span key="n" className={c.parent ? "pl-4" : "font-semibold"}>
            {c.parent ? "↳ " : ""}
            {c.name}
          </span>,
          <code key="s" className="text-xs">
            {c.slug}
          </code>,
          c.parent ? categoryBySlug.get(c.parent)?.name : "—",
          <Badge key="d" variant="muted">
            {c.department}
          </Badge>,
          products.filter((p) => p.subcategory === c.slug || p.category === c.slug).length,
        ])}
      />
    </>
  );
}
