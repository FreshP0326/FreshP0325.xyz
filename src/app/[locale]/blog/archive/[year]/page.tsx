import { notFound } from "next/navigation";

import { PostList } from "@/components/blog/post-list";
import { PageShell } from "@/components/layout/page-shell";
import { routing } from "@/i18n/routing";
import { getAllPosts } from "@/lib/content";

export const dynamicParams = false;

interface PageProps {
  params: Promise<{
    year: string;
    locale: string;
  }>;
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  const years = new Set(posts.map((post) => new Date(post.date).getFullYear().toString()));

  return routing.locales.flatMap((locale) => Array.from(years).map((year) => ({ locale, year })));
}

export default async function ArchivePage({ params }: PageProps) {
  const { year, locale } = await params;
  const posts = getAllPosts().filter((post) => new Date(post.date).getFullYear().toString() === year);

  if (posts.length === 0) {
    notFound();
  }

  return (
    <PageShell currentPath={`/blog/archive/${year}`} locale={locale}>
      <header className="mb-8 rounded-[1.9rem] border border-border/50 bg-card/55 p-6 shadow-[0_12px_40px_rgba(15,23,42,0.04)] backdrop-blur-sm md:mb-10 md:p-8" data-transition-layer="hero">
        <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">Archive</p>
        <h1 className="mb-3 text-4xl font-bold tracking-tight text-foreground">{year}</h1>
        <p className="max-w-2xl text-base leading-7 text-muted-foreground md:text-lg">
          {posts.length} posts published in {year}.
        </p>
      </header>

      <div data-transition-layer="content">
        <PostList locale={locale} posts={posts} />
      </div>
    </PageShell>
  );
}
