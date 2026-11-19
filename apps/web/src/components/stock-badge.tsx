import type { StockStatus } from "@teziko/types";
import { cn } from "@/lib/format";

const map: Record<StockStatus, { label: string; dot: string; text: string }> = {
  "in-stock": { label: "In stock", dot: "bg-success", text: "text-success" },
  "low-stock": { label: "Only a few left", dot: "bg-warning", text: "text-warning-strong" },
  "out-of-stock": { label: "Out of stock", dot: "bg-error", text: "text-error" },
};

export function StockBadge({ status, className }: { status: StockStatus; className?: string }) {
  const m = map[status];
  return (
    <span className={cn("inline-flex items-center gap-1.5 text-xs font-medium", m.text, className)}>
      <span aria-hidden="true" className={cn("size-1.5 rounded-full", m.dot)} />
      {m.label}
    </span>
  );
}
