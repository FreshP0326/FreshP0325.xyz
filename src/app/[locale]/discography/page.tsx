import { type CSSProperties } from "react";
import Image from "next/image";
import { allDiscographies } from "content-collections";
import { getTranslations } from "next-intl/server";

import { PageShell } from "@/components/layout/page-shell";
import { TransitionLink } from "@/components/transition/transition-link";
import { siteConfig } from "@/config/site";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Navigation" });
  return {
    title: `${t("discography")} - ${siteConfig.name}`,
    description: `Music releases by ${siteConfig.name}`,
  };
}

export default async function DiscographyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Common" });
  const tNav = await getTranslations({ locale, namespace: "Navigation" });
  const albums = allDiscographies.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <PageShell locale={locale}>
      <header className="mb-8 rounded-[1.9rem] border border-border/50 bg-card/55 p-6 shadow-[0_12px_40px_rgba(15,23,42,0.04)] backdrop-blur-sm md:mb-10 md:p-8" data-transition-layer="hero">
        <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">Releases</p>
        <h1 className="mb-3 text-4xl font-bold tracking-tight text-foreground">{tNav("discography")}</h1>
        <p className="max-w-2xl text-base leading-7 text-muted-foreground md:text-lg">{t("discographyDescription")}</p>
      </header>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3" data-transition-layer="content">
        {albums.map((album, index) => (
          <TransitionLink
            key={album.slug}
            href={`/${locale}/discography/${album.slug}`}
            className="group block space-y-4 rounded-[1.6rem] border border-transparent p-2 transition-colors"
            data-transition-stagger="true"
            data-transition-index={index}
            style={{ "--transition-index": Math.min(index, 7) } as CSSProperties}
            transitionGroup="list"
          >
            <div className="relative aspect-square overflow-hidden rounded-[1.5rem] border border-border/50 bg-muted shadow-[0_8px_24px_rgba(15,23,42,0.04)] transition-all duration-300 group-hover:-translate-y-0.5 group-hover:border-primary/20 group-hover:shadow-[0_18px_40px_rgba(15,23,42,0.08)]">
              <Image
                src={album.cover}
                alt={album.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              />
            </div>
            <div className="space-y-1 px-1">
              <h3 className="line-clamp-1 text-lg font-semibold tracking-tight text-foreground transition-colors group-hover:text-primary">
                {album.title}
              </h3>
              <p className="font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">
                {new Date(album.date).getFullYear()}
              </p>
            </div>
          </TransitionLink>
        ))}
      </div>
    </PageShell>
  );
}
