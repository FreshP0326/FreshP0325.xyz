import { type CSSProperties } from "react";
import { Mail, Music2, PenSquare } from "lucide-react";

import { PageShell } from "@/components/layout/page-shell";
import { TransitionLink } from "@/components/transition/transition-link";
import { siteConfig } from "@/config/site";

export const metadata = {
  title: `About - ${siteConfig.name}`,
  description: siteConfig.description,
};

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const quickLinks = [
    { label: "Biography", href: "/biography", icon: PenSquare, description: "Read the longer personal introduction." },
    { label: "Discography", href: "/discography", icon: Music2, description: "Browse releases, projects, and cover art." },
    { label: "Contact", href: "/contact", icon: Mail, description: "Get in touch for music, design, or collaboration." },
  ];

  return (
    <PageShell locale={locale}>
      <div className="mx-auto max-w-4xl space-y-8">
        <header className="rounded-[1.9rem] border border-border/50 bg-card/55 p-6 shadow-[0_12px_40px_rgba(15,23,42,0.04)] backdrop-blur-sm md:p-8" data-transition-layer="hero">
          <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">About</p>
          <h1 className="mb-3 text-4xl font-bold tracking-tight text-foreground">{siteConfig.author.name}</h1>
          <p className="mb-4 max-w-2xl text-base leading-7 text-muted-foreground md:text-lg">
            {siteConfig.description}
          </p>
          <p className="font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground">{siteConfig.author.role}</p>
        </header>

        <div className="grid gap-4 md:grid-cols-3" data-transition-layer="content">
          {quickLinks.map((item, index) => (
            <TransitionLink
              key={item.href}
              href={`/${locale}${item.href}`}
              className="group rounded-[1.5rem] border border-border/50 bg-card/55 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-[0_12px_30px_rgba(15,23,42,0.06)]"
              data-transition-stagger="true"
              data-transition-index={index}
              style={{ "--transition-index": index } as CSSProperties}
              transitionGroup="content"
            >
              <div className="mb-3 inline-flex rounded-full bg-primary/10 p-2 text-primary">
                <item.icon className="h-4 w-4" />
              </div>
              <h2 className="mb-2 text-lg font-semibold tracking-tight text-foreground transition-colors group-hover:text-primary">
                {item.label}
              </h2>
              <p className="text-sm leading-6 text-muted-foreground">{item.description}</p>
            </TransitionLink>
          ))}
        </div>

        <div className="mdx prose prose-neutral max-w-none dark:prose-invert prose-p:text-foreground/90 prose-p:leading-8 prose-a:text-primary prose-a:no-underline" data-transition-layer="content">
          <p>
            This site is a small, focused space for music, visuals, release notes, and longer-form thoughts.
            The design direction stays minimal and text-first, while keeping enough personality through motion,
            layout rhythm, and subtle card styling.
          </p>
          <p>
            If you want the more complete introduction, head to the biography page. If you are here for releases,
            the discography page is the best starting point. And if you want to collaborate, the contact page has the
            fastest ways to reach out.
          </p>
        </div>
      </div>
    </PageShell>
  );
}
