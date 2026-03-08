import React from "react";

import { cn } from "@/lib/utils";

import { ArchiveList } from "./archive-list";
import { CategoryList } from "./category-list";
import { ProfileCard } from "./profile-card";
import { TagCloud } from "./tag-cloud";

interface PageShellProps extends React.HTMLAttributes<HTMLDivElement> {
  currentPath?: string;
  locale: string;
}

export function PageShell({ children, className, currentPath, locale, ...props }: PageShellProps) {
  const sidebarContent = (
    <>
      <CategoryList currentPath={currentPath} locale={locale} />
      <TagCloud currentPath={currentPath} locale={locale} />
      <ArchiveList currentPath={currentPath} locale={locale} />
    </>
  );

  return (
    <div className={cn("mx-auto max-w-[1440px] px-4 py-6 md:px-8 md:py-12", className)} {...props}>
      <div className="space-y-6 lg:hidden" data-transition-stagger data-transition-index={0} style={{ "--transition-index": 0 } as React.CSSProperties}>
        <ProfileCard locale={locale} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:mt-0 lg:grid-cols-[290px_minmax(0,1fr)] lg:gap-8 xl:gap-10">
        <aside className="hidden lg:block">
          <div className="sticky top-24 flex h-[calc(100vh-7.5rem)] flex-col gap-6">
            <div className="shrink-0" data-transition-stagger data-transition-index={0} style={{ "--transition-index": 0 } as React.CSSProperties}>
              <ProfileCard locale={locale} />
            </div>
            <div className="sidebar-scroll flex min-h-0 flex-1 flex-col gap-6 pr-2" data-transition-stagger data-transition-index={1} style={{ "--transition-index": 1 } as React.CSSProperties}>
              {sidebarContent}
            </div>
          </div>
        </aside>

        <main className="min-w-0 space-y-6">
          <div className="content-panel p-6 md:p-10 xl:p-12">
            {children}
          </div>

          <div className="flex flex-col gap-4 lg:hidden" data-transition-stagger data-transition-index={2} style={{ "--transition-index": 2 } as React.CSSProperties}>
            {sidebarContent}
          </div>
        </main>
      </div>
    </div>
  );
}
