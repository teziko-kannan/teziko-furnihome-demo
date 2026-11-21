import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";
import { TrackOrder } from "@/features/orders/track-order";

export const metadata: Metadata = {
  title: "Track your order",
  description: "Track a Home Vibe demo order with your order number and email.",
  alternates: { canonical: "/track-order" },
};

export default async function Page({ searchParams }: PageProps<"/track-order">) {
  const sp = await searchParams;
  return (
    <PageShell
      title="Track your order"
      description="Enter the order number from your confirmation and the email you used at checkout."
      crumbs={[{ label: "Track order" }]}
    >
      <TrackOrder
        initial={{
          orderNumber: typeof sp.number === "string" ? sp.number : undefined,
        }}
      />
    </PageShell>
  );
}
