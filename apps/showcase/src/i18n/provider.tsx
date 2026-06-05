import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useLanguage } from "@/lib/language/client";
import {
  formatTranslation,
  type TranslationParams,
} from "@/lib/language/plural";
import { getNestedValue } from "@/lib/utils/cn";
import type { Language } from "@/lib/language/utils";
import {
  showcaseLocaleLoaders,
  SHOWCASE_FALLBACK_LOCALE,
  ShowcaseLocale,
} from "@/i18n/locales/registry";

type ShowcaseTranslator = (path: string, params?: TranslationParams) => string;

type ShowcaseLocaleContextValue = {
  t: ShowcaseTranslator;
  isReady: boolean;
};

const ShowcaseLocaleContext = createContext<
  ShowcaseLocaleContextValue | undefined
>(undefined);

function createShowcaseTranslator(
  language: Language,
  dictionary: ShowcaseLocale,
  fallback: ShowcaseLocale = SHOWCASE_FALLBACK_LOCALE,
): ShowcaseTranslator {
  return (path, params) => {
    const raw =
      getNestedValue(dictionary, path) ?? getNestedValue(fallback, path) ?? "";
    const template = typeof raw === "string" ? raw : String(raw ?? "");
    return formatTranslation(template, language, params);
  };
}

export function ShowcaseLocaleProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { language } = useLanguage();
  const [loaded, setLoaded] = useState<
    Partial<Record<Language, ShowcaseLocale>>
  >({
    en: SHOWCASE_FALLBACK_LOCALE,
  });
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setIsReady(false);

    async function load() {
      const [active, fallback] = await Promise.all([
        showcaseLocaleLoaders[language](),
        language === "en"
          ? Promise.resolve(SHOWCASE_FALLBACK_LOCALE)
          : showcaseLocaleLoaders.en(),
      ]);
      if (cancelled) return;
      setLoaded((prev) => ({ ...prev, en: fallback, [language]: active }));
      setIsReady(true);
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [language]);

  const dictionary = loaded[language] ?? SHOWCASE_FALLBACK_LOCALE;
  const t = useMemo(
    () =>
      createShowcaseTranslator(
        language,
        dictionary,
        loaded.en ?? SHOWCASE_FALLBACK_LOCALE,
      ),
    [language, dictionary, loaded.en],
  );

  return (
    <ShowcaseLocaleContext.Provider value={{ t, isReady }}>
      {children}
    </ShowcaseLocaleContext.Provider>
  );
}

export function useShowcaseLocale(): ShowcaseLocaleContextValue {
  const ctx = useContext(ShowcaseLocaleContext);
  if (!ctx) {
    throw new Error(
      "useShowcaseLocale must be used within ShowcaseLocaleProvider",
    );
  }
  return ctx;
}
