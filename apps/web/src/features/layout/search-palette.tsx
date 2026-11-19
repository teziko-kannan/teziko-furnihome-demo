"use client";

import { getKindImage } from "@teziko/data/images";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@teziko/ui/components/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@teziko/ui/components/dialog";
import type { ProductKind } from "@teziko/types";
import { ArrowRightIcon, LayoutGridIcon, SearchIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { formatINR } from "@/lib/format";
import { useUi } from "../shopper/stores";
import type { NavDepartment, SearchEntry } from "./nav-data";

export function SearchPalette({ nav }: { nav: NavDepartment[] }) {
  const open = useUi((s) => s.searchOpen);
  const setOpen = useUi((s) => s.setSearchOpen);
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState<SearchEntry[] | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let alive = true;
    fetch("/api/search-index")
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("failed"))))
      .then((j: { index: SearchEntry[] }) => alive && setIndex(j.index))
      .catch(() => alive && setFailed(true));
    return () => {
      alive = false;
    };
  }, []);

  function go(href: string) {
    setOpen(false);
    setQuery("");
    router.push(href);
  }

  const categories = nav.flatMap((d) => d.columns.map((c) => ({ ...c, dep: d.name })));

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        showClose={false}
        className="top-[12vh] max-w-2xl translate-y-0 gap-0 overflow-hidden p-0"
      >
        <DialogTitle className="sr-only">Search the store</DialogTitle>
        <DialogDescription className="sr-only">
          Type to search products and categories. Use arrow keys to move and Enter to open.
        </DialogDescription>
        <Command loop>
          <CommandInput
            value={query}
            onValueChange={setQuery}
            placeholder="Search products, brands, categories…"
            aria-label="Search"
          />
          <CommandList>
            <CommandEmpty>No matches for “{query}”. Try “sofa”, “AC” or “rug”.</CommandEmpty>
            {query.trim() ? (
              <CommandGroup heading="Search">
                <CommandItem
                  value={`search-all ${query}`}
                  onSelect={() => go(`/shop?q=${encodeURIComponent(query.trim())}`)}
                >
                  <SearchIcon className="text-muted-foreground size-4" aria-hidden="true" />
                  <span>
                    See all results for <strong>“{query.trim()}”</strong>
                  </span>
                  <ArrowRightIcon
                    className="text-muted-foreground ml-auto size-4"
                    aria-hidden="true"
                  />
                </CommandItem>
              </CommandGroup>
            ) : null}
            {index === null ? (
              <p className="text-muted-foreground px-3 py-4 text-sm" role="status">
                {failed
                  ? "Couldn't load products. Categories are still searchable."
                  : "Loading products…"}
              </p>
            ) : null}
            <CommandGroup heading="Products">
              {(index ?? []).map((p) => (
                <CommandItem
                  key={p.id}
                  value={`${p.name} ${p.id}`}
                  keywords={[p.brand, p.category, p.keywords]}
                  onSelect={() => go(`/product/${p.slug}`)}
                >
                  <span className="bg-muted relative size-10 shrink-0 overflow-hidden rounded-md">
                    <Image
                      src={getKindImage(p.kind as ProductKind, p.hex).src}
                      alt=""
                      width={40}
                      height={40}
                      className="size-10 object-cover"
                    />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-medium">{p.name}</span>
                    <span className="text-muted-foreground block truncate text-xs">
                      {p.category}
                    </span>
                  </span>
                  <span className="text-[13px] font-semibold tabular-nums">
                    {formatINR(p.price)}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandGroup heading="Categories">
              {categories.map((c) => (
                <CommandItem
                  key={c.slug}
                  value={`category ${c.name}`}
                  keywords={[c.dep]}
                  onSelect={() => go(c.href)}
                >
                  <LayoutGridIcon className="text-muted-foreground size-4" aria-hidden="true" />
                  {c.name}
                  <span className="text-muted-foreground ml-auto text-xs">{c.dep}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
