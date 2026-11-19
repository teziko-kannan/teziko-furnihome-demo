"use client";

import type { Order, PaymentMethod } from "@teziko/types";
import { Button } from "@teziko/ui/components/button";
import { RadioGroup, RadioGroupItem } from "@teziko/ui/components/form-controls";
import { StateBlock } from "@teziko/ui/components/states";
import { useHydrated } from "@teziko/ui/hooks/use-hydrated";
import { usePrefersReducedMotion } from "@teziko/ui/hooks/use-reduced-motion";
import {
  AlertTriangleIcon,
  BanknoteIcon,
  Building2Icon,
  CreditCardIcon,
  InfoIcon,
  LockIcon,
  ShoppingBagIcon,
  SmartphoneIcon,
} from "lucide-react";
import { m } from "motion/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { formatINR } from "@/lib/format";
import { site } from "@/lib/site";
import { useSession } from "../account/use-session";
import { CartLines } from "../cart/cart-lines";
import { CouponForm } from "../cart/coupon-form";
import { OrderSummary } from "../cart/order-summary";
import { useQuote } from "../cart/use-quote";
import { getDataAdapter } from "../data-access";
import { useCart } from "../shopper/stores";
import { AddressForm, type CheckoutAddress } from "./address-form";
import { CheckoutSteps } from "./steps";

const METHODS: { id: PaymentMethod; label: string; hint: string; icon: typeof CreditCardIcon }[] = [
  { id: "upi", label: "UPI", hint: "Pay with any UPI app (simulated)", icon: SmartphoneIcon },
  {
    id: "card",
    label: "Credit / debit card",
    hint: "Simulated: no card details are requested",
    icon: CreditCardIcon,
  },
  {
    id: "netbanking",
    label: "Net banking",
    hint: "All major banks (simulated)",
    icon: Building2Icon,
  },
  { id: "cod", label: "Cash on delivery", hint: "Pay when your order arrives", icon: BanknoteIcon },
];

