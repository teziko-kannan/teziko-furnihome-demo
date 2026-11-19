import { Skeleton } from "@teziko/ui/components/skeleton";

export default function Loading() {
  return (
    <div className="container-page pt-6 pb-16" aria-busy="true" aria-label="Loading product">
      <Skeleton className="mb-6 h-4 w-64" />
      <div className="grid gap-8 lg:grid-cols-[1.15fr_1fr] lg:gap-14">
        <Skeleton className="aspect-square w-full rounded-2xl" />
        <div className="space-y-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-4/5" />
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-12 w-full rounded-full" />
        </div>
      </div>
    </div>
  );
}
