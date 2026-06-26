import { mergeLocales, localeLoaders as coreLoaders } from "@dash/core";
import type { LeafKeyOf, NestedTypeOf } from "@dash/core/language/types";
import coreEn from "@dash/core/language/locales/en.json";
import appEn from "@/i18n/locales/en.json";

export type LogisticsLocale = NestedTypeOf<typeof appEn>;
export type LogisticsTranslationKeys = LeafKeyOf<typeof appEn>;

export const LOGISTICS_FALLBACK_LOCALE = mergeLocales(coreEn, appEn);

export const logisticsLocaleLoaders = {
  en: async () => LOGISTICS_FALLBACK_LOCALE,
  fa: async () =>
    mergeLocales(
      await coreLoaders.fa(),
      (await import("@/i18n/locales/fa.json")).default,
    ),
  ar: async () =>
    mergeLocales(
      await coreLoaders.ar(),
      (await import("@/i18n/locales/ar.json")).default,
    ),
} as const;
