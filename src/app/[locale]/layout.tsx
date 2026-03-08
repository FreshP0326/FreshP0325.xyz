import { type Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { RouteTransitionOverlay } from "@/components/transition/route-transition-overlay";
import { ThemeProvider } from "@/components/theme-provider";
import { siteConfig } from "@/config/site";
import { routing } from "@/i18n/routing";

export const metadata: Metadata = {
  title: siteConfig.title,
  description: siteConfig.description,
  icons: [{ rel: "icon", url: "/avatar.png" }],
};

export const dynamicParams = false;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden bg-background font-sans text-foreground antialiased selection:bg-primary/30">
      <div className="fixed inset-0 -z-50 pointer-events-none overflow-hidden opacity-[0.15] dark:opacity-10">
        <div className="absolute left-[-10%] top-[-10%] h-[40%] w-[40%] rounded-full bg-primary/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] h-[40%] w-[40%] rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808006_1px,transparent_1px),linear-gradient(to_bottom,#80808006_1px,transparent_1px)] bg-[size:40px_40px]" />
        <div className="absolute left-10 top-10 text-[10px] font-mono opacity-20">+</div>
        <div className="absolute right-10 top-10 text-[10px] font-mono opacity-20">+</div>
        <div className="absolute bottom-10 left-10 text-[10px] font-mono opacity-20">+</div>
        <div className="absolute bottom-10 right-10 text-[10px] font-mono opacity-20">+</div>
      </div>

      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        <div className="relative flex min-h-screen flex-col">
          <RouteTransitionOverlay />
          <SiteHeader locale={locale} />
          <main className="relative z-10 flex-1">{children}</main>
          <SiteFooter locale={locale} />
        </div>
      </ThemeProvider>
    </div>
  );
}
