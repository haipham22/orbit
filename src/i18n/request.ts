import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";
import { defaultLocale, isLocale, type Locale } from "./config";

// next-intl không-routing: locale từ cookie NEXT_LOCALE, fallback vi.
// Không đụng proxy.ts (auth) — không thêm matcher.
export default getRequestConfig(async () => {
  const store = await cookies();
  const cookieLocale = store.get("NEXT_LOCALE")?.value;
  const locale: Locale = isLocale(cookieLocale) ? cookieLocale : defaultLocale;
  return { locale, messages: (await import(`../messages/${locale}.json`)).default };
});
