import { getTranslations } from "next-intl/server";

import { SiteHeaderControls } from "@/components/layout/site-header-controls";
import { SiteHeaderShell } from "@/components/layout/site-header-shell";

interface SiteHeaderProps {
  locale: string;
}

export async function SiteHeader({ locale }: SiteHeaderProps) {
  const tNavigation = await getTranslations({ locale, namespace: "Navigation" });
  const tCommon = await getTranslations({ locale, namespace: "Common" });

  const navItems = [
    { label: tNavigation("biography"), href: "/biography" },
    { label: tNavigation("discography"), href: "/discography" },
    { label: tNavigation("blog"), href: "/blog" },
    { label: tNavigation("contact"), href: "/contact" },
  ];

  return (
    <SiteHeaderShell homeHref={`/${locale}`}>
      <SiteHeaderControls
        currentLocale={locale}
        languageLabel={tCommon("language")}
        localeLabels={{
          zh: "中文",
          en: "English",
          ja: "日本語",
        }}
        navItems={navItems}
        searchLabel={tCommon("search")}
        themeLabel={tCommon("theme")}
        themeModeLabels={{
          light: tCommon("light"),
          dark: tCommon("dark"),
          system: tCommon("system"),
        }}
      />
    </SiteHeaderShell>
  );
}
