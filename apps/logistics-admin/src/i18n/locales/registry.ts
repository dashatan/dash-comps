import en from "@/i18n/locales/en.json";
import type { LeafKeyOf, NestedTypeOf } from "@/lib/language/types";

export type LogisticsLocale = NestedTypeOf<typeof en>;
export type LogisticsTranslationKeys = LeafKeyOf<typeof en>;

export const LOGISTICS_FALLBACK_LOCALE = en as LogisticsLocale;

export const logisticsLocaleLoaders = {
  en: async () => LOGISTICS_FALLBACK_LOCALE,
  fa: async () =>
    (await import("@/i18n/locales/fa.json")).default as LogisticsLocale,
  ar: async () =>
    (await import("@/i18n/locales/ar.json")).default as LogisticsLocale,
} as const;
