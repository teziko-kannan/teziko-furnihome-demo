"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@teziko/ui/components/button";
import { Switch } from "@teziko/ui/components/form-controls";
import { Input } from "@teziko/ui/components/input";
import { describedBy, Field } from "@teziko/ui/components/label";
import { toast } from "@teziko/ui/components/toaster";
import { useHydrated } from "@teziko/ui/hooks/use-hydrated";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { useOverrides } from "../overrides/store";
import { NO_JS_FORM } from "@/lib/no-js-form";

const schema = z.object({
  storeName: z.string().trim().min(2).max(60),
  supportEmail: z.email("Enter a valid email"),
  freeShippingThreshold: z.number().int().min(0).max(100000),
  codEnabled: z.boolean(),
  maintenance: z.boolean(),
});
type Values = z.infer<typeof schema>;

const DEFAULTS: Values = {
  storeName: "Home Vibe",
  supportEmail: "support@homevibe-demo.example",
  freeShippingThreshold: 4999,
  codEnabled: true,
  maintenance: false,
};

export function SettingsForm() {
  const hydrated = useHydrated();
  const saved = useOverrides((s) => s.settings);
  const save = useOverrides((s) => s.saveSettings);
  const resetAll = useOverrides((s) => s.resetAll);
  const values =
    hydrated && saved
      ? {
          storeName: saved.storeName,
          supportEmail: saved.supportEmail,
          freeShippingThreshold: saved.freeShippingThreshold,
          codEnabled: saved.codEnabled,
          maintenance: saved.maintenance,
        }
      : DEFAULTS;
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<Values>({ resolver: zodResolver(schema), values });

  return (
    <div className="grid max-w-2xl gap-8">
      <form
        {...NO_JS_FORM}
        onSubmit={handleSubmit((v) => {
          save({ ...v, at: new Date().toISOString() });
          toast.success("Settings saved", {
            description: "Demo: stored in this browser, the storefront is not changed.",
          });
        })}
        noValidate
        className="border-border bg-background grid gap-5 rounded-2xl border p-6"
      >
        <Field id="s-name" label="Store name" error={errors.storeName?.message} required>
          <Input
            id="s-name"
            {...register("storeName")}
            aria-invalid={Boolean(errors.storeName)}
            aria-describedby={describedBy("s-name", errors.storeName?.message)}
          />
        </Field>
        <Field id="s-email" label="Support email" error={errors.supportEmail?.message} required>
          <Input
            id="s-email"
            type="email"
            {...register("supportEmail")}
            aria-invalid={Boolean(errors.supportEmail)}
            aria-describedby={describedBy("s-email", errors.supportEmail?.message)}
          />
        </Field>
        <Field
          id="s-ship"
          label="Free shipping threshold (₹)"
          error={errors.freeShippingThreshold?.message}
          required
        >
          <Input
            id="s-ship"
            type="number"
            {...register("freeShippingThreshold", { valueAsNumber: true })}
            aria-invalid={Boolean(errors.freeShippingThreshold)}
            aria-describedby={describedBy("s-ship", errors.freeShippingThreshold?.message)}
          />
        </Field>
        {(["codEnabled", "maintenance"] as const).map((name) => (
          <Controller
            key={name}
            control={control}
            name={name}
            render={({ field }) => (
              <label className="flex items-center justify-between gap-4 text-sm font-medium">
                {name === "codEnabled" ? "Cash on delivery enabled" : "Maintenance mode banner"}
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </label>
            )}
          />
        ))}
        <Button type="submit" disabled={!isDirty} className="justify-self-start">
          Save settings
        </Button>
      </form>
      <div className="border-error/30 rounded-2xl border p-6">
        <p className="font-semibold">Reset demo edits</p>
        <p className="text-muted-foreground mt-1 text-sm">
          Clears every admin change stored in this browser (prices, stock, order statuses, coupons,
          banners, reviews, settings).
        </p>
        <Button
          variant="destructive"
          className="mt-4"
          onClick={() => {
            if (window.confirm("Reset all demo admin edits in this browser?")) {
              resetAll();
              toast("All demo edits cleared");
            }
          }}
        >
          Reset all edits
        </Button>
      </div>
    </div>
  );
}
