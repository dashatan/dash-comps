import en from "@/lib/language/locales/en.json";
import type { Language } from "../utils";
import type { LocaleSchema } from "./schema";

export const FALLBACK_LOCALE = en as LocaleSchema;

export const localeLoaders: Record<Language, () => Promise<LocaleSchema>> = {
  en: async () => FALLBACK_LOCALE,
  fa: async () =>
    (await import("@/lib/language/locales/fa.json")).default as LocaleSchema,
  ar: async () =>
    (await import("@/lib/language/locales/ar.json")).default as LocaleSchema,
};

export async function loadLocale(language: Language): Promise<LocaleSchema> {
  return localeLoaders[language]();
}

export async function loadAllLocales(): Promise<
  Record<Language, LocaleSchema>
> {
  const entries = await Promise.all(
    (Object.keys(localeLoaders) as Language[]).map(
      async (lang) => [lang, await localeLoaders[lang]()] as const,
    ),
  );
  return Object.fromEntries(entries) as Record<Language, LocaleSchema>;
}
