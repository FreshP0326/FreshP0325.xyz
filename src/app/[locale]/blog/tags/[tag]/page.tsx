import { PostFilterPage } from "@/components/blog/post-filter-page";
import { siteConfig } from "@/config/site";
import { routing } from "@/i18n/routing";
import { getAllTags } from "@/lib/content";

export const dynamicParams = false;

export async function generateStaticParams() {
  const tags = getAllTags();

  return routing.locales.flatMap((locale) =>
    tags.map((tag) => ({
      locale,
      tag,
    })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; tag: string }>;
}) {
  const resolvedParams = await params;

  return {
    title: `Tag: #${decodeURIComponent(resolvedParams.tag)} - ${siteConfig.name}`,
  };
}

export default async function TagPage({
  params,
}: {
  params: Promise<{ locale: string; tag: string }>;
}) {
  const resolvedParams = await params;

  return <PostFilterPage locale={resolvedParams.locale} type="tag" value={resolvedParams.tag} />;
}