export function CheckoutFlow() {
  const hydrated = useHydrated();
  const items = useCart((s) => s.items);
  const couponCode = useCart((s) => s.couponCode);
  const clear = useCart((s) => s.clear);
  const { quote, loading, error } = useQuote(hydrated ? items : [], couponCode);
  const router = useRouter();
  const reduced = usePrefersReducedMotion();
  const user = useSession((s) => s.user);
  const loadSession = useSession((s) => s.load);
  const [step, setStep] = useState(0);
  const [address, setAddress] = useState<CheckoutAddress | null>(null);
  const [prefill, setPrefill] = useState<Partial<CheckoutAddress> | null>(null);
  const [method, setMethod] = useState<PaymentMethod>("upi");
  const [submitting, setSubmitting] = useState(false);
  const [failure, setFailure] = useState<string | null>(null);

  useEffect(() => {
    void loadSession();
  }, [loadSession]);

  // Prefill from the signed-in customer's default saved address.
  useEffect(() => {
    if (!user) return;
    let alive = true;
    getDataAdapter()
      .getProfile(user.email)
      .then((p) => {
        if (!alive) return;
        const a = p?.addresses.find((x) => x.isDefault) ?? p?.addresses[0];
        setPrefill({
          email: user.email,
          fullName: a?.fullName ?? user.name,
          phone: a?.phone ?? p?.phone ?? "",
          line1: a?.line1 ?? "",
          line2: a?.line2 ?? "",
          city: a?.city ?? "",
          state: a?.state ?? "",
          pincode: a?.pincode ?? "",
        });
      })
      .catch(() => alive && setPrefill({ email: user.email, fullName: user.name }));
    return () => {
      alive = false;
    };
  }, [user]);

  if (!hydrated) {
    return (
      <div className="skeleton h-96 rounded-2xl" aria-busy="true" aria-label="Loading checkout" />
    );
  }

  if (items.length === 0) {
    return (
      <StateBlock
        icon={ShoppingBagIcon}
        title="Your cart is empty"
        description="Add something you love, then come back to check out."
        action={
          <Button asChild>
            <Link href="/shop">Browse products</Link>
          </Button>
        }
      />
    );
  }

  async function placeOrder(outcome: "success" | "failure") {
    if (!address) return;
    setSubmitting(true);
    setFailure(null);
    const { email, ...addr } = address;
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          email,
          address: addr,
          lines: items.map(({ productId, sku, quantity }) => ({ productId, sku, quantity })),
          couponCode,
          paymentMethod: method,
          simulateOutcome: outcome,
          website: "",
        }),
      });
      const json = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        order?: Order;
        error?: string;
      };
      if (json.order) await getDataAdapter().saveOrder(json.order);
      if (res.status === 402 && json.order) {
        setFailure(
          `Payment for order ${json.order.number} was declined (simulated). Your cart is saved: try again or pick another method.`,
        );
        setStep(1);
        return;
      }
      if (!res.ok || !json.order) {
        setFailure(json.error ?? "We couldn't place your order. Please try again.");
        return;
      }
      clear();
      router.push(`/order/${json.order.number}?email=${encodeURIComponent(json.order.email)}`);
    } catch {
      setFailure("Network error. Check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const panel = {
    initial: reduced ? { opacity: 0 } : { opacity: 0, x: 24 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] as const },
  };

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_400px]">
      <div>
        <CheckoutSteps current={step} />
        <p className="bg-muted mb-6 flex items-start gap-2 rounded-xl px-4 py-3 text-sm">
          <InfoIcon className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          {site.demoNotice}
        </p>
        {failure ? (
          <div
            role="alert"
            className="border-error/30 bg-error/5 text-error mb-6 flex items-start gap-2 rounded-xl border px-4 py-3 text-sm"
          >
            <AlertTriangleIcon className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            {failure}
          </div>
        ) : null}
        <>
          {step === 0 ? (
            <m.div key="address" {...panel}>
              <AddressForm
                key={prefill ? "prefilled" : "blank"}
                defaultValues={address ?? prefill ?? {}}
                onSubmit={(v) => {
                  setAddress(v);
                  setStep(1);
                }}
              />
              {!user ? (
                <p className="text-muted-foreground mt-4 text-sm">
                  Have an account?{" "}
                  <Link
                    href="/login?next=/checkout"
                    className="text-foreground font-medium underline underline-offset-4"
                  >
                    Sign in
                  </Link>{" "}
                  to use saved addresses.
                </p>
              ) : null}
            </m.div>
          ) : null}

          {step === 1 ? (
            <m.div key="payment" {...panel} className="grid gap-6">
              {address ? (
                <div className="border-border flex items-start justify-between gap-4 rounded-xl border p-4 text-sm">
                  <div>
                    <p className="font-semibold">Delivering to {address.fullName}</p>
                    <p className="text-muted-foreground mt-1">
                      {address.line1}
                      {address.line2 ? `, ${address.line2}` : ""}, {address.city}, {address.state}{" "}
                      {address.pincode}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStep(0)}
                    className="text-sm font-medium underline underline-offset-4"
                  >
                    Edit
                  </button>
                </div>
              ) : null}
              <fieldset>
                <legend className="mb-4 font-sans text-lg font-semibold">Payment method</legend>
                <RadioGroup
                  value={method}
                  onValueChange={(v) => setMethod(v as PaymentMethod)}
                  aria-label="Payment method"
                >
                  {METHODS.map((m) => (
                    <label
                      key={m.id}
                      htmlFor={`pm-${m.id}`}
                      className="border-border has-[[data-state=checked]]:border-foreground has-[[data-state=checked]]:bg-muted/60 flex cursor-pointer items-center gap-4 rounded-xl border p-4 transition-colors"
                    >
                      <RadioGroupItem id={`pm-${m.id}`} value={m.id} />
                      <m.icon className="size-5 shrink-0" aria-hidden="true" />
                      <span>
                        <span className="block text-sm font-semibold">{m.label}</span>
                        <span className="text-muted-foreground block text-xs">{m.hint}</span>
                      </span>
                    </label>
                  ))}
                </RadioGroup>
              </fieldset>
              <div className="flex flex-wrap gap-3">
                <Button variant="outline" size="lg" onClick={() => setStep(0)}>
                  Back
                </Button>
                {method === "cod" ? (
                  <Button
                    variant="accent"
                    size="lg"
                    disabled={submitting || loading || !quote}
                    onClick={() => placeOrder("success")}
                  >
                    {submitting
                      ? "Placing order…"
                      : `Place order · ${quote ? formatINR(quote.total) : "…"}`}
                  </Button>
                ) : (
                  <Button
                    variant="accent"
                    size="lg"
                    disabled={loading || !quote}
                    onClick={() => setStep(2)}
                  >
                    Continue to pay
                  </Button>
                )}
              </div>
            </m.div>
          ) : null}

          {step === 2 ? (
            <m.div key="pay" {...panel}>
              <div className="border-border shadow-soft mx-auto max-w-md overflow-hidden rounded-2xl border">
                <div className="bg-chrome text-chrome-foreground flex items-center justify-between px-5 py-4">
                  <span className="flex items-center gap-2 text-sm font-semibold">
                    <LockIcon className="size-4" aria-hidden="true" />
                    Demo Pay (simulated gateway)
                  </span>
                  <span className="text-chrome-muted text-xs">
                    {METHODS.find((m) => m.id === method)?.label}
                  </span>
                </div>
                <div className="space-y-5 p-6">
                  <div>
                    <p className="text-muted-foreground text-sm">Amount to pay</p>
                    <p className="font-display text-4xl tabular-nums">
                      {quote ? formatINR(quote.total) : "…"}
                    </p>
                  </div>
                  <p className="bg-muted rounded-lg p-3 text-xs leading-relaxed">
                    This screen stands in for a real payment gateway. No card, UPI or bank details
                    are collected. Choose an outcome to see both flows.
                  </p>
                  <div className="grid gap-2 sm:grid-cols-2">
                    <Button size="lg" disabled={submitting} onClick={() => placeOrder("success")}>
                      {submitting ? "Processing…" : "Simulate success"}
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      disabled={submitting}
                      onClick={() => placeOrder("failure")}
                    >
                      Simulate failure
                    </Button>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="w-full text-center text-sm font-medium underline underline-offset-4"
                  >
                    Change payment method
                  </button>
                </div>
              </div>
            </m.div>
          ) : null}
        </>
      </div>

      <aside
        className="border-border h-fit rounded-2xl border p-5 lg:sticky lg:top-32"
        aria-label="Order summary"
      >
        <h2 className="font-sans text-lg font-semibold tracking-normal">Order summary</h2>
        <div className="max-h-80 overflow-y-auto">
          <CartLines items={items} quote={quote} compact />
        </div>
        <div className="border-border mt-2 space-y-4 border-t pt-4">
          <CouponForm quote={quote} />
          {error ? (
            <p role="alert" className="text-error text-sm">
              {error}
            </p>
          ) : (
            <OrderSummary quote={quote} loading={loading} />
          )}
        </div>
      </aside>
    </div>
  );
}
