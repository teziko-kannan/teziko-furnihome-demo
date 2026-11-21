"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type { Order, SessionUser } from "@teziko/types";
import { Button } from "@teziko/ui/components/button";
import { Input } from "@teziko/ui/components/input";
import { describedBy, Field } from "@teziko/ui/components/label";
import { toast } from "@teziko/ui/components/toaster";
import {
  loginSchema,
  registerSchema,
  type LoginInput,
  type RegisterInput,
} from "@teziko/validators";
import { CopyIcon } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { NO_JS_FORM } from "@/lib/no-js-form";
import { site } from "@/lib/site";
import { localAccountExists, saveLocalAccount, verifyLocalAccount } from "./local-accounts";
import {
  useForm,
  type FieldValues,
  type Path,
  type UseFormRegister,
  type FieldErrors,
} from "react-hook-form";
import { getDataAdapter } from "../data-access";
import { useSession } from "./use-session";

/** Gives the demo customer two sample orders the first time they sign in (in this browser). */
async function seedDemoOrders(email: string) {
  if (email !== "customer@demo.com") return;
  const adapter = getDataAdapter();
  try {
    if ((await adapter.listOrders(email)).length > 0) return;
    const res = await fetch("/api/demo/sample-orders", { method: "POST" });
    if (!res.ok) return;
    const { orders } = (await res.json()) as { orders: Order[] };
    for (const o of orders) await adapter.saveOrder(o);
  } catch {
    // Sample data is a nicety; sign-in still succeeds without it.
  }
}

function safeNext(next: string | null) {
  return next && next.startsWith("/") && !next.startsWith("//") ? next : "/account";
}

function TextField<T extends FieldValues>({
  name,
  label,
  type = "text",
  autoComplete,
  register,
  errors,
}: {
  name: Path<T>;
  label: string;
  type?: string;
  autoComplete?: string;
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
}) {
  const id = `auth-${name}`;
  const error = errors[name]?.message as string | undefined;
  return (
    <Field id={id} label={label} error={error} required>
      <Input
        id={id}
        type={type}
        autoComplete={autoComplete}
        {...register(name)}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy(id, error)}
      />
    </Field>
  );
}

export function LoginForm() {
  const sp = useSearchParams();
  const setUser = useSession((s) => s.set);
  const [serverError, setServerError] = useState<string | null>(null);
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
    setServerError(null);
    let res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(values),
    });
    // Not a demo account: try an account registered in this browser (password checked locally).
    if (res.status === 401 && localAccountExists(values.email)) {
      const name = await verifyLocalAccount(values.email, values.password);
      if (name) {
        res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ name, email: values.email, password: values.password }),
        });
      }
    }
    const json = (await res.json().catch(() => ({}))) as {
      ok?: boolean;
      error?: string;
      user?: SessionUser;
    };
    if (!res.ok || !json.user) {
      setServerError(
        res.status === 401 || res.status === 409 || res.ok
          ? "Email or password is incorrect. Accounts you register are saved in this browser only."
          : (json.error ?? "Sign in failed. Please try again."),
      );
      return;
    }
    setUser(json.user);
    await seedDemoOrders(json.user.email);
    toast.success(`Welcome back, ${json.user.name}`);
    window.location.assign(safeNext(sp.get("next")));
  }

  return (
    <div className="space-y-6">
      <div className="border-foreground/30 bg-muted/60 rounded-xl border border-dashed p-4 text-sm">
        <p className="font-semibold">Demo login</p>
        <p className="text-muted-foreground mt-1">
          Use this account to explore orders and addresses:
        </p>
        <button
          type="button"
          onClick={() => {
            setValue("email", "customer@demo.com");
            setValue("password", "demo1234");
          }}
          className="bg-background shadow-soft mt-3 inline-flex items-center gap-2 rounded-full px-3 py-1.5 font-mono text-xs hover:bg-white"
        >
          customer@demo.com / demo1234
          <CopyIcon className="size-3.5" aria-hidden="true" />
          <span className="sr-only">Fill demo credentials</span>
        </button>
        <p className="text-muted-foreground mt-3 text-xs">
          Admin (admin@demo.com / admin1234) signs in on the{" "}
          <a
            href={site.adminUrl}
            className="text-foreground font-medium underline underline-offset-4"
          >
            separate admin app
          </a>
          .
        </p>
      </div>
      <form {...NO_JS_FORM} onSubmit={handleSubmit(onSubmit)} noValidate className="grid gap-5">
        <TextField
          name="email"
          label="Email"
          type="email"
          autoComplete="email"
          register={register}
          errors={errors}
        />
        <TextField
          name="password"
          label="Password"
          type="password"
          autoComplete="current-password"
          register={register}
          errors={errors}
        />
        {serverError ? (
          <p role="alert" className="text-error text-sm font-medium">
            {serverError}
          </p>
        ) : null}
        <Button type="submit" size="lg" disabled={isSubmitting}>
          {isSubmitting ? "Signing in…" : "Sign in"}
        </Button>
      </form>
      <p className="text-muted-foreground text-sm">
        New here?{" "}
        <Link
          href={`/register${sp.get("next") ? `?next=${encodeURIComponent(sp.get("next")!)}` : ""}`}
          className="text-foreground font-medium underline underline-offset-4"
        >
          Create a demo account
        </Link>
      </p>
    </div>
  );
}

export function RegisterForm() {
  const sp = useSearchParams();
  const setUser = useSession((s) => s.set);
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "" },
  });

  async function onSubmit(values: RegisterInput) {
    setServerError(null);
    if (localAccountExists(values.email)) {
      setServerError("An account with this email already exists in this browser. Sign in instead.");
      return;
    }
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(values),
    });
    const json = (await res.json().catch(() => ({}))) as {
      ok?: boolean;
      error?: string;
      user?: SessionUser;
    };
    if (!res.ok || !json.user) {
      setServerError(json.error ?? "Couldn't create your account.");
      return;
    }
    await saveLocalAccount(json.user.email, json.user.name, values.password);
    await getDataAdapter().saveProfile({
      email: json.user.email,
      name: json.user.name,
      phone: "",
      addresses: [],
      createdAt: new Date().toISOString(),
    });
    setUser(json.user);
    toast.success("Account created", {
      description: "Demo account: data is deleted after 14 days.",
    });
    window.location.assign(safeNext(sp.get("next")));
  }

  return (
    <div className="space-y-6">
      <form {...NO_JS_FORM} onSubmit={handleSubmit(onSubmit)} noValidate className="grid gap-5">
        <TextField
          name="name"
          label="Full name"
          autoComplete="name"
          register={register}
          errors={errors}
        />
        <TextField
          name="email"
          label="Email"
          type="email"
          autoComplete="email"
          register={register}
          errors={errors}
        />
        <TextField
          name="password"
          label="Password"
          type="password"
          autoComplete="new-password"
          register={register}
          errors={errors}
        />
        <p className="text-muted-foreground text-xs">
          Demo only: please don&apos;t use a real password. It is not stored anywhere.
        </p>
        {serverError ? (
          <p role="alert" className="text-error text-sm font-medium">
            {serverError}
          </p>
        ) : null}
        <Button type="submit" size="lg" disabled={isSubmitting}>
          {isSubmitting ? "Creating account…" : "Create account"}
        </Button>
      </form>
      <p className="text-muted-foreground text-sm">
        Already have an account?{" "}
        <Link href="/login" className="text-foreground font-medium underline underline-offset-4">
          Sign in
        </Link>
      </p>
    </div>
  );
}
