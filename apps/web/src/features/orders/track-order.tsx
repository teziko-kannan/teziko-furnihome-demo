"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@teziko/ui/components/button";
import { Input } from "@teziko/ui/components/input";
import { describedBy, Field } from "@teziko/ui/components/label";
import { StateBlock } from "@teziko/ui/components/states";
import { trackOrderSchema, type TrackOrderInput } from "@teziko/validators";
import { PackageXIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { OrderDetails } from "./order-details";
import { useOrder } from "./use-order";

export function TrackOrder({ initial }: { initial?: Partial<TrackOrderInput> }) {
  const [query, setQuery] = useState<TrackOrderInput | null>(
    initial?.orderNumber && initial.email ? (initial as TrackOrderInput) : null,
  );
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TrackOrderInput>({
    resolver: zodResolver(trackOrderSchema),
    defaultValues: { orderNumber: initial?.orderNumber ?? "", email: initial?.email ?? "" },
  });

  return (
    <div className="space-y-10">
      <form
        onSubmit={handleSubmit(setQuery)}
        noValidate
        className="grid max-w-2xl gap-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end"
      >
        <Field id="t-number" label="Order number" error={errors.orderNumber?.message} required>
          <Input
            id="t-number"
            placeholder="TZ-261117-AB12"
            className="uppercase"
            {...register("orderNumber")}
            aria-invalid={Boolean(errors.orderNumber)}
            aria-describedby={describedBy("t-number", errors.orderNumber?.message)}
          />
        </Field>
        <Field id="t-email" label="Email" error={errors.email?.message} required>
          <Input
            id="t-email"
            type="email"
            autoComplete="email"
            {...register("email")}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={describedBy("t-email", errors.email?.message)}
          />
        </Field>
        <Button type="submit" className="sm:mb-px">
          Track
        </Button>
      </form>
      {query ? <Result key={`${query.orderNumber}-${query.email}`} query={query} /> : null}
    </div>
  );
}

function Result({ query }: { query: TrackOrderInput }) {
  const { order, status, replace } = useOrder(query.orderNumber, query.email);
  if (status === "loading") return <div className="skeleton h-64 rounded-2xl" aria-busy="true" />;
  if (!order) {
    return (
      <StateBlock
        icon={PackageXIcon}
        title="No order found"
        description="Check the order number and email. Demo orders can only be tracked in the browser where they were placed (local mode)."
      />
    );
  }
  return (
    <div aria-live="polite">
      <h2 className="mb-5 text-2xl">Order {order.number}</h2>
      <OrderDetails order={order} onReplace={replace} />
    </div>
  );
}
