import en from "@/i18n/locales/en.json";
import type { LeafKeyOf, NestedTypeOf } from "@/lib/language/types";

export type ShowcaseLocale = NestedTypeOf<typeof en>;
export type ShowcaseTranslationKeys = LeafKeyOf<typeof en>;

export const SHOWCASE_FALLBACK_LOCALE = en as ShowcaseLocale;

export const showcaseLocaleLoaders = {
  en: async () => SHOWCASE_FALLBACK_LOCALE,
  fa: async () =>
    (await import("@/i18n/locales/fa.json")).default as ShowcaseLocale,
  ar: async () =>
    (await import("@/i18n/locales/ar.json")).default as ShowcaseLocale,
} as const;
