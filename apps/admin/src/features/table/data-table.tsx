"use client";

import {
  columnFilteringFeature,
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  filterFn_includesString,
  flexRender,
  globalFilteringFeature,
  rowPaginationFeature,
  rowSortingFeature,
  sortFn_alphanumeric,
  sortFn_basic,
  sortFn_datetime,
  sortFn_text,
  tableFeatures,
  useTable,
  type ColumnDef,
  type RowData,
} from "@tanstack/react-table";
import { Button } from "@teziko/ui/components/button";
import { Input } from "@teziko/ui/components/input";
import { StateBlock } from "@teziko/ui/components/states";
import { ArrowDownIcon, ArrowUpDownIcon, ArrowUpIcon, SearchIcon, SearchXIcon } from "lucide-react";
import { m } from "motion/react";
import type { ReactNode } from "react";
import { cn } from "@/lib/format";

/** Explicit TanStack Table v9 features: sorting, global search and pagination. Defined once at module scope. */
export const adminTableFeatures = tableFeatures({
  rowSortingFeature,
  columnFilteringFeature,
  globalFilteringFeature,
  rowPaginationFeature,
  sortedRowModel: createSortedRowModel(),
  filteredRowModel: createFilteredRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  filterFns: { includesString: filterFn_includesString },
  sortFns: {
    alphanumeric: sortFn_alphanumeric,
    basic: sortFn_basic,
    datetime: sortFn_datetime,
    text: sortFn_text,
  },
});

export type AdminColumnDef<T extends RowData> = ColumnDef<typeof adminTableFeatures, T>;

interface DataTableProps<T extends RowData> {
  data: T[];
  columns: AdminColumnDef<T>[];
  searchPlaceholder?: string;
  pageSize?: number;
  toolbar?: ReactNode;
  getRowId?: (row: T) => string;
  caption: string;
}

/** Sortable, searchable, paginated table with subtle row entrance transitions. */
export function DataTable<T extends RowData>({
  data,
  columns,
  searchPlaceholder = "Search…",
  pageSize = 12,
  toolbar,
  getRowId,
  caption,
}: DataTableProps<T>) {
  const table = useTable({
    features: adminTableFeatures,
    columns,
    data,
    getRowId: getRowId ? (row: T) => getRowId(row) : undefined,
    globalFilterFn: "includesString",
    initialState: { pagination: { pageIndex: 0, pageSize } },
  });

  const rows = table.getRowModel().rows;
  const { pageIndex } = table.state.pagination;
  const globalFilter = String(table.state.globalFilter ?? "");

  return (
    <div className="border-border bg-background rounded-2xl border">
      <div className="border-border flex flex-col gap-3 border-b p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <SearchIcon
            className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2"
            aria-hidden="true"
          />
          <Input
            value={globalFilter}
            onChange={(e) => table.setGlobalFilter(e.target.value)}
            placeholder={searchPlaceholder}
            aria-label={searchPlaceholder}
            className="h-10 pl-9"
          />
        </div>
        {toolbar ? <div className="flex flex-wrap items-center gap-2">{toolbar}</div> : null}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <caption className="sr-only">{caption}</caption>
          <thead>
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id} className="border-border border-b">
                {hg.headers.map((h) => {
                  const sort = h.column.getIsSorted();
                  return (
                    <th
                      key={h.id}
                      scope="col"
                      aria-sort={
                        sort === "asc" ? "ascending" : sort === "desc" ? "descending" : undefined
                      }
                      className="text-muted-foreground h-11 px-4 text-left text-xs font-semibold tracking-wide whitespace-nowrap uppercase"
                    >
                      {h.isPlaceholder ? null : h.column.getCanSort() ? (
                        <button
                          type="button"
                          onClick={(e) => h.column.getToggleSortingHandler()?.(e)}
                          className="hover:text-foreground inline-flex items-center gap-1.5 uppercase"
                        >
                          {flexRender(h.column.columnDef.header, h.getContext())}
                          {sort === "asc" ? (
                            <ArrowUpIcon className="size-3" aria-hidden="true" />
                          ) : sort === "desc" ? (
                            <ArrowDownIcon className="size-3" aria-hidden="true" />
                          ) : (
                            <ArrowUpDownIcon className="size-3 opacity-40" aria-hidden="true" />
                          )}
                        </button>
                      ) : (
                        flexRender(h.column.columnDef.header, h.getContext())
                      )}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <m.tr
                key={`${pageIndex}-${row.id}`}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: Math.min(i * 0.02, 0.2) }}
                className="border-border hover:bg-muted/50 border-b last:border-0"
              >
                {row.getAllCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-3 align-middle">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </m.tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 ? (
          <StateBlock
            icon={SearchXIcon}
            title="No matching rows"
            description="Try a different search."
            className="m-4"
          />
        ) : null}
      </div>
      <div
        className={cn(
          "border-border flex items-center justify-between gap-3 border-t p-3 text-sm",
          table.getPageCount() <= 1 && "hidden",
        )}
      >
        <p className="text-muted-foreground">
          Page {pageIndex + 1} of {table.getPageCount()} · {table.getFilteredRowModel().rows.length}{" "}
          rows
        </p>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
