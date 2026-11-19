"use client";

import { usePrefersReducedMotion } from "@teziko/ui/hooks/use-reduced-motion";
import { CheckCircle2Icon } from "lucide-react";
import dynamic from "next/dynamic";
import animation from "./lottie/success.json";

const Fallback = () => (
  <CheckCircle2Icon className="text-success size-18" strokeWidth={1.5} aria-hidden="true" />
);

// lottie-web is heavy; load it only on the confirmation screen.
const Lottie = dynamic(() => import("lottie-react").then((m) => m.Lottie), {
  ssr: false,
  loading: Fallback,
});

export function SuccessCheck() {
  const reduced = usePrefersReducedMotion();
  if (reduced) return <Fallback />;
  return (
    <div className="size-18" aria-hidden="true">
      <Lottie src={animation} autoplay loop={false} />
    </div>
  );
}
