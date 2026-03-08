import { type CSSProperties } from "react";
import { type Post } from "content-collections";

import { TransitionLink } from "@/components/transition/transition-link";

interface PostListProps {
  locale: string;
  posts: Post[];
}

export function PostList({ locale, posts }: PostListProps) {
  return (
    <ul className="flex flex-col gap-4">
      {posts.map((post, index) => {
        const visibleTags = post.tags.slice(0, 3);
        const remainingTags = post.tags.length - visibleTags.length;
        const primaryCategory = post.categories[0];

        return (
          <li
            key={post.slug}
            data-transition-stagger
            data-transition-index={index}
            style={{ "--transition-index": Math.min(index, 7) } as CSSProperties}
          >
            <article className="group rounded-[1.4rem] border border-border/60 bg-card/85 p-4 shadow-[0_1px_2px_rgba(15,23,42,0.03)] transition-colors duration-200 hover:border-primary/20 dark:shadow-[0_1px_2px_rgba(0,0,0,0.18)] md:p-5">
              <TransitionLink href={`/${locale}/blog/${post.slug}`} className="block space-y-3" transitionGroup="list">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-mono uppercase tracking-[0.14em] text-muted-foreground/80">
                  <time dateTime={post.date} className="tabular-nums text-muted-foreground">
                    {post.formattedDateShort}
                  </time>
                  <span className="text-muted-foreground/50">•</span>
                  <span>{post.readingTime}</span>
                  <span className="text-muted-foreground/50">•</span>
                  <span>{post.wordCount} words</span>
                </div>

                <div className="space-y-2">
                  <h3 className="font-display text-lg font-semibold tracking-tight text-foreground transition-colors group-hover:text-primary md:text-[1.2rem]">
                    {post.title}
                  </h3>
                  {post.summary && (
                    <p className="line-clamp-2 text-sm leading-6 text-muted-foreground/85">
                      {post.summary}
                    </p>
                  )}
                </div>
              </TransitionLink>

              {(primaryCategory || visibleTags.length > 0) && (
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  {primaryCategory && (
                    <TransitionLink
                      href={`/${locale}/blog/categories/${encodeURIComponent(primaryCategory)}`}
                      className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 text-[11px] font-medium text-primary transition-colors hover:bg-primary/20"
                      transitionGroup="content"
                    >
                      {primaryCategory}
                    </TransitionLink>
                  )}

                  {visibleTags.map((tag) => (
                    <TransitionLink
                      key={tag}
                      href={`/${locale}/blog/tags/${encodeURIComponent(tag)}`}
                      className="inline-flex items-center rounded-full border border-border/60 bg-secondary/60 px-2.5 py-1 text-[11px] font-medium text-muted-foreground transition-colors hover:border-primary/20 hover:text-foreground"
                      transitionGroup="content"
                    >
                      #{tag}
                    </TransitionLink>
                  ))}

                  {remainingTags > 0 && <span className="text-[11px] text-muted-foreground">+{remainingTags}</span>}
                </div>
              )}
            </article>
          </li>
        );
      })}
    </ul>
  );
}
