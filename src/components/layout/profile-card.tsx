import React from "react";
import { Mail, Twitter } from "lucide-react";
import Image from "next/image";

import { TransitionLink } from "@/components/transition/transition-link";
import { siteConfig } from "@/config/site";

export function ProfileCard({ locale }: { locale: string }) {
  const biographyHref = `/${locale}/biography`;

  return (
    <div className="sidebar-card relative flex flex-col items-center space-y-4 overflow-hidden p-5 text-center sm:p-6">
      <TransitionLink
        href={biographyHref}
        className="group/avatar relative block rounded-[1.35rem] focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        aria-label={`View ${siteConfig.author.name} biography`}
      >
        <div className="relative h-24 w-24 overflow-hidden rounded-[1.35rem] border border-border/60 bg-muted/70 p-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] transition-all duration-300 group-hover/avatar:border-primary/40 group-hover/avatar:bg-muted group-hover/avatar:shadow-md dark:shadow-none">
          <div className="relative h-full w-full overflow-hidden rounded-[1rem]">
            <Image
              src={siteConfig.author.avatar}
              alt={siteConfig.author.name}
              fill
              sizes="96px"
              className="object-cover transition-transform duration-500 group-hover/avatar:scale-[1.035]"
              priority
            />
          </div>
        </div>
      </TransitionLink>

      <div className="space-y-1.5">
        <h2 className="font-display text-lg font-bold tracking-tight uppercase sm:text-xl">
          <TransitionLink href={biographyHref} className="transition-colors hover:text-primary">
            {siteConfig.author.name}
          </TransitionLink>
        </h2>
        <p className="font-mono text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground">
          {siteConfig.author.role}
        </p>
      </div>

      <div className="flex gap-3 pt-1">
        <a
          href={siteConfig.author.links.twitter}
          className="rounded-full p-1 text-muted-foreground transition-colors hover:text-foreground"
          target="_blank"
          rel="noreferrer"
        >
          <Twitter className="h-5 w-5" />
        </a>
        <a
          href={siteConfig.author.links.bandcamp}
          className="rounded-full p-1 text-muted-foreground transition-colors hover:text-foreground"
          target="_blank"
          rel="noreferrer"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
            <path d="M0 18.75l7.437-13.5H24l-7.438 13.5H0z" />
          </svg>
        </a>
        <a
          href={siteConfig.author.links.pixiv}
          className="rounded-full p-1 text-muted-foreground transition-colors hover:text-foreground"
          target="_blank"
          rel="noreferrer"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
            <path d="M12.187 2.186c-4.204 0-7.613 3.41-7.613 7.613 0 4.203 3.41 7.613 7.613 7.613 4.203 0 7.613-3.41 7.613-7.613 0-4.204-3.41-7.613-7.613-7.613zm0 13.444c-3.22 0-5.831-2.61-5.831-5.831 0-3.22 2.61-5.831 5.831-5.831 3.22 0 5.831 2.61 5.831 5.831 0 3.22-2.61 5.831-5.831 5.831zM11.301 17.412v4.402h1.772v-4.402h-1.772zM6.438 17.412l-1.534 4.402h1.865l1.534-4.402H6.438zm11.498 0l1.534 4.402h-1.865l-1.534-4.402h1.865z" />
          </svg>
        </a>
        <a
          href={`mailto:${siteConfig.author.email}`}
          className="rounded-full p-1 text-muted-foreground transition-colors hover:text-foreground"
        >
          <Mail className="h-5 w-5" />
        </a>
      </div>
    </div>
  );
}
