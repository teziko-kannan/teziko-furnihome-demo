import type { Metadata } from "next";
import { OrderConfirmation } from "@/features/orders/order-confirmation";

export const metadata: Metadata = { title: "Order confirmation", robots: { index: false } };

export default async function Page({ params }: PageProps<"/order/[number]">) {
  const { number } = await params;
  return (
    <div className="container-page pt-10 pb-20">
      <OrderConfirmation number={decodeURIComponent(number)} />
    </div>
  );
}
