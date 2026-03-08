import { Clock, Folder, Tag as TagIcon } from "lucide-react";
import { notFound } from "next/navigation";

import { LazyPostPageEnhancements } from "@/components/blog/lazy-post-page-enhancements";
import { ContentMdx } from "@/components/blog/post-mdx-components";
import { PostNavigation } from "@/components/blog/post-navigation";
import { PostPageShell } from "@/components/layout/post-page-shell";
import { TransitionLink } from "@/components/transition/transition-link";
import { Badge } from "@/components/ui/badge";
import { siteConfig } from "@/config/site";
import { routing } from "@/i18n/routing";
import { getAdjacentPosts, getAllPosts, getPostBySlug } from "@/lib/content";

export const dynamicParams = false;

export function generateStaticParams() {
  const posts = getAllPosts();
  return routing.locales.flatMap((locale) =>
    posts.map((post) => ({
      locale,
      slug: post.slug,
    })),
  );
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const resolvedParams = await params;
  const post = getPostBySlug(resolvedParams.slug);
  if (!post) {
    return {};
  }

  return {
    title: `${post.title} - ${siteConfig.name}`,
    description: post.summary,
  };
}

export default async function PostPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const resolvedParams = await params;
  const { locale, slug } = resolvedParams;
  const post = getPostBySlug(slug);
  const articleId = `post-content-${post?.slug ?? slug}`;

  if (!post) {
    notFound();
  }

  const { prevPost, nextPost } = getAdjacentPosts(slug);

  return (
    <>
      <LazyPostPageEnhancements slug={post.slug} targetId={articleId} />
      <PostPageShell className="py-8 md:py-16" currentPath={`/blog/${post.slug}`} locale={locale} tocItems={post.toc}>
        <article id={articleId}>
          <header className="mb-10 md:mb-12" data-transition-layer="hero">
            <div className="mb-4 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <TransitionLink href={`/${locale}/blog`} className="transition-colors hover:text-foreground" transitionGroup="content">
                Blog
              </TransitionLink>
              {post.categories[0] && (
                <>
                  <span>/</span>
                  <TransitionLink
                    href={`/${locale}/blog/categories/${encodeURIComponent(post.categories[0])}`}
                    className="transition-colors hover:text-foreground"
                    transitionGroup="content"
                  >
                    {post.categories[0]}
                  </TransitionLink>
                </>
              )}
            </div>

            <div className="space-y-5">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] font-mono uppercase tracking-[0.14em] text-muted-foreground/85">
                <time dateTime={post.date} className="tabular-nums">
                  {post.formattedDateLong}
                </time>
                <span className="text-muted-foreground/40">•</span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  {post.readingTime}
                </span>
                <span className="text-muted-foreground/40">•</span>
                <span>{post.wordCount} words</span>
              </div>

              <h1 className="max-w-4xl text-3xl font-bold tracking-tight text-foreground md:text-5xl md:leading-tight">
                {post.title}
              </h1>

              <div className="flex flex-wrap items-center gap-2 pt-1">
                {post.categories.map((cat: string) => (
                  <TransitionLink key={cat} href={`/${locale}/blog/categories/${encodeURIComponent(cat)}`} transitionGroup="content">
                    <Badge
                      variant="secondary"
                      className="flex items-center gap-1.5 rounded-full border border-primary/15 bg-primary/10 px-3 py-1 text-xs font-normal text-primary transition-colors hover:bg-primary/15"
                    >
                      <Folder className="h-3 w-3" />
                      {cat}
                    </Badge>
                  </TransitionLink>
                ))}
                {post.tags.map((tag: string) => (
                  <TransitionLink key={tag} href={`/${locale}/blog/tags/${encodeURIComponent(tag)}`} transitionGroup="content">
                    <Badge
                      variant="outline"
                      className="flex items-center gap-1.5 rounded-full border border-border/60 bg-secondary/55 px-3 py-1 text-xs font-normal text-muted-foreground transition-colors hover:border-primary/20 hover:text-foreground"
                    >
                      <TagIcon className="h-3 w-3" />
                      {tag}
                    </Badge>
                  </TransitionLink>
                ))}
              </div>
            </div>
          </header>

          <div className="mdx prose prose-neutral max-w-none dark:prose-invert prose-headings:scroll-mt-28 prose-headings:font-semibold prose-headings:tracking-tight prose-p:text-foreground/90 prose-p:leading-8 prose-a:text-primary prose-a:no-underline prose-strong:text-foreground prose-li:leading-8 prose-blockquote:border-primary/20 prose-blockquote:bg-muted/30 prose-blockquote:px-5 prose-blockquote:py-3 prose-blockquote:not-italic prose-hr:border-border/60 prose-img:rounded-[1.4rem] prose-img:border prose-img:border-border/50 prose-img:shadow-[0_16px_40px_rgba(15,23,42,0.06)]" data-transition-layer="content">
            <ContentMdx code={post.mdx} />
          </div>
        </article>

        <PostNavigation locale={locale} prevPost={prevPost} nextPost={nextPost} />
      </PostPageShell>
    </>
  );
}
