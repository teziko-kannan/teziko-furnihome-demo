import { Toaster } from "@teziko/ui/components/toaster";
import type { ReactNode } from "react";
import { AdminShell } from "@/features/shell/admin-shell";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function DashLayout({ children }: { children: ReactNode }) {
  const session = await requireAdmin();
  return (
    <AdminShell
      user={{ name: session.name, email: session.email }}
      storefrontUrl={process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}
    >
      {children}
      <Toaster />
    </AdminShell>
  );
}
