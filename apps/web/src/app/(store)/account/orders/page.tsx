import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { OrdersList } from "@/features/account/orders-list";
import { getSession } from "@/lib/server/auth";

export const metadata: Metadata = { title: "My orders" };

export default async function Page() {
  const session = await getSession();
  if (!session) redirect("/login?next=/account/orders");
  return (
    <section aria-labelledby="orders-h">
      <h2 id="orders-h" className="mb-4 font-sans text-lg font-semibold tracking-normal">
        My orders
      </h2>
      <OrdersList email={session.email} />
    </section>
  );
}
