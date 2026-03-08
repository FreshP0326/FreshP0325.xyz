import React, { cache } from "react";

import { TransitionLink } from "@/components/transition/transition-link";
import { getAllPosts } from "@/lib/content";
import { cn } from "@/lib/utils";

const getCategoryStats = cache((posts: any[]) => {
  const categoryMap = new Map<string, number>();
  posts.forEach((post) => {
    post.categories?.forEach((category: string) => {
      categoryMap.set(category, (categoryMap.get(category) || 0) + 1);
    });
  });
  return Array.from(categoryMap.entries()).sort((a, b) => b[1] - a[1]);
});

export function CategoryList({ currentPath, locale }: { currentPath?: string; locale: string }) {
  const posts = getAllPosts();
  const categories = getCategoryStats(posts);
  const items = categories.map(([category, count]) => ({
    category,
    count,
    href: `/blog/categories/${encodeURIComponent(category)}`,
  }));

  return (
    <div className="sidebar-card space-y-3 p-5">
      <h3 className="px-1 text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
        Categories
      </h3>
      <div className="space-y-1">
        {items.map((item, index) => {
          const isActive = currentPath === item.href;

          return (
            <TransitionLink
              key={item.category}
              href={`/${locale}${item.href}`}
              className={cn(
                "group flex items-center justify-between rounded-xl px-2.5 py-2 text-sm transition-colors hover:bg-muted/70",
                isActive && "bg-primary/10 text-foreground",
              )}
              data-transition-stagger="true"
              data-transition-index={index}
              style={{ "--transition-index": Math.min(index, 7) } as React.CSSProperties}
              transitionGroup="content"
            >
              <span
                className={cn(
                  "truncate text-muted-foreground transition-colors group-hover:text-foreground",
                  isActive && "text-foreground",
                )}
              >
                {item.category}
              </span>
              <span className={cn("count-chip", isActive && "border-primary/20 bg-primary/10 text-primary")}>
                {item.count}
              </span>
            </TransitionLink>
          );
        })}
      </div>
    </div>
  );
}
