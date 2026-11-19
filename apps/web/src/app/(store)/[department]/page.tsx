import { categoryBySlug, departments, getCategoryImage, getSubcategories } from "@teziko/data";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductImage } from "@/components/product-image";
import { ListingPage } from "@/features/catalog/listing-page";

export const dynamicParams = false;

export function generateStaticParams() {
  return departments.map((d) => ({ department: d.slug }));
}

export async function generateMetadata({ params }: PageProps<"/[department]">): Promise<Metadata> {
  const { department } = await params;
  const cat = categoryBySlug.get(department);
  if (!cat) return {};
  return {
    title: `${cat.name}: shop online`,
    description: cat.description,
    alternates: { canonical: `/${department}` },
    openGraph: {
      title: cat.name,
      description: cat.description,
      images: [getCategoryImage(cat, 3).src],
    },
  };
}

export default async function DepartmentPage({ params, searchParams }: PageProps<"/[department]">) {
  const { department } = await params;
  const dep = departments.find((d) => d.slug === department);
  const cat = categoryBySlug.get(department);
  if (!dep || !cat) notFound();
  const subs = getSubcategories(department);

  return (
    <ListingPage
      title={cat.name}
      description={cat.description}
      crumbs={[{ label: "Home", href: "/" }, { label: cat.name }]}
      scope={{ department: dep.department }}
      basePath={`/${department}`}
      searchParams={await searchParams}
      intro={
        <nav
          aria-label={`${cat.name} categories`}
          className="-mx-4 mb-10 overflow-x-auto px-4 sm:mx-0 sm:px-0"
        >
          <ul className="flex gap-3 sm:gap-4">
            {subs.map((s) => (
              <li key={s.slug} className="w-32 shrink-0 sm:w-36">
                <Link href={`/category/${s.slug}`} className="group block">
                  <span className="bg-muted block aspect-square overflow-hidden rounded-xl">
                    <ProductImage
                      image={getCategoryImage(s)}
                      sizes="144px"
                      alt=""
                      className="transition-transform duration-500 group-hover:scale-105"
                    />
                  </span>
                  <span className="mt-2 block text-[13px] leading-snug font-medium group-hover:underline">
                    {s.name}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      }
    />
  );
}
