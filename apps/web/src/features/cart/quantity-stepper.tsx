"use client";

import { MinusIcon, PlusIcon } from "lucide-react";
import { cn } from "@/lib/format";
import { MAX_QTY } from "../shopper/stores";

export function QuantityStepper({
  value,
  onChange,
  label,
  className,
  max = MAX_QTY,
}: {
  value: number;
  onChange: (n: number) => void;
  label: string;
  className?: string;
  max?: number;
}) {
  const btn =
    "inline-flex size-9 items-center justify-center rounded-full transition-colors hover:bg-muted disabled:opacity-35";
  return (
    <div
      className={cn("border-border inline-flex items-center rounded-full border", className)}
      role="group"
      aria-label={`Quantity for ${label}`}
    >
      <button
        type="button"
        className={btn}
        onClick={() => onChange(value - 1)}
        disabled={value <= 1}
        aria-label="Decrease quantity"
      >
        <MinusIcon className="size-3.5" />
      </button>
      <span className="w-8 text-center text-sm font-semibold tabular-nums" aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        className={btn}
        onClick={() => onChange(value + 1)}
        disabled={value >= max}
        aria-label="Increase quantity"
      >
        <PlusIcon className="size-3.5" />
      </button>
    </div>
  );
}
