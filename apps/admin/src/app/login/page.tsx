import type { Metadata } from "next";
import { AdminLoginForm } from "@/features/auth/login-form";

export const metadata: Metadata = { title: "Sign in" };

export default function Page() {
  return (
    <main className="grid min-h-dvh lg:grid-cols-2">
      <div className="bg-chrome text-chrome-foreground hidden flex-col justify-between p-12 lg:flex">
        <span className="font-display flex items-baseline gap-1 text-3xl text-white">
          Home Vibe
          <span aria-hidden="true" className="bg-accent inline-block size-2 rounded-full" />
        </span>
        <div>
          <p className="font-display text-4xl leading-tight text-white">
            Run the demo store: orders, catalogue and customers in one place.
          </p>
          <p className="text-chrome-muted mt-4 text-sm">
            Demo admin. Analytics are seeded; edits are saved in your browser and deleted after 14
            days.
          </p>
        </div>
      </div>
      <div className="bg-background flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <h1 className="text-3xl">Admin sign in</h1>
          <p className="text-muted-foreground mt-2 mb-8 text-sm">
            Restricted to the demo admin account.
          </p>
          <AdminLoginForm />
        </div>
      </div>
    </main>
  );
}
