import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ProfilePanel } from "@/features/account/profile-panel";
import { getSession } from "@/lib/server/auth";

export const metadata: Metadata = { title: "My account" };

export default async function Page() {
  const session = await getSession();
  if (!session) redirect("/login?next=/account");
  return <ProfilePanel user={{ email: session.email, name: session.name, role: session.role }} />;
}
