import { Rss } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { siteConfig } from "@/config/site";
import { PageShell } from "@/components/layout/page-shell";
import { getAllPosts } from "@/lib/content";
import { PostList } from "@/components/blog/post-list";

export default async function BlogIndex({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const posts = getAllPosts();
  const t = await getTranslations({ locale, namespace: 'Common' });

  return (
    <PageShell currentPath="/blog" locale={locale}>
      <header className="mb-8 rounded-[1.9rem] border border-border/50 bg-card/55 p-6 shadow-[0_12px_40px_rgba(15,23,42,0.04)] backdrop-blur-sm md:mb-10 md:p-8" data-transition-layer="hero">
        <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">Journal</p>
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="mb-3 text-4xl font-bold tracking-tight text-foreground">Blog</h1>
            <p className="max-w-2xl text-base leading-7 text-muted-foreground md:text-lg">
              {t('blogDescription', {count: posts.length})}
            </p>
          </div>

          <a
            href={siteConfig.links.rss}
            target="_blank"
            rel="noreferrer"
            className="inline-flex shrink-0 items-center gap-2 self-start rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/20 hover:text-primary"
            aria-label={t('rssSubscribe')}
          >
            <Rss className="h-4 w-4" />
            <span>{t('rssSubscribe')}</span>
          </a>
        </div>
      </header>
      
      <div data-transition-layer="content">
        <PostList locale={locale} posts={posts} />
      </div>
    </PageShell>
  );
}
