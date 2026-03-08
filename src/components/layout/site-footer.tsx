import React from "react";
import { ExternalLink, Rss, Twitter } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { siteConfig } from "@/config/site";

const BilibiliIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M2 10a4 4 0 0 1 4-4h12a4 4 0 0 1 4 4v7a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4v-7z" />
    <path d="M7 6l-2-3" />
    <path d="M17 6l2-3" />
    <path d="M9 13v2" />
    <path d="M15 13v2" />
  </svg>
);

const BandcampIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M0 18.75l7.437-13.5H24l-7.438 13.5H0z" />
  </svg>
);

const PixivIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12.288 0c-4.502 0-8.15 3.65-8.15 8.148 0 4.497 3.648 8.147 8.15 8.147 4.498 0 8.147-3.65 8.147-8.147 0-4.498-3.649-8.148-8.147-8.148zm0 14.372a6.223 6.223 0 1 1 0-12.446 6.223 6.223 0 0 1 0 12.446zM11.4 16.48v7.52h1.777v-7.52H11.4zm-5.184 0L4.444 24h1.866l1.772-7.52H6.216zm12.144 0l1.772 7.52h1.866L20.226 16.48h-1.866z" />
  </svg>
);

interface SiteFooterProps {
  locale: string;
}

export async function SiteFooter({ locale }: SiteFooterProps) {
  const t = await getTranslations({ locale, namespace: "Common" });

  const socials = [
    { name: "Bandcamp", url: siteConfig.author.links.bandcamp, icon: BandcampIcon },
    { name: "Twitter", url: siteConfig.author.links.twitter, icon: Twitter },
    { name: "Bilibili", url: siteConfig.author.links.bilibili, icon: BilibiliIcon },
    { name: "Pixiv", url: siteConfig.author.links.pixiv, icon: PixivIcon },
    { name: "Dizzylab", url: siteConfig.author.links.dizzylab, icon: ExternalLink },
    { name: t("rssFeedLabel"), url: siteConfig.links.rss, icon: Rss },
  ];

  return (
    <footer className="mx-auto mt-12 w-full max-w-[1440px] px-4 pb-8 md:px-6 md:pb-10">
      <div className="rounded-[1.9rem] border border-border/40 bg-card/45 px-6 py-6 text-sm text-muted-foreground shadow-[0_12px_32px_rgba(15,23,42,0.04)] backdrop-blur-sm md:px-8 md:py-7">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div className="space-y-3">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">Elsewhere</p>
              <p className="mt-1 text-lg font-semibold tracking-tight text-foreground">{siteConfig.author.name}</p>
            </div>
            <div className="flex flex-wrap gap-x-5 gap-y-2">
              {socials.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center gap-1.5 transition-colors hover:text-foreground"
                >
                  <social.icon className="h-4 w-4 opacity-70 transition-opacity group-hover:opacity-100" />
                  <span>{social.name}</span>
                </a>
              ))}
            </div>
          </div>

          <div className="space-y-1 text-left md:text-right">
            <p>© {new Date().getFullYear()} {siteConfig.author.name}. {t("allRightsReserved")}</p>
            <p className="text-[10px] uppercase tracking-[0.18em] opacity-70">Minimal Space</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
