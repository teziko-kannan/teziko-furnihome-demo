"use client";

import { getProductImage } from "@teziko/data/images";
import type { Product } from "@teziko/types";
import { Badge } from "@teziko/ui/components/badge";
import { Switch } from "@teziko/ui/components/form-controls";
import { Input } from "@teziko/ui/components/input";
import { toast } from "@teziko/ui/components/toaster";
import { useHydrated } from "@teziko/ui/hooks/use-hydrated";
import Image from "next/image";
import { useMemo, useState } from "react";
import { cn, formatINR } from "@/lib/format";
import { useOverrides } from "../overrides/store";
import { DataTable, type AdminColumnDef } from "../table/data-table";

export interface ProductRow {
  product: Product;
  brandName: string;
  categoryName: string;
}

/** Number input that commits on blur/Enter. */
function InlineNumber({
  value,
  onCommit,
  label,
  min = 0,
}: {
  value: number;
  onCommit: (n: number) => void;
  label: string;
  min?: number;
}) {
  const [draft, setDraft] = useState(String(value));
  const [last, setLast] = useState(value);
  if (last !== value) {
    setLast(value);
    setDraft(String(value));
  }
  const commit = () => {
    const n = Math.round(Number(draft));
    if (!Number.isFinite(n) || n < min) {
      setDraft(String(value));
      toast.error(`${label}: enter a number ≥ ${min}`);
      return;
    }
    if (n !== value) onCommit(n);
  };
  return (
    <Input
      aria-label={label}
      inputMode="numeric"
      value={draft}
      onChange={(e) => setDraft(e.target.value.replace(/[^\d]/g, ""))}
      onBlur={commit}
      onKeyDown={(e) => e.key === "Enter" && (e.currentTarget as HTMLInputElement).blur()}
      className="h-9 w-28 text-sm tabular-nums"
    />
  );
}

export function ProductsTable({ rows }: { rows: ProductRow[] }) {
  const hydrated = useHydrated();
  const overrides = useOverrides((s) => s.products);
  const setProduct = useOverrides((s) => s.setProduct);
  const ov = useMemo(() => (hydrated ? overrides : {}), [hydrated, overrides]);

  const columns = useMemo<AdminColumnDef<ProductRow>[]>(
    () => [
      {
        id: "name",
        header: "Product",
        accessorFn: (r) => `${r.product.name} ${r.brandName}`,
        cell: ({ row }) => {
          const p = row.original.product;
          return (
            <div className="flex min-w-60 items-center gap-3">
              <Image
                src={getProductImage(p, 0).src}
                alt=""
                width={44}
                height={44}
                className="bg-muted size-11 rounded-lg object-cover"
              />
              <div>
                <p
                  className={cn(
                    "font-medium",
                    ov[p.id]?.hidden && "text-muted-foreground line-through",
                  )}
                >
                  {p.name}
                </p>
                <p className="text-muted-foreground text-xs">
                  {row.original.brandName} · {p.id}
                </p>
              </div>
            </div>
          );
        },
      },
      { id: "category", header: "Category", accessorFn: (r) => r.categoryName },
      {
        id: "price",
        header: "Price (₹)",
        accessorFn: (r) => ov[r.product.id]?.price ?? r.product.price,
        cell: ({ row, getValue }) => (
          <div>
            <InlineNumber
              label={`Price for ${row.original.product.name}`}
              value={getValue() as number}
              min={1}
              onCommit={(n) => {
                setProduct(row.original.product.id, { price: n });
                toast.success("Price updated", {
                  description: `${row.original.product.name}: ${formatINR(n)} (demo, this browser only)`,
                });
              }}
            />
            <p className="text-muted-foreground mt-1 text-xs">
              MRP {formatINR(row.original.product.mrp)}
            </p>
          </div>
        ),
      },
      {
        id: "stock",
        header: "Stock",
        accessorFn: (r) => r.product.variants.reduce((s, v) => s + v.stock, 0),
      },
      { id: "rating", header: "Rating", accessorFn: (r) => r.product.rating },
      { id: "sold", header: "Sold (90d)", accessorFn: (r) => r.product.sold },
      {
        id: "visible",
        header: "Visible",
        enableSorting: false,
        cell: ({ row }) => {
          const p = row.original.product;
          const hidden = Boolean(ov[p.id]?.hidden);
          return (
            <Switch
              aria-label={`Show ${p.name} in store`}
              checked={!hidden}
              onCheckedChange={(v) => {
                setProduct(p.id, { hidden: !v });
                toast(v ? "Product published" : "Product hidden", {
                  description: `${p.name} (demo flag, storefront unaffected)`,
                });
              }}
            />
          );
        },
      },
    ],
    [ov, setProduct],
  );

  return (
    <DataTable
      caption="Products"
      data={rows}
      columns={columns}
      getRowId={(r) => r.product.id}
      searchPlaceholder="Search products or brands…"
      pageSize={10}
    />
  );
}

interface VariantRow {
  sku: string;
  productId: string;
  name: string;
  variant: string;
  stock: number;
}

export function InventoryTable({ rows, threshold }: { rows: VariantRow[]; threshold: number }) {
  const hydrated = useHydrated();
  const overrides = useOverrides((s) => s.products);
  const setProduct = useOverrides((s) => s.setProduct);
  const [onlyLow, setOnlyLow] = useState(false);
  const stockOf = (r: VariantRow) => (hydrated ? (overrides[r.sku]?.stock ?? r.stock) : r.stock);
  const data = onlyLow ? rows.filter((r) => stockOf(r) <= threshold) : rows;

  const columns: AdminColumnDef<VariantRow>[] = [
    {
      accessorKey: "sku",
      header: "SKU",
      cell: ({ getValue }) => <span className="font-mono text-xs">{getValue() as string}</span>,
    },
    { accessorKey: "name", header: "Product" },
    { accessorKey: "variant", header: "Variant" },
    {
      id: "stock",
      header: "On hand",
      accessorFn: stockOf,
      cell: ({ row, getValue }) => (
        <InlineNumber
          label={`Stock for ${row.original.sku}`}
          value={getValue() as number}
          onCommit={(n) => {
            setProduct(row.original.sku, { stock: n });
            toast.success("Stock updated", {
              description: `${row.original.sku}: ${n} units (demo)`,
            });
          }}
        />
      ),
    },
    {
      id: "status",
      header: "Status",
      accessorFn: stockOf,
      cell: ({ getValue }) => {
        const s = getValue() as number;
        return s === 0 ? (
          <Badge variant="error">Out of stock</Badge>
        ) : s <= threshold ? (
          <Badge variant="warning">Low</Badge>
        ) : (
          <Badge variant="success">In stock</Badge>
        );
      },
    },
  ];

  return (
    <DataTable
      caption="Inventory by variant"
      data={data}
      columns={columns}
      getRowId={(r) => r.sku}
      searchPlaceholder="Search SKU or product…"
      toolbar={
        <label className="flex items-center gap-2 text-sm">
          <Switch checked={onlyLow} onCheckedChange={setOnlyLow} aria-label="Show low stock only" />
          Low stock only
        </label>
      }
    />
  );
}
