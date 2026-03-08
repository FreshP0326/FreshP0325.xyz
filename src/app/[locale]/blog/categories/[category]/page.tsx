import { PostFilterPage } from "@/components/blog/post-filter-page";
import { siteConfig } from "@/config/site";
import { routing } from "@/i18n/routing";
import { getAllCategories } from "@/lib/content";

export const dynamicParams = false;

export async function generateStaticParams() {
  const categories = getAllCategories();

  return routing.locales.flatMap((locale) =>
    categories.map((category) => ({
      locale,
      category,
    })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; category: string }>;
}) {
  const resolvedParams = await params;

  return {
    title: `Category: ${decodeURIComponent(resolvedParams.category)} - ${siteConfig.name}`,
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ locale: string; category: string }>;
}) {
  const resolvedParams = await params;

  return <PostFilterPage locale={resolvedParams.locale} type="category" value={resolvedParams.category} />;
}
