"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@teziko/ui/components/button";
import { Input } from "@teziko/ui/components/input";
import { describedBy, Field } from "@teziko/ui/components/label";
import { loginSchema, type LoginInput } from "@teziko/validators";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { NO_JS_FORM } from "@/lib/no-js-form";

export function AdminLoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: LoginInput) {
    setError(null);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(values),
    });
    const json = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
    if (!res.ok || !json.ok) {
      setError(json.error ?? "Sign in failed.");
      return;
    }
    router.push("/");
  }

  return (
    <div className="space-y-6">
      <div className="border-foreground/30 bg-muted/60 rounded-xl border border-dashed p-4 text-sm">
        <p className="font-semibold">Demo admin login</p>
        <button
          type="button"
          onClick={() => {
            setValue("email", "admin@demo.com");
            setValue("password", "admin1234");
          }}
          className="bg-background shadow-soft mt-2 rounded-full px-3 py-1.5 font-mono text-xs hover:bg-white"
        >
          admin@demo.com / admin1234 <span className="sr-only">(fill the form)</span>
        </button>
      </div>
      <form {...NO_JS_FORM} onSubmit={handleSubmit(onSubmit)} noValidate className="grid gap-5">
        <Field id="a-email" label="Email" error={errors.email?.message} required>
          <Input
            id="a-email"
            type="email"
            autoComplete="username"
            {...register("email")}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={describedBy("a-email", errors.email?.message)}
          />
        </Field>
        <Field id="a-password" label="Password" error={errors.password?.message} required>
          <Input
            id="a-password"
            type="password"
            autoComplete="current-password"
            {...register("password")}
            aria-invalid={Boolean(errors.password)}
            aria-describedby={describedBy("a-password", errors.password?.message)}
          />
        </Field>
        {error ? (
          <p role="alert" className="text-error text-sm font-medium">
            {error}
          </p>
        ) : null}
        <Button type="submit" size="lg" disabled={isSubmitting}>
          {isSubmitting ? "Signing in…" : "Sign in to admin"}
        </Button>
      </form>
    </div>
  );
}
