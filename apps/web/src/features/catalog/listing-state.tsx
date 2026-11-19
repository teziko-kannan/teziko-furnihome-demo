"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useTransition,
  type ReactNode,
} from "react";
import { cn } from "@/lib/format";

interface ListingCtx {
  params: URLSearchParams;
  pending: boolean;
  /** Applies a mutation to the current params and navigates (resets page unless told otherwise). */
  update: (mutate: (p: URLSearchParams) => void, opts?: { keepPage?: boolean }) => void;
  toggleListValue: (key: string, value: string) => void;
  clearAll: () => void;
}

const Ctx = createContext<ListingCtx | null>(null);

export function useListing() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useListing must be used within ListingProvider");
  return c;
}

/** URL-synced listing state. The server renders results from the same params. */
export function ListingProvider({ search, children }: { search: string; children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [pending, startTransition] = useTransition();
  const params = useMemo(() => new URLSearchParams(search), [search]);

  const update = useCallback<ListingCtx["update"]>(
    (mutate, opts) => {
      const next = new URLSearchParams(params);
      mutate(next);
      if (!opts?.keepPage) next.delete("page");
      const qs = next.toString();
      startTransition(() => router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false }));
    },
    [params, pathname, router],
  );

  const toggleListValue = useCallback(
    (key: string, value: string) =>
      update((p) => {
        const list = (p.get(key) ?? "").split(",").filter(Boolean);
        const next = list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
        if (next.length) p.set(key, next.join(","));
        else p.delete(key);
      }),
    [update],
  );

  const clearAll = useCallback(
    () =>
      update((p) => {
        for (const k of [
          "category",
          "brand",
          "colour",
          "material",
          "min",
          "max",
          "rating",
          "stock",
        ])
          p.delete(k);
      }),
    [update],
  );

  const value = useMemo(
    () => ({ params, pending, update, toggleListValue, clearAll }),
    [params, pending, update, toggleListValue, clearAll],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

/** Dims results while a filter navigation is in flight. */
export function ListingResults({ children }: { children: ReactNode }) {
  const { pending } = useListing();
  return (
    <div
      aria-busy={pending}
      className={cn("transition-opacity duration-200", pending && "pointer-events-none opacity-50")}
    >
      {children}
    </div>
  );
}
