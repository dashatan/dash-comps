import { useLanguage } from "@/lib/language/client";
import type { SupportedLanguages } from "@/lib/language/utils";
import { ar } from "@/i18n/locales/ar";
import { en } from "@/i18n/locales/en";
import type { ShowcaseMessages } from "@/i18n/locales/en";
import { fa } from "@/i18n/locales/fa";

const messages: Record<SupportedLanguages, ShowcaseMessages> = { en, fa, ar };

export type { ShowcaseMessages };

export function useShowcaseI18n() {
  const { language, setLanguage } = useLanguage();
  const t = messages[language as SupportedLanguages] ?? messages.en;
  return { t, language, setLanguage };
}
