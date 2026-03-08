import { siteConfig } from "@/config/site";

import { TransitionLink } from "@/components/transition/transition-link";

interface SiteHeaderShellProps {
  homeHref?: string;
  children: React.ReactNode;
}

export function SiteHeaderShell({ homeHref = "/", children }: SiteHeaderShellProps) {
  return (
    <div className="sticky top-0 z-40 px-3 pt-3 md:px-4 md:pt-4">
      <header
        data-site-header
        data-scrolled="false"
        className="mx-auto flex max-w-[1440px] items-center justify-between rounded-[1.75rem] border border-transparent px-4 py-4 transition-all duration-300 md:px-6 md:py-5 data-[scrolled=true]:border-border/50 data-[scrolled=true]:bg-background/72 data-[scrolled=true]:py-3 data-[scrolled=true]:shadow-[0_16px_40px_rgba(15,23,42,0.06)] data-[scrolled=true]:backdrop-blur-xl"
      >
        <TransitionLink
          href={homeHref}
          className="font-semibold tracking-tight text-foreground transition-colors hover:text-muted-foreground"
          transitionGroup="page"
        >
          {siteConfig.name}
        </TransitionLink>
        {children}
      </header>
    </div>
  );
}
