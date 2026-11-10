import { getTranslations } from "next-intl/server";

import { NotFoundState } from "@/components/layout/not-found-state";
import { routing } from "@/i18n/routing";

export default async function LocaleNotFound() {
  // next-intl not-found.tsx cannot access params directly;
  // fall back to defaultLocale but use the translated description key.
  const locale = routing.defaultLocale;
  const t = await getTranslations({ locale, namespace: "Common" });

  return (
    <NotFoundState
      title={t("notFound")}
      description={t("notFoundDescription")}
      href={`/${locale}`}
      actionLabel={t("backHome")}
    />
  );
}
