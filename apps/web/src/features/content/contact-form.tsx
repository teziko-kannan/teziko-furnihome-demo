"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@teziko/ui/components/button";
import { Input, NativeSelect, Textarea } from "@teziko/ui/components/input";
import { describedBy, Field } from "@teziko/ui/components/label";
import { contactSchema, type ContactInput } from "@teziko/validators";
import { CheckCircle2Icon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { getDataAdapter } from "../data-access";
import { NO_JS_FORM } from "@/lib/no-js-form";

export function ContactForm() {
  const [sent, setSent] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", message: "", website: "" },
  });

  async function onSubmit(values: ContactInput) {
    setServerError(null);
    const res = await fetch("/api/contact", {
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
    const { website: _hp, ...rest } = values;
    await getDataAdapter().recordSubmission("contact", {
      id: json.id ?? crypto.randomUUID(),
      ...rest,
      createdAt: new Date().toISOString(),
    });
    reset();
    setSent(true);
  }

  if (sent) {
    return (
      <div role="status" className="border-success/30 bg-success/5 rounded-2xl border p-6">
        <CheckCircle2Icon className="text-success size-8" aria-hidden="true" />
        <p className="mt-3 text-lg font-semibold">Thanks, we&apos;ve got your message.</p>
        <p className="text-muted-foreground mt-1 text-sm">
          This is a demo, so no one will reply. Your message is deleted after 14 days.
        </p>
        <Button variant="outline" className="mt-5" onClick={() => setSent(false)}>
          Send another message
        </Button>
      </div>
    );
  }

  return (
    <form
      {...NO_JS_FORM}
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="grid gap-5 sm:grid-cols-2"
    >
      <Field id="c-name" label="Name" error={errors.name?.message} required>
        <Input
          id="c-name"
          autoComplete="name"
          {...register("name")}
          aria-invalid={Boolean(errors.name)}
          aria-describedby={describedBy("c-name", errors.name?.message)}
        />
      </Field>
      <Field id="c-email" label="Email" error={errors.email?.message} required>
        <Input
          id="c-email"
          type="email"
          autoComplete="email"
          {...register("email")}
          aria-invalid={Boolean(errors.email)}
          aria-describedby={describedBy("c-email", errors.email?.message)}
        />
      </Field>
      <Field
        id="c-topic"
        label="Topic"
        error={errors.topic?.message}
        required
        className="sm:col-span-2"
      >
        <NativeSelect
          id="c-topic"
          defaultValue=""
          {...register("topic")}
          aria-invalid={Boolean(errors.topic)}
          aria-describedby={describedBy("c-topic", errors.topic?.message)}
        >
          <option value="" disabled>
            Choose a topic
          </option>
          <option value="order">An order</option>
          <option value="product">A product question</option>
          <option value="delivery">Delivery or installation</option>
          <option value="returns">Returns and refunds</option>
          <option value="other">Something else</option>
        </NativeSelect>
      </Field>
      <Field
        id="c-message"
        label="Message"
        error={errors.message?.message}
        required
        className="sm:col-span-2"
      >
        <Textarea
          id="c-message"
          rows={5}
          {...register("message")}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={describedBy("c-message", errors.message?.message)}
        />
      </Field>
      <div aria-hidden="true" className="absolute -left-[9999px]">
        <label htmlFor="c-website">Website</label>
        <input id="c-website" tabIndex={-1} autoComplete="off" {...register("website")} />
      </div>
      {serverError ? (
        <p role="alert" className="text-error text-sm font-medium sm:col-span-2">
          {serverError}
        </p>
      ) : null}
      <Button
        type="submit"
        size="lg"
        disabled={isSubmitting}
        className="sm:col-span-2 sm:justify-self-start"
      >
        {isSubmitting ? "Sending…" : "Send message"}
      </Button>
    </form>
  );
}
