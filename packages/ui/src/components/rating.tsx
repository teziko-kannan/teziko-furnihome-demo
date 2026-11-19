import { StarIcon } from "lucide-react";
import { cn } from "../lib/utils";

interface RatingProps {
  value: number;
  count?: number;
  size?: "sm" | "md";
  className?: string;
}

/** Read-only star rating with an accessible text equivalent. */
export function Rating({ value, count, size = "sm", className }: RatingProps) {
  const px = size === "sm" ? "size-3.5" : "size-4.5";
  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <div className="flex items-center gap-0.5" aria-hidden="true">
        {Array.from({ length: 5 }, (_, i) => {
          const fill = Math.max(0, Math.min(1, value - i));
          return (
            <span key={i} className={cn("relative inline-block", px)}>
              <StarIcon
                className={cn("text-foreground/20 absolute inset-0", px)}
                fill="currentColor"
                strokeWidth={0}
              />
              <span
                className="absolute inset-0 overflow-hidden"
                style={{ width: `${fill * 100}%` }}
              >
                <StarIcon
                  className={cn("text-foreground", px)}
                  fill="currentColor"
                  strokeWidth={0}
                />
              </span>
            </span>
          );
        })}
      </div>
      <span className="sr-only">Rated {value.toFixed(1)} out of 5</span>
      {count !== undefined ? (
        <span className="text-muted-foreground text-xs" aria-label={`${count} reviews`}>
          {value.toFixed(1)} ({count})
        </span>
      ) : null}
    </div>
  );
}
