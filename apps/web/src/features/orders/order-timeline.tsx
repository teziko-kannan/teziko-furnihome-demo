"use client";

import { DEMO_TIMELINE, ORDER_STATUS_LABEL } from "@teziko/data/orders";
import type { Order } from "@teziko/types";
import { CheckIcon, XIcon } from "lucide-react";
import { m } from "motion/react";
import { cn, formatDateTime } from "@/lib/format";

/** Vertical tracking timeline. Future stages are shown greyed out. */
export function OrderTimeline({ order }: { order: Order }) {
  if (order.status === "cancelled" || order.status === "payment-failed") {
    return (
      <ol className="space-y-4">
        {order.events.map((e) => (
          <li key={`${e.status}-${e.at}`} className="flex gap-3">
            <span
              className={cn(
                "inline-flex size-7 shrink-0 items-center justify-center rounded-full",
                e.status === "cancelled" || e.status === "payment-failed"
                  ? "bg-error/10 text-error"
                  : "bg-foreground text-background",
              )}
            >
              {e.status === "cancelled" || e.status === "payment-failed" ? (
                <XIcon className="size-4" aria-hidden="true" />
              ) : (
                <CheckIcon className="size-4" aria-hidden="true" />
              )}
            </span>
            <div>
              <p className="text-sm font-semibold">{ORDER_STATUS_LABEL[e.status]}</p>
              <p className="text-muted-foreground text-xs">
                {e.note} · {formatDateTime(e.at)}
              </p>
            </div>
          </li>
        ))}
      </ol>
    );
  }

  const reachedIndex = DEMO_TIMELINE.findIndex((s) => s.status === order.status);
  return (
    <ol className="relative">
      {DEMO_TIMELINE.map((stage, i) => {
        const event = order.events.find((e) => e.status === stage.status);
        const done = i <= reachedIndex;
        const last = i === DEMO_TIMELINE.length - 1;
        return (
          <li key={stage.status} className="relative flex gap-4 pb-6 last:pb-0">
            {!last ? (
              <span
                aria-hidden="true"
                className="bg-border absolute top-7 bottom-0 left-[13px] w-0.5"
              >
                <m.span
                  className="bg-foreground block h-full w-full origin-top"
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: i < reachedIndex ? 1 : 0 }}
                  transition={{ duration: 0.5, delay: i * 0.12 }}
                />
              </span>
            ) : null}
            <m.span
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.12 }}
              className={cn(
                "relative z-10 inline-flex size-7 shrink-0 items-center justify-center rounded-full border-2",
                done
                  ? "border-foreground bg-foreground text-background"
                  : "border-border bg-background",
              )}
            >
              {done ? <CheckIcon className="size-3.5" aria-hidden="true" /> : null}
            </m.span>
            <div className={cn(!done && "text-muted-foreground")}>
              <p className="text-sm font-semibold">
                {ORDER_STATUS_LABEL[stage.status]}
                {i === reachedIndex ? <span className="sr-only"> (current status)</span> : null}
              </p>
              <p className="text-muted-foreground text-xs">
                {event ? `${event.note} · ${formatDateTime(event.at)}` : "Pending"}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
