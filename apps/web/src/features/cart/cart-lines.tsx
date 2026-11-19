"use client";

import { getKindImage } from "@teziko/data/images";
import { Trash2Icon } from "lucide-react";
import { AnimatePresence, m } from "motion/react";
import Link from "next/link";
import type { PriceBreakdown } from "@teziko/types";
import { ProductImage } from "@/components/product-image";
import { formatINR } from "@/lib/format";
import { useCart, type CartItem } from "../shopper/stores";
import { QuantityStepper } from "./quantity-stepper";

/** Cart lines with layout animation on quantity change, add and remove. */
export function CartLines({
  items,
  quote,
  compact,
  onNavigate,
}: {
  items: CartItem[];
  quote: PriceBreakdown | null;
  compact?: boolean;
  onNavigate?: () => void;
}) {
  const setQuantity = useCart((s) => s.setQuantity);
  const remove = useCart((s) => s.remove);

  return (
    <ul className="divide-border divide-y">
      <AnimatePresence initial={false}>
        {items.map((item) => {
          const priced = quote?.lines.find((l) => l.sku === item.sku);
          const unit = priced?.unitPrice ?? item.unitPrice;
          return (
            <m.li
              key={item.sku}
              layout
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24, transition: { duration: 0.2 } }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="flex gap-4 py-4"
            >
              <Link
                href={`/product/${item.slug}`}
                onClick={onNavigate}
                className="bg-muted relative size-20 shrink-0 overflow-hidden rounded-lg sm:size-24"
                tabIndex={-1}
                aria-hidden="true"
              >
                <ProductImage
                  image={getKindImage(item.kind, item.hex, 0, "")}
                  sizes="96px"
                  alt=""
                />
              </Link>
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <div className="flex items-start justify-between gap-3">
                  <Link
                    href={`/product/${item.slug}`}
                    onClick={onNavigate}
                    className="line-clamp-2 text-sm leading-snug font-medium hover:underline"
                  >
                    {item.name}
                  </Link>
                  <span className="shrink-0 text-sm font-semibold tabular-nums">
                    {formatINR(unit * item.quantity)}
                  </span>
                </div>
                <p className="text-muted-foreground text-xs">{item.variantLabel}</p>
                {!compact ? (
                  <p className="text-muted-foreground text-xs">{formatINR(unit)} each</p>
                ) : null}
                {priced && !priced.available ? (
                  <p className="text-error text-xs font-medium">
                    Not enough stock for this quantity
                  </p>
                ) : null}
                <div className="mt-auto flex items-center justify-between pt-1.5">
                  <QuantityStepper
                    value={item.quantity}
                    onChange={(n) => setQuantity(item.sku, n)}
                    label={item.name}
                  />
                  <button
                    type="button"
                    onClick={() => remove(item.sku)}
                    className="text-muted-foreground hover:bg-muted hover:text-foreground inline-flex h-9 items-center gap-1.5 rounded-full px-2.5 text-xs font-medium"
                    aria-label={`Remove ${item.name} from cart`}
                  >
                    <Trash2Icon className="size-3.5" aria-hidden="true" />
                    Remove
                  </button>
                </div>
              </div>
            </m.li>
          );
        })}
      </AnimatePresence>
    </ul>
  );
}
