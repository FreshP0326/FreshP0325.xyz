import { type CSSProperties } from "react";
import Image from "next/image";
import { allDiscographies } from "content-collections";
import { CalendarDays, Disc3, ExternalLink, Music2 } from "lucide-react";
import { notFound } from "next/navigation";

import { Mdx } from "@/components/blog/mdx-components";
import { PageShell } from "@/components/layout/page-shell";
import { siteConfig } from "@/config/site";
import { routing } from "@/i18n/routing";

export const dynamicParams = false;

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    allDiscographies.map((album) => ({
      locale,
      slug: album.slug,
    })),
  );
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const resolvedParams = await params;
  const album = allDiscographies.find((entry) => entry.slug === resolvedParams.slug);
  if (!album) return {};

  return {
    title: `${album.title} - Discography - ${siteConfig.name}`,
    description: album.summary,
  };
}

export default async function AlbumPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const resolvedParams = await params;
  const { locale } = resolvedParams;
  const album = allDiscographies.find((entry) => entry.slug === resolvedParams.slug);

  if (!album) {
    notFound();
  }

  const releaseDate = album.formattedDateLong;

  return (
    <PageShell className="py-8 md:py-12" locale={locale}>
      <article className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
        <aside
          className="self-start lg:col-span-4 lg:sticky lg:top-24 lg:max-h-[calc(100vh-8rem)] lg:space-y-5 lg:overflow-y-auto lg:pr-2"
          data-transition-stagger
          data-transition-index={0}
          style={{ "--transition-index": 0 } as CSSProperties}
        >
          <div className="relative aspect-square overflow-hidden rounded-[1.9rem] border border-border/50 bg-card shadow-[0_18px_40px_rgba(15,23,42,0.06)]">
            <Image src={album.cover} alt={album.title} fill className="object-cover" priority />
          </div>

          <div className="sidebar-card space-y-4 p-5">
            <h2 className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">Release Info</h2>

            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <CalendarDays className="h-4 w-4" />
                <span className="font-mono tabular-nums">{releaseDate}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Disc3 className="h-4 w-4" />
                <span>{album.tracks?.length ?? 0} Tracks</span>
              </div>
            </div>

            {album.links && album.links.length > 0 && (
              <div className="space-y-2 pt-1">
                {album.links.map((link) => (
                  <a
                    key={link.url}
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between rounded-xl border border-border/50 bg-muted/30 px-4 py-3 text-sm font-medium transition-colors hover:border-primary/20 hover:bg-muted/60"
                  >
                    <span>{link.label}</span>
                    <ExternalLink className="h-4 w-4 text-muted-foreground" />
                  </a>
                ))}
              </div>
            )}
          </div>

          {album.credits && album.credits.length > 0 && (
            <section className="sidebar-card p-5">
              <h3 className="mb-4 flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
                <Music2 className="h-4 w-4" />
                Credits
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {album.credits.map((credit) => {
                  const parts = credit.split(/(\*\*.*?\*\*)/g);
                  return (
                    <li key={credit} className="rounded-xl bg-muted/25 px-3 py-2.5 leading-relaxed">
                      {parts.map((part, index) =>
                        part.startsWith("**") && part.endsWith("**") ? (
                          <strong key={index} className="font-semibold text-foreground">
                            {part.slice(2, -2)}
                          </strong>
                        ) : (
                          part
                        ),
                      )}
                    </li>
                  );
                })}
              </ul>
            </section>
          )}
        </aside>

        <div className="min-w-0 lg:col-span-8">
          <header className="mb-8 rounded-[1.9rem] border border-border/50 bg-card/55 p-6 shadow-[0_12px_40px_rgba(15,23,42,0.04)] backdrop-blur-sm md:mb-10 md:p-8" data-transition-layer="hero">
            <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">Discography</p>
            <h1 className="mb-3 text-3xl font-bold tracking-tight text-foreground md:text-5xl md:leading-tight">{album.title}</h1>
            {album.summary && <p className="max-w-3xl text-base leading-7 text-muted-foreground md:text-lg">{album.summary}</p>}
          </header>

          <section className="mdx prose prose-neutral max-w-none dark:prose-invert prose-headings:scroll-mt-28 prose-headings:font-semibold prose-headings:tracking-tight prose-p:text-foreground/90 prose-p:leading-8 prose-a:text-primary prose-a:no-underline prose-strong:text-foreground prose-li:leading-8 prose-blockquote:border-primary/20 prose-blockquote:bg-muted/30 prose-blockquote:px-5 prose-blockquote:py-3 prose-blockquote:not-italic prose-hr:border-border/60 prose-img:rounded-[1.4rem] prose-img:border prose-img:border-border/50 prose-img:shadow-[0_16px_40px_rgba(15,23,42,0.06)]" data-transition-layer="content">
            <Mdx code={album.mdx} />
          </section>
        </div>
      </article>
    </PageShell>
  );
}
