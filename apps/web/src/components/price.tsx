import { cn, discountPercent, formatINR } from "@/lib/format";

interface PriceProps {
  price: number;
  mrp: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function Price({ price, mrp, size = "md", className }: PriceProps) {
  const off = discountPercent(price, mrp);
  return (
    <div className={cn("flex flex-wrap items-baseline gap-x-2 gap-y-0.5", className)}>
      <span
        className={cn(
          "text-foreground font-semibold tracking-tight tabular-nums",
          size === "sm" && "text-[15px]",
          size === "md" && "text-base",
          size === "lg" && "text-2xl sm:text-3xl",
        )}
      >
        {formatINR(price)}
      </span>
      {off > 0 ? (
        <>
          <span
            className={cn(
              "text-muted-foreground tabular-nums line-through",
              size === "lg" ? "text-base" : "text-xs",
            )}
          >
            <span className="sr-only">MRP </span>
            {formatINR(mrp)}
          </span>
          <span
            className={cn("text-success font-semibold", size === "lg" ? "text-base" : "text-xs")}
          >
            {off}% off
          </span>
        </>
      ) : null}
    </div>
  );
}
