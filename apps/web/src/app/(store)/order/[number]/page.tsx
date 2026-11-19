import type { Metadata } from "next";
import { OrderConfirmation } from "@/features/orders/order-confirmation";

export const metadata: Metadata = { title: "Order confirmation", robots: { index: false } };

export default async function Page({ params, searchParams }: PageProps<"/order/[number]">) {
  const { number } = await params;
  const sp = await searchParams;
  const email = typeof sp.email === "string" ? sp.email : undefined;
  return (
    <div className="container-page pt-10 pb-20">
      <OrderConfirmation number={decodeURIComponent(number)} email={email} />
    </div>
  );
}
