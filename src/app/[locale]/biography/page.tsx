import Image from "next/image";
import { Mail, Music2 } from "lucide-react";
import { allBiographies } from "content-collections";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";

import { ContentMdx } from "@/components/blog/post-mdx-components";
import { PageShell } from "@/components/layout/page-shell";
import { siteConfig } from "@/config/site";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Navigation" });

  return {
    title: `${t("biography")} - ${siteConfig.name}`,
    description: siteConfig.description,
  };
}

export default async function BiographyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const navigationT = await getTranslations({ locale, namespace: "Navigation" });

  const bio = allBiographies.find((entry) => entry.locale === locale) || allBiographies.find((entry) => entry.locale === "zh");

  if (!bio) {
    notFound();
  }

  return (
    <PageShell className="py-10 md:py-14" locale={locale}>
      <article className="mx-auto max-w-4xl space-y-10">
        <header className="overflow-hidden rounded-[2rem] border border-border/50 bg-card/60 p-6 shadow-[0_16px_50px_rgba(15,23,42,0.05)] backdrop-blur-sm md:p-8" data-transition-layer="hero">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:gap-8">
            <div className="relative h-24 w-24 overflow-hidden rounded-[1.5rem] border border-border/60 bg-muted/60 p-1.5 md:h-28 md:w-28">
              <div className="relative h-full w-full overflow-hidden rounded-[1.15rem]">
                <Image
                  src={siteConfig.author.avatar}
                  alt={siteConfig.author.name}
                  fill
                  sizes="112px"
                  className="object-cover"
                  priority
                />
              </div>
            </div>

            <div className="min-w-0 flex-1 space-y-3">
              <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
                {navigationT("biography")}
              </p>
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">{siteConfig.author.name}</h1>
                <p className="font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground">{siteConfig.author.role}</p>
              </div>
              <p className="max-w-2xl text-sm leading-7 text-muted-foreground md:text-base">
                {siteConfig.description}
              </p>
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="inline-flex items-center gap-1 rounded-full border border-border/60 bg-muted/50 px-3 py-1 text-xs text-muted-foreground">
                  <Music2 className="h-3.5 w-3.5" />
                  {siteConfig.author.role}
                </span>
                <a
                  href={`mailto:${siteConfig.author.email}`}
                  className="inline-flex items-center gap-1 rounded-full border border-border/60 bg-muted/50 px-3 py-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Mail className="h-3.5 w-3.5" />
                  {siteConfig.author.email}
                </a>
              </div>
            </div>
          </div>
        </header>

        <div className="mdx prose prose-neutral max-w-none dark:prose-invert prose-h1:text-5xl prose-h1:tracking-tighter prose-h2:text-3xl prose-h2:tracking-tight prose-hr:my-16" data-transition-layer="content">
          <ContentMdx code={bio.mdx} />
        </div>
      </article>
    </PageShell>
  );
}
