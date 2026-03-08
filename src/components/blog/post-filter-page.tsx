import { PageShell } from "@/components/layout/page-shell";
import { PostList } from "@/components/blog/post-list";
import { TransitionLink } from "@/components/transition/transition-link";
import { getPostsByCategory, getPostsByTag } from "@/lib/content";

interface PostFilterPageProps {
  locale: string;
  type: "category" | "tag";
  value: string;
}

export function PostFilterPage({ locale, type, value }: PostFilterPageProps) {
  const decodedValue = decodeURIComponent(value);
  const posts = type === "category" ? getPostsByCategory(decodedValue) : getPostsByTag(decodedValue);
  const currentPath =
    type === "category"
      ? `/blog/categories/${encodeURIComponent(decodedValue)}`
      : `/blog/tags/${encodeURIComponent(decodedValue)}`;

  const title = type === "category" ? decodedValue : `#${decodedValue}`;
  const eyebrow = type === "category" ? "Category" : "Tag";
  const description =
    type === "category"
      ? `${posts.length} posts filed under “${decodedValue}”`
      : `${posts.length} posts tagged with “${decodedValue}”`;

  return (
    <PageShell currentPath={currentPath} locale={locale}>
      <header className="mb-8 rounded-[1.9rem] border border-border/50 bg-card/55 p-6 shadow-[0_12px_40px_rgba(15,23,42,0.04)] backdrop-blur-sm md:mb-10 md:p-8" data-transition-layer="hero">
        <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
          <TransitionLink href={`/${locale}/blog`} className="transition-colors hover:text-foreground" transitionGroup="content">
            Blog
          </TransitionLink>
          <span>/</span>
          <span>{type === "category" ? "Categories" : "Tags"}</span>
        </div>
        <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">{eyebrow}</p>
        <h1 className="mb-3 text-3xl font-bold tracking-tight text-foreground md:text-4xl">{title}</h1>
        <p className="max-w-2xl text-base leading-7 text-muted-foreground md:text-lg">{description}</p>
      </header>

      <div data-transition-layer="content">
        <PostList locale={locale} posts={posts} />
      </div>
    </PageShell>
  );
}
