import type { Metadata } from "next";
import { Suspense } from "react";
import { PageShell } from "@/components/page-shell";
import { RegisterForm } from "@/features/account/auth-forms";

export const metadata: Metadata = { title: "Create account", robots: { index: false } };

export default function Page() {
  return (
    <PageShell
      title="Create an account"
      description="A demo account lets you save addresses and see order history. Everything is deleted after 14 days."
      crumbs={[{ label: "Create account" }]}
      narrow
      className="max-w-xl"
    >
      <Suspense>
        <RegisterForm />
      </Suspense>
    </PageShell>
  );
}
