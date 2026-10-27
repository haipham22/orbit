// i18n config — vi mặc định (giọng copy tiếng Việt đã khoá ở PRD), en phụ.
// Cookie-based (NEXT_LOCALE), không đổi URL — đúng tinh thần D2 (URL sạch).
export const locales = ["vi", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "vi";

export function isLocale(value: string | undefined): value is Locale {
  return !!value && (locales as readonly string[]).includes(value);
}
