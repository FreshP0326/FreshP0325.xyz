import { getTranslations } from "next-intl/server";

import { NotFoundState } from "@/components/layout/not-found-state";
import { routing } from "@/i18n/routing";

export default async function LocaleNotFound() {
  const locale = routing.defaultLocale;
  const t = await getTranslations({ locale, namespace: "Common" });

  return (
    <NotFoundState
      title={t("notFound")}
      description="The page you requested does not exist or is no longer available."
      href={`/${locale}`}
      actionLabel={t("backHome")}
    />
  );
}
