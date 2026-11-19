"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { INDIAN_STATES } from "@teziko/data/states";
import { Button } from "@teziko/ui/components/button";
import { Input, NativeSelect } from "@teziko/ui/components/input";
import { describedBy, Field } from "@teziko/ui/components/label";
import { addressSchema, emailSchema } from "@teziko/validators";
import { useForm } from "react-hook-form";
import type { z } from "zod";

export const checkoutAddressSchema = addressSchema
  .omit({ label: true })
  .extend({ email: emailSchema });
export type CheckoutAddress = z.infer<typeof checkoutAddressSchema>;

export function AddressForm({
  defaultValues,
  onSubmit,
  submitLabel = "Continue to payment",
}: {
  defaultValues: Partial<CheckoutAddress>;
  onSubmit: (v: CheckoutAddress) => void;
  submitLabel?: string;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutAddress>({
    resolver: zodResolver(checkoutAddressSchema),
    defaultValues: {
      email: "",
      fullName: "",
      phone: "",
      line1: "",
      line2: "",
      city: "",
      state: "",
      pincode: "",
      ...defaultValues,
    },
  });

  const field = (
    id: keyof CheckoutAddress,
    label: string,
    props: React.ComponentProps<typeof Input> = {},
    required = true,
  ) => (
    <Field id={`co-${id}`} label={label} error={errors[id]?.message} required={required}>
      <Input
        id={`co-${id}`}
        {...register(id)}
        aria-invalid={Boolean(errors[id])}
        aria-describedby={describedBy(`co-${id}`, errors[id]?.message)}
        {...props}
      />
    </Field>
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="grid gap-5">
      <fieldset className="grid gap-5">
        <legend className="mb-1 font-sans text-lg font-semibold">Contact</legend>
        {field("email", "Email", { type: "email", autoComplete: "email" })}
      </fieldset>
      <fieldset className="grid gap-5 sm:grid-cols-2">
        <legend className="mb-1 font-sans text-lg font-semibold">Delivery address</legend>
        <div className="sm:col-span-2">
          {field("fullName", "Full name", { autoComplete: "name" })}
        </div>
        {field("phone", "Mobile number", {
          type: "tel",
          inputMode: "numeric",
          autoComplete: "tel-national",
          maxLength: 10,
        })}
        {field("pincode", "PIN code", {
          inputMode: "numeric",
          autoComplete: "postal-code",
          maxLength: 6,
        })}
        <div className="sm:col-span-2">
          {field("line1", "House no., building, street", { autoComplete: "address-line1" })}
        </div>
        <div className="sm:col-span-2">
          {field("line2", "Area, landmark (optional)", { autoComplete: "address-line2" }, false)}
        </div>
        {field("city", "City", { autoComplete: "address-level2" })}
        <Field id="co-state" label="State" error={errors.state?.message} required>
          <NativeSelect
            id="co-state"
            {...register("state")}
            autoComplete="address-level1"
            aria-invalid={Boolean(errors.state)}
            aria-describedby={describedBy("co-state", errors.state?.message)}
          >
            <option value="">Select state</option>
            {INDIAN_STATES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </NativeSelect>
        </Field>
      </fieldset>
      <Button type="submit" size="lg" className="mt-2 sm:justify-self-start">
        {submitLabel}
      </Button>
    </form>
  );
}
