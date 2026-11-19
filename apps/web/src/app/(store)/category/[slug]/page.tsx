import { categories, categoryBySlug, getCategoryImage } from "@teziko/data";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ListingPage } from "@/features/catalog/listing-page";

export const dynamicParams = false;

export function generateStaticParams() {
  return categories.filter((c) => c.parent).map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/category/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const cat = categoryBySlug.get(slug);
  if (!cat) return {};
  return {
    title: cat.name,
    description: cat.description,
    alternates: { canonical: `/category/${slug}` },
    openGraph: {
      title: cat.name,
      description: cat.description,
      images: [getCategoryImage(cat, 3).src],
    },
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: PageProps<"/category/[slug]">) {
  const { slug } = await params;
  const cat = categoryBySlug.get(slug);
  if (!cat?.parent) notFound();
  const parent = categoryBySlug.get(cat.parent)!;
  return (
    <ListingPage
      title={cat.name}
      description={cat.description}
      crumbs={[
        { label: "Home", href: "/" },
        { label: parent.name, href: `/${parent.slug}` },
        { label: cat.name },
      ]}
      scope={{ category: slug }}
      basePath={`/category/${slug}`}
      searchParams={await searchParams}
      showCategories={false}
    />
  );
}
