import React, { cache } from "react";

import { TransitionLink } from "@/components/transition/transition-link";
import { getAllPosts } from "@/lib/content";
import { cn } from "@/lib/utils";

const getArchives = cache((posts: any[]) => {
  return posts.reduce((acc, post) => {
    const year = new Date(post.date).getFullYear();
    if (!acc[year]) acc[year] = 0;
    acc[year]++;
    return acc;
  }, {} as Record<number, number>);
});

export function ArchiveList({ currentPath, locale }: { currentPath?: string; locale: string }) {
  const posts = getAllPosts();
  const archives = getArchives(posts);
  const years = Object.keys(archives)
    .map(Number)
    .sort((a, b) => b - a);

  return (
    <div className="sidebar-card space-y-3 p-5">
      <h3 className="px-1 text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">Archives</h3>
      <div className="space-y-1">
        {years.map((year, index) => {
          const href = `/blog/archive/${year}`;
          const isActive = currentPath === href;

          return (
            <TransitionLink
              key={year}
              href={`/${locale}${href}`}
              className={cn(
                "group flex items-center justify-between rounded-xl px-2.5 py-2 text-sm transition-colors hover:bg-muted/70",
                isActive && "bg-primary/10 text-foreground",
              )}
              data-transition-stagger="true"
              data-transition-index={index}
              style={{ "--transition-index": Math.min(index, 7) } as React.CSSProperties}
              transitionGroup="content"
            >
              <span className={cn("text-muted-foreground transition-colors group-hover:text-foreground", isActive && "text-foreground")}>
                {year}
              </span>
              <span className={cn("count-chip", isActive && "border-primary/20 bg-primary/10 text-primary")}>
                {archives[year]}
              </span>
            </TransitionLink>
          );
        })}
      </div>
    </div>
  );
}
