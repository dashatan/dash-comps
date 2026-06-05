import fa from "@/lib/language/locales/fa.json";
import en from "@/lib/language/locales/en.json";
import ar from "@/lib/language/locales/ar.json";
import { defineTranslations } from "./define-translations";

export type {
  LocaleSchema,
  TranslationKeys,
  TranslationType,
} from "./schema";

export {
  FALLBACK_LOCALE,
  localeLoaders,
  loadAllLocales,
  loadLocale,
} from "./registry";

export { defineTranslations } from "./define-translations";

/** Eager bundle — use on server or tooling; client apps should prefer `localeLoaders`. */
export const translations = defineTranslations({ en, fa, ar });
