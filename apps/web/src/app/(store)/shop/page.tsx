import type { Metadata } from "next";
import { ListingPage } from "@/features/catalog/listing-page";

export const metadata: Metadata = {
  title: "Shop all furniture, appliances and decor",
  description:
    "Browse every product in the Home Vibe demo store: sofas, beds, refrigerators, ACs, TVs, lighting, rugs and more.",
  alternates: { canonical: "/shop" },
};

export default async function ShopPage({ searchParams }: PageProps<"/shop">) {
  return (
    <ListingPage
      title="Shop all"
      description="Every sofa, appliance and decor piece in the store. Use the filters to narrow it down."
      crumbs={[{ label: "Home", href: "/" }, { label: "Shop all" }]}
      scope={{}}
      basePath="/shop"
      searchParams={await searchParams}
    />
  );
}
