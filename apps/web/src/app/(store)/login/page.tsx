import type { Metadata } from "next";
import { Suspense } from "react";
import { PageShell } from "@/components/page-shell";
import { LoginForm } from "@/features/account/auth-forms";

export const metadata: Metadata = { title: "Sign in", robots: { index: false } };

export default function Page() {
  return (
    <PageShell
      title="Sign in"
      description="Sign in to see your orders and saved addresses."
      crumbs={[{ label: "Sign in" }]}
      narrow
      className="max-w-xl"
    >
      <Suspense>
        <LoginForm />
      </Suspense>
    </PageShell>
  );
}
