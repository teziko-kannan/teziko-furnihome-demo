import { listProducts, parseFilters, type ListingScope } from "@teziko/data";
import { Breadcrumb, type Crumb } from "@teziko/ui/components/breadcrumb";
import { Button } from "@teziko/ui/components/button";
import { StateBlock } from "@teziko/ui/components/states";
import { ChevronLeftIcon, ChevronRightIcon, SearchXIcon } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/format";
import { toCard } from "./card-data";
import { ActiveFilterChips, FilterPanel, MobileFilters, SortSelect } from "./filters";
import { ListingProvider, ListingResults } from "./listing-state";
import { ProductCard } from "./product-card";

type SP = Record<string, string | string[] | undefined>;

interface ListingPageProps {
  title: string;
  description?: string;
  crumbs: Crumb[];
  scope: ListingScope;
  searchParams: SP;
  basePath: string;
  showCategories?: boolean;
  intro?: ReactNode;
}

export function toSearchString(sp: SP) {
  const p = new URLSearchParams();
  for (const [k, v] of Object.entries(sp)) {
    if (typeof v === "string") p.set(k, v);
    else if (Array.isArray(v) && v[0]) p.set(k, v[0]);
  }
  return p.toString();
}

export function ListingPage({
  title,
  description,
  crumbs,
  scope,
  searchParams,
  basePath,
  showCategories = true,
  intro,
}: ListingPageProps) {
  const filters = parseFilters(searchParams);
  const tag = typeof searchParams.tag === "string" ? searchParams.tag : undefined;
  const validTag =
    tag && ["new", "bestseller", "trending", "sale", "seasonal", "featured"].includes(tag)
      ? (tag as ListingScope["tag"])
      : undefined;
  const result = listProducts({ ...scope, tag: validTag ?? scope.tag }, filters);
  const search = toSearchString(searchParams);

  const pageHref = (page: number) => {
    const p = new URLSearchParams(search);
    if (page > 1) p.set("page", String(page));
    else p.delete("page");
    const qs = p.toString();
    return qs ? `${basePath}?${qs}` : basePath;
  };

  return (
    <ListingProvider search={search}>
      <div className="container-page pt-6 pb-20 sm:pt-8">
        <Breadcrumb
          items={crumbs}
          renderLink={(c, children) => <Link href={c.href}>{children}</Link>}
        />
        <header className="mt-5 mb-8 max-w-3xl">
          <h1 className="text-3xl sm:text-[2.6rem] sm:leading-tight">
            {filters.q ? `Results for “${filters.q}”` : title}
          </h1>
          {description && !filters.q ? (
            <p className="text-muted-foreground mt-3 text-[15px] leading-relaxed">{description}</p>
          ) : null}
        </header>
        {intro}
        <div className="grid gap-10 lg:grid-cols-[250px_1fr]">
          <aside className="hidden lg:block" aria-label="Product filters">
            <div className="sticky top-32">
              <FilterPanel facets={result.facets} showCategories={showCategories} />
            </div>
          </aside>
          <section aria-labelledby="results-heading" className="min-w-0">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <h2
                id="results-heading"
                className="text-muted-foreground font-sans text-sm font-normal tracking-normal"
                aria-live="polite"
              >
                {result.total} product{result.total === 1 ? "" : "s"}
              </h2>
              <div className="flex items-center gap-2">
                <MobileFilters
                  facets={result.facets}
                  showCategories={showCategories}
                  total={result.total}
                />
                <SortSelect />
              </div>
            </div>
            <ActiveFilterChips facets={result.facets} />
            <ListingResults>
              {result.items.length === 0 ? (
                <StateBlock
                  icon={SearchXIcon}
                  title="No products match these filters"
                  description="Try removing a filter or widening the price range."
                  action={
                    <Button asChild variant="outline">
                      <Link href={basePath}>Reset filters</Link>
                    </Button>
                  }
                />
              ) : (
                <ul className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-3">
                  {result.items.map((p, i) => (
                    <li key={p.id}>
                      <ProductCard
                        product={toCard(p)}
                        priority={i < 3}
                        sizes="(min-width: 1280px) 25vw, (min-width: 768px) 30vw, 46vw"
                      />
                    </li>
                  ))}
                </ul>
              )}
            </ListingResults>
            {result.pageCount > 1 ? (
              <nav
                aria-label="Pagination"
                className="mt-14 flex items-center justify-center gap-1.5"
              >
                <PageLink
                  href={pageHref(result.page - 1)}
                  disabled={result.page <= 1}
                  label="Previous page"
                >
                  <ChevronLeftIcon className="size-4" />
                </PageLink>
                {Array.from({ length: result.pageCount }, (_, i) => i + 1).map((n) => (
                  <PageLink
                    key={n}
                    href={pageHref(n)}
                    current={n === result.page}
                    label={`Page ${n}`}
                  >
                    {n}
                  </PageLink>
                ))}
                <PageLink
                  href={pageHref(result.page + 1)}
                  disabled={result.page >= result.pageCount}
                  label="Next page"
                >
                  <ChevronRightIcon className="size-4" />
                </PageLink>
              </nav>
            ) : null}
          </section>
        </div>
      </div>
    </ListingProvider>
  );
}

function PageLink({
  href,
  children,
  current,
  disabled,
  label,
}: {
  href: string;
  children: ReactNode;
  current?: boolean;
  disabled?: boolean;
  label: string;
}) {
  const cls = cn(
    "inline-flex size-10 items-center justify-center rounded-full text-sm font-medium tabular-nums transition-colors",
    current ? "bg-primary text-primary-foreground" : "hover:bg-muted",
    disabled && "pointer-events-none opacity-35",
  );
  if (disabled)
    return (
      <span className={cls} aria-hidden="true">
        {children}
      </span>
    );
  return (
    <Link
      href={href}
      className={cls}
      aria-label={label}
      aria-current={current ? "page" : undefined}
    >
      {children}
    </Link>
  );
}
