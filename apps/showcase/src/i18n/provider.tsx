import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useLanguage } from "@/lib/language/client";
import {
  getCachedLocale,
  hasCachedLocale,
  setCachedLocale,
} from "@/lib/language/locale-cache";
import { resolveInitialLanguage } from "@/lib/language/detect";
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
  ShowcaseTranslationKeys,
} from "@/i18n/locales/registry";

type ShowcaseTranslator = (
  path: ShowcaseTranslationKeys,
  params?: TranslationParams,
) => string;

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

const SHOWCASE_LOCALE_CACHE_NAMESPACE = "showcase";

export function ShowcaseLocaleProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { language } = useLanguage();
  const [loaded, setLoaded] = useState<
    Partial<Record<Language, ShowcaseLocale>>
  >(() => {
    const initialLanguage = resolveInitialLanguage();
    const cachedActive = getCachedLocale<ShowcaseLocale>(
      SHOWCASE_LOCALE_CACHE_NAMESPACE,
      initialLanguage,
    );

    return {
      en: SHOWCASE_FALLBACK_LOCALE,
      ...(cachedActive ? { [initialLanguage]: cachedActive } : {}),
    };
  });
  const [isReady, setIsReady] = useState(() => {
    const initialLanguage = resolveInitialLanguage();
    return (
      initialLanguage === "en" ||
      hasCachedLocale(SHOWCASE_LOCALE_CACHE_NAMESPACE, initialLanguage)
    );
  });

  useEffect(() => {
    let cancelled = false;

    const cachedActive = getCachedLocale<ShowcaseLocale>(
      SHOWCASE_LOCALE_CACHE_NAMESPACE,
      language,
    );

    if (cachedActive) {
      setLoaded((prev) => ({ ...prev, [language]: cachedActive }));
      setIsReady(true);
    } else {
      setIsReady(false);
    }

    async function load() {
      const [active, fallback] = await Promise.all([
        showcaseLocaleLoaders[language](),
        language === "en"
          ? Promise.resolve(SHOWCASE_FALLBACK_LOCALE)
          : showcaseLocaleLoaders.en(),
      ]);
      if (cancelled) return;
      setCachedLocale(SHOWCASE_LOCALE_CACHE_NAMESPACE, language, active);
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
