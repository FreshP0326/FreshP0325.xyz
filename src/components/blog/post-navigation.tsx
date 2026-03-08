import { type CSSProperties } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { TransitionLink } from "@/components/transition/transition-link";
import { type Post } from "@/types";

interface PostNavigationProps {
  locale: string;
  prevPost?: Post;
  nextPost?: Post;
}

function NavCard({
  locale,
  post,
  direction,
}: {
  locale: string;
  post: Post;
  direction: "prev" | "next";
}) {
  const isPrev = direction === "prev";

  return (
    <TransitionLink
      href={`/${locale}/blog/${post.slug}`}
      className={`group flex min-h-32 flex-col justify-between rounded-[1.5rem] border border-border/50 bg-card/70 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-[0_12px_30px_rgba(15,23,42,0.06)] ${isPrev ? "text-left" : "text-right"}`}
      transitionGroup="content"
    >
      <div className={`flex items-center gap-1 text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground ${isPrev ? "justify-start" : "justify-end"}`}>
        {isPrev ? <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" /> : null}
        <span>{isPrev ? "Previous Post" : "Next Post"}</span>
        {!isPrev ? <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /> : null}
      </div>

      <div className="space-y-2">
        <p className={`text-xs font-mono uppercase tracking-[0.14em] text-muted-foreground ${isPrev ? "text-left" : "text-right"}`}>
          {post.formattedDateShort}
        </p>
        <p className="line-clamp-2 text-base font-semibold tracking-tight text-foreground transition-colors group-hover:text-primary">
          {post.title}
        </p>
      </div>
    </TransitionLink>
  );
}

export function PostNavigation({ locale, prevPost, nextPost }: PostNavigationProps) {
  if (!prevPost && !nextPost) return null;

  return (
    <nav className="mt-16 border-t border-border/40 pt-8" aria-label="Post navigation" data-transition-layer="content">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div data-transition-stagger data-transition-index={0} style={{ "--transition-index": 0 } as CSSProperties}>
          {prevPost ? <NavCard locale={locale} post={prevPost} direction="prev" /> : <div className="hidden sm:block" />}
        </div>
        <div data-transition-stagger data-transition-index={1} style={{ "--transition-index": 1 } as CSSProperties}>
          {nextPost ? <NavCard locale={locale} post={nextPost} direction="next" /> : <div className="hidden sm:block" />}
        </div>
      </div>
    </nav>
  );
}
