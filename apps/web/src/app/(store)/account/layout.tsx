import type { Metadata } from "next";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { AccountNav } from "@/features/account/account-nav";
import { getSession } from "@/lib/server/auth";

export const metadata: Metadata = { robots: { index: false } };

/** Server-side session check (the proxy is the first check, this is the second). */
export default async function AccountLayout({ children }: { children: ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/login?next=/account");
  return (
    <div className="container-page pt-8 pb-20">
      <p className="text-muted-foreground text-sm">Signed in as {session.email}</p>
      <h1 className="mt-1 mb-8 text-3xl sm:text-4xl">Hello, {session.name.split(" ")[0]}</h1>
      <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
        <AccountNav />
        <div>{children}</div>
      </div>
    </div>
  );
}
