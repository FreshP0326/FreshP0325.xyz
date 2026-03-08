import React from "react";

import { Badge } from "@/components/ui/badge";
import { TransitionLink } from "@/components/transition/transition-link";
import { getAllTagsWithCount } from "@/lib/content";
import { cn } from "@/lib/utils";

export function TagCloud({ currentPath, locale }: { currentPath?: string; locale: string }) {
  const tags = getAllTagsWithCount();
  const items = tags.map(({ tag, count }) => ({
    tag,
    count,
    href: `/blog/tags/${encodeURIComponent(tag)}`,
  }));

  return (
    <div className="sidebar-card space-y-3 p-5">
      <h3 className="px-1 text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">Tags</h3>
      <div className="flex flex-wrap gap-2">
        {items.map((item, index) => {
          const isActive = currentPath === item.href;

          return (
            <TransitionLink
              key={item.tag}
              href={`/${locale}${item.href}`}
              data-transition-stagger="true"
              data-transition-index={index}
              style={{ "--transition-index": Math.min(index, 7) } as React.CSSProperties}
              transitionGroup="content"
            >
              <Badge
                variant="secondary"
                className={cn(
                  "rounded-xl border border-transparent bg-secondary/70 px-2.5 py-1 font-normal text-muted-foreground transition-colors hover:border-primary/20 hover:bg-primary/10 hover:text-foreground",
                  isActive && "border-primary/20 bg-primary/10 text-foreground",
                )}
              >
                #{item.tag}
                <span className="ml-1 text-[10px] opacity-50">{item.count}</span>
              </Badge>
            </TransitionLink>
          );
        })}
      </div>
    </div>
  );
}
