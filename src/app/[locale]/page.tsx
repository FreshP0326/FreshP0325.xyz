import { getTranslations } from "next-intl/server";

import { HomeLanding } from "@/components/home/home-landing";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Navigation" });

  return (
    <HomeLanding
      clickToEnterLabel="Click to Enter"
      menuItems={[
        { label: t("biography"), href: `/${locale}/biography` },
        { label: t("discography"), href: `/${locale}/discography` },
        { label: t("blog"), href: `/${locale}/blog` },
        { label: t("contact"), href: `/${locale}/contact` },
      ]}
    />
  );
}
