import { useLanguage } from "@dash/core";
import type { TranslationKeys } from "@dash/core/language/locales";
import type { TranslationParams } from "@dash/core";
import type { LogisticsTranslationKeys } from "@/i18n/locales/registry";

export type AppTranslationKeys = TranslationKeys | LogisticsTranslationKeys;

export function useAppLanguage() {
  const ctx = useLanguage();
  return {
    ...ctx,
    t: ctx.t as (key: AppTranslationKeys, params?: TranslationParams) => string,
  };
}
