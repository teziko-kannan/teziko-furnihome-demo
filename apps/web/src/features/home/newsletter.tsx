"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@teziko/ui/components/button";
import { Input } from "@teziko/ui/components/input";
import { Reveal } from "@teziko/ui/motion/reveal";
import { newsletterSchema, type NewsletterInput } from "@teziko/validators";
import { CheckCircle2Icon } from "lucide-react";
import { AnimatePresence, m } from "motion/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { getDataAdapter } from "../data-access";

export function Newsletter() {
  const [done, setDone] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<NewsletterInput>({
    resolver: zodResolver(newsletterSchema),
    defaultValues: { email: "", website: "" },
  });

  async function onSubmit(values: NewsletterInput) {
    setServerError(null);
    const res = await fetch("/api/newsletter", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(values),
    });
    const json = (await res.json().catch(() => ({}))) as {
      ok?: boolean;
      error?: string;
      id?: string;
    };
    if (!res.ok || !json.ok) {
      setServerError(json.error ?? "Something went wrong. Please try again.");
      return;
    }
    await getDataAdapter().recordSubmission("newsletter", {
      id: json.id ?? crypto.randomUUID(),
      email: values.email,
      createdAt: new Date().toISOString(),
    });
    setDone(true);
  }

  return (
    <section className="container-page py-16 sm:py-24" aria-labelledby="nl-heading">
      <Reveal
        className="bg-chrome text-chrome-foreground relative overflow-hidden rounded-3xl px-6 py-12 sm:px-12 sm:py-16"
        y={32}
      >
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 id="nl-heading" className="text-3xl text-white sm:text-4xl">
              New collections, first.
            </h2>
            <p className="text-chrome-muted mt-3 max-w-md text-sm">
              Get early access to drops and seasonal edits. Demo signup: we never send email and
              delete your address after 14 days.
            </p>
          </div>
          <AnimatePresence mode="wait" initial={false}>
            {done ? (
              <m.p
                key="done"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                role="status"
                className="flex items-center gap-3 text-lg text-white"
              >
                <CheckCircle2Icon className="text-accent size-6" aria-hidden="true" />
                You&apos;re on the list (demo).
              </m.p>
            ) : (
              <m.form
                key="form"
                exit={{ opacity: 0, y: -10 }}
                onSubmit={handleSubmit(onSubmit)}
                noValidate
                className="w-full"
              >
                <label htmlFor="nl-email" className="sr-only">
                  Email address
                </label>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Input
                    id="nl-email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    {...register("email")}
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={errors.email || serverError ? "nl-error" : undefined}
                    className="h-12 border-white/20 bg-white/5 text-white placeholder:text-white/50 hover:border-white/40 focus-visible:border-white"
                  />
                  <div aria-hidden="true" className="absolute -left-[9999px]">
                    <label htmlFor="nl-website">Website</label>
                    <input
                      id="nl-website"
                      tabIndex={-1}
                      autoComplete="off"
                      {...register("website")}
                    />
                  </div>
                  <Button
                    type="submit"
                    variant="accent"
                    size="lg"
                    disabled={isSubmitting}
                    className="h-12"
                  >
                    {isSubmitting ? "Subscribing…" : "Subscribe"}
                  </Button>
                </div>
                {errors.email || serverError ? (
                  <p id="nl-error" role="alert" className="mt-2 text-sm text-[#ff9b9b]">
                    {errors.email?.message ?? serverError}
                  </p>
                ) : null}
              </m.form>
            )}
          </AnimatePresence>
        </div>
      </Reveal>
    </section>
  );
}
