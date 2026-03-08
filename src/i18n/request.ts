import {getRequestConfig} from 'next-intl/server';
import {routing} from './routing';

export default getRequestConfig(async ({locale, requestLocale}) => {
  let resolvedLocale = locale;

  if (!resolvedLocale) {
    resolvedLocale = await requestLocale;
  }

  if (!resolvedLocale || !routing.locales.includes(resolvedLocale as any)) {
    resolvedLocale = routing.defaultLocale;
  }

  return {
    locale: resolvedLocale,
    messages: (await import(`../../messages/${resolvedLocale}.json`)).default
  };
});
