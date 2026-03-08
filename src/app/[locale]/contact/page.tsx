import { type CSSProperties } from "react";
import { Mail, MessageCircle, MessageSquare } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { PageShell } from "@/components/layout/page-shell";
import { siteConfig } from "@/config/site";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Navigation" });
  return {
    title: `${t("contact")} - ${siteConfig.name}`,
  };
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Common" });
  const tNav = await getTranslations({ locale, namespace: "Navigation" });

  const contacts = [
    {
      label: "Email",
      value: siteConfig.author.email,
      href: `mailto:${siteConfig.author.email}`,
      icon: Mail,
    },
    {
      label: "QQ",
      value: "294727811",
      href: "tencent://AddContact/?fromId=45&fromSubId=1&subcmd=all&uin=294727811",
      icon: MessageSquare,
    },
    {
      label: "Discord",
      value: "FreshP0325",
      href: "https://discord.com/users/FreshP0325",
      icon: MessageCircle,
    },
  ];

  return (
    <PageShell className="py-8 md:py-16" locale={locale}>
      <div className="mx-auto max-w-3xl space-y-8">
        <header className="rounded-[1.9rem] border border-border/50 bg-card/55 p-6 shadow-[0_12px_40px_rgba(15,23,42,0.04)] backdrop-blur-sm md:p-8" data-transition-layer="hero">
          <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">Connect</p>
          <h1 className="mb-3 text-4xl font-bold tracking-tight text-foreground">{tNav("contact")}</h1>
          <p className="max-w-2xl text-base leading-7 text-muted-foreground md:text-lg">{t("contactDescription")}</p>
        </header>

        <div className="grid gap-4" data-transition-layer="content">
          {contacts.map((contact, index) => (
            <a
              key={contact.label}
              href={contact.href}
              target={contact.href.startsWith("http") ? "_blank" : undefined}
              rel={contact.href.startsWith("http") ? "noreferrer" : undefined}
              className="group flex items-center gap-4 rounded-[1.5rem] border border-border/50 bg-card/55 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-[0_12px_30px_rgba(15,23,42,0.06)] md:p-6"
              data-transition-stagger="true"
              data-transition-index={index}
              style={{ "--transition-index": index } as CSSProperties}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-[1rem] bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-105">
                <contact.icon className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                  {contact.label}
                </p>
                <p className="truncate text-lg font-medium text-foreground md:text-xl">{contact.value}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </PageShell>
  );
}
