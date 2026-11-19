"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@teziko/ui/components/accordion";
import { Button } from "@teziko/ui/components/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
} from "@teziko/ui/components/drawer";
import { Checkbox, Slider, Switch } from "@teziko/ui/components/form-controls";
import { NativeSelect } from "@teziko/ui/components/input";
import type { ListingResult } from "@teziko/data";
import { SlidersHorizontalIcon, StarIcon, XIcon } from "lucide-react";
import { useState } from "react";
import { cn, formatINR } from "@/lib/format";
import { useListing } from "./listing-state";

type Facets = ListingResult["facets"];

function listOf(params: URLSearchParams, key: string) {
  return (params.get(key) ?? "").split(",").filter(Boolean);
}

export function FilterPanel({
  facets,
  showCategories,
}: {
  facets: Facets;
  showCategories: boolean;
}) {
  const { params, toggleListValue, update, clearAll } = useListing();
  const [lo, hi] = facets.priceRange;
  const step = hi - lo > 50000 ? 1000 : 100;
  const min = Number(params.get("min") ?? lo);
  const max = Number(params.get("max") ?? hi);
  const [range, setRange] = useState<[number, number]>([min, max]);
  const [lastKey, setLastKey] = useState(`${min}-${max}`);
  if (lastKey !== `${min}-${max}`) {
    setLastKey(`${min}-${max}`);
    setRange([min, max]);
  }
  const rating = Number(params.get("rating") ?? 0);

  const checkList = (
    key: string,
    options: { value: string; label: string; count?: number; swatch?: string }[],
  ) => (
    <ul className="space-y-2.5">
      {options.map((o) => {
        const id = `f-${key}-${o.value}`.replace(/[^a-zA-Z0-9-]/g, "-");
        const checked = listOf(params, key).includes(o.value);
        return (
          <li key={o.value} className="flex items-center gap-2.5">
            <Checkbox
              id={id}
              checked={checked}
              onCheckedChange={() => toggleListValue(key, o.value)}
            />
            <label htmlFor={id} className="flex flex-1 cursor-pointer items-center gap-2 text-sm">
              {o.swatch ? (
                <span
                  aria-hidden="true"
                  className="size-4 rounded-full border border-black/10"
                  style={{ background: o.swatch }}
                />
              ) : null}
              {o.label}
              {o.count !== undefined ? (
                <span className="text-muted-foreground ml-auto text-xs tabular-nums">
                  {o.count}
                </span>
              ) : null}
            </label>
          </li>
        );
      })}
    </ul>
  );

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <h2 className="font-sans text-sm font-semibold tracking-normal">Filters</h2>
        <button
          type="button"
          onClick={clearAll}
          className="text-muted-foreground hover:text-foreground text-xs font-medium underline-offset-4 hover:underline"
        >
          Clear all
        </button>
      </div>
      <div className="border-border flex items-center justify-between border-b py-4">
        <label htmlFor="f-stock" className="text-sm font-medium">
          In stock only
        </label>
        <Switch
          id="f-stock"
          checked={params.get("stock") === "in"}
          onCheckedChange={(v) => update((p) => (v ? p.set("stock", "in") : p.delete("stock")))}
        />
      </div>
      <Accordion type="multiple" defaultValue={["price", "category", "brand", "rating"]}>
        <AccordionItem value="price">
          <AccordionTrigger className="text-sm">Price</AccordionTrigger>
          <AccordionContent className="text-foreground px-1">
            <Slider
              min={lo}
              max={hi}
              step={step}
              value={range}
              onValueChange={(v) => setRange([v[0]!, v[1]!])}
              onValueCommit={(v) =>
                update((p) => {
                  if (v[0]! > lo) p.set("min", String(v[0]));
                  else p.delete("min");
                  if (v[1]! < hi) p.set("max", String(v[1]));
                  else p.delete("max");
                })
              }
            />
            <p className="text-muted-foreground mt-2 flex justify-between text-xs tabular-nums">
              <span>{formatINR(range[0])}</span>
              <span>{formatINR(range[1])}</span>
            </p>
          </AccordionContent>
        </AccordionItem>
        {showCategories && facets.categories.length > 1 ? (
          <AccordionItem value="category">
            <AccordionTrigger className="text-sm">Category</AccordionTrigger>
            <AccordionContent className="text-foreground">
              {checkList(
                "category",
                facets.categories.map((c) => ({ value: c.slug, label: c.name, count: c.count })),
              )}
            </AccordionContent>
          </AccordionItem>
        ) : null}
        <AccordionItem value="brand">
          <AccordionTrigger className="text-sm">Brand</AccordionTrigger>
          <AccordionContent className="text-foreground">
            {checkList(
              "brand",
              facets.brands.map((b) => ({ value: b.slug, label: b.name, count: b.count })),
            )}
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="rating">
          <AccordionTrigger className="text-sm">Customer rating</AccordionTrigger>
          <AccordionContent className="text-foreground">
            <div className="flex flex-wrap gap-2" role="group" aria-label="Minimum rating">
              {[4, 3].map((r) => (
                <button
                  key={r}
                  type="button"
                  aria-pressed={rating === r}
                  onClick={() =>
                    update((p) => (rating === r ? p.delete("rating") : p.set("rating", String(r))))
                  }
                  className={cn(
                    "inline-flex h-9 items-center gap-1 rounded-full border px-3 text-sm transition-colors",
                    rating === r
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border hover:border-foreground",
                  )}
                >
                  {r}
                  <StarIcon
                    className="size-3.5"
                    fill="currentColor"
                    strokeWidth={0}
                    aria-hidden="true"
                  />{" "}
                  & up
                </button>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="colour">
          <AccordionTrigger className="text-sm">Colour</AccordionTrigger>
          <AccordionContent className="text-foreground">
            {checkList(
              "colour",
              facets.colours.map((c) => ({ value: c.name, label: c.name, swatch: c.hex })),
            )}
          </AccordionContent>
        </AccordionItem>
        {facets.materials.length ? (
          <AccordionItem value="material">
            <AccordionTrigger className="text-sm">Material</AccordionTrigger>
            <AccordionContent className="text-foreground">
              {checkList(
                "material",
                facets.materials.map((m) => ({ value: m, label: m })),
              )}
            </AccordionContent>
          </AccordionItem>
        ) : null}
      </Accordion>
    </div>
  );
}

export function MobileFilters({
  facets,
  showCategories,
  total,
}: {
  facets: Facets;
  showCategories: boolean;
  total: number;
}) {
  const [open, setOpen] = useState(false);
  const { params } = useListing();
  const active = [
    "category",
    "brand",
    "colour",
    "material",
    "min",
    "max",
    "rating",
    "stock",
  ].filter((k) => params.has(k)).length;
  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setOpen(true)} className="lg:hidden">
        <SlidersHorizontalIcon aria-hidden="true" />
        Filters{active ? ` (${active})` : ""}
      </Button>
      <Drawer open={open} onOpenChange={setOpen} direction="bottom">
        <DrawerContent direction="bottom">
          <div className="flex items-center justify-between px-5 pt-2 pb-3">
            <DrawerTitle className="font-sans text-lg font-semibold">Filter products</DrawerTitle>
            <DrawerDescription className="sr-only">
              Results update as you choose filters.
            </DrawerDescription>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="hover:bg-muted inline-flex size-9 items-center justify-center rounded-full"
              aria-label="Close filters"
            >
              <XIcon className="size-5" />
            </button>
          </div>
          <div className="overflow-y-auto px-5 pb-4" data-vaul-no-drag>
            <FilterPanel facets={facets} showCategories={showCategories} />
          </div>
          <div className="border-border border-t p-4">
            <Button className="w-full" onClick={() => setOpen(false)}>
              Show {total} result{total === 1 ? "" : "s"}
            </Button>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
}

const SORTS = [
  ["popular", "Most popular"],
  ["newest", "Newest"],
  ["price-asc", "Price: low to high"],
  ["price-desc", "Price: high to low"],
  ["rating", "Top rated"],
] as const;

export function SortSelect() {
  const { params, update } = useListing();
  return (
    <div className="flex items-center gap-2">
      <label htmlFor="sort" className="text-muted-foreground sr-only text-sm sm:not-sr-only">
        Sort by
      </label>
      <NativeSelect
        id="sort"
        value={params.get("sort") ?? (params.get("q") ? "" : "popular")}
        onChange={(e) =>
          update((p) => (e.target.value ? p.set("sort", e.target.value) : p.delete("sort")))
        }
        className="h-9 w-auto rounded-full text-sm"
      >
        {params.get("q") ? <option value="">Best match</option> : null}
        {SORTS.map(([v, l]) => (
          <option key={v} value={v}>
            {l}
          </option>
        ))}
      </NativeSelect>
    </div>
  );
}

export function ActiveFilterChips({ facets }: { facets: Facets }) {
  const { params, toggleListValue, update, clearAll } = useListing();
  const chips: { label: string; onRemove: () => void }[] = [];
  for (const key of ["category", "brand", "colour", "material"] as const) {
    for (const v of listOf(params, key)) {
      const label =
        key === "category"
          ? facets.categories.find((c) => c.slug === v)?.name
          : key === "brand"
            ? facets.brands.find((b) => b.slug === v)?.name
            : v;
      chips.push({ label: label ?? v, onRemove: () => toggleListValue(key, v) });
    }
  }
  if (params.has("min") || params.has("max")) {
    chips.push({
      label: `${formatINR(Number(params.get("min") ?? facets.priceRange[0]))} – ${formatINR(Number(params.get("max") ?? facets.priceRange[1]))}`,
      onRemove: () => update((p) => (p.delete("min"), p.delete("max"))),
    });
  }
  if (params.has("rating"))
    chips.push({
      label: `${params.get("rating")}★ & up`,
      onRemove: () => update((p) => p.delete("rating")),
    });
  if (params.get("stock") === "in")
    chips.push({ label: "In stock", onRemove: () => update((p) => p.delete("stock")) });
  if (params.has("q"))
    chips.push({ label: `“${params.get("q")}”`, onRemove: () => update((p) => p.delete("q")) });
  if (params.has("tag"))
    chips.push({
      label: params.get("tag")!.replace(/^\w/, (c) => c.toUpperCase()),
      onRemove: () => update((p) => p.delete("tag")),
    });
  if (!chips.length) return null;

  return (
    <div className="mb-6 flex flex-wrap items-center gap-2">
      {chips.map((c) => (
        <button
          key={c.label}
          type="button"
          onClick={c.onRemove}
          className="bg-muted hover:bg-border inline-flex h-8 items-center gap-1.5 rounded-full pr-2 pl-3 text-xs font-medium transition-colors"
          aria-label={`Remove filter ${c.label}`}
        >
          {c.label}
          <XIcon className="size-3.5" aria-hidden="true" />
        </button>
      ))}
      {chips.length > 1 ? (
        <button
          type="button"
          onClick={clearAll}
          className="text-xs font-medium underline underline-offset-4"
        >
          Clear filters
        </button>
      ) : null}
    </div>
  );
}
