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
  logisticsLocaleLoaders,
  LOGISTICS_FALLBACK_LOCALE,
  type LogisticsLocale,
  type LogisticsTranslationKeys,
} from "@/i18n/locales/registry";

type LogisticsTranslator = (
  path: LogisticsTranslationKeys,
  params?: TranslationParams,
) => string;

type LogisticsLocaleContextValue = {
  t: LogisticsTranslator;
  isReady: boolean;
};

const LogisticsLocaleContext = createContext<
  LogisticsLocaleContextValue | undefined
>(undefined);

function createLogisticsTranslator(
  language: Language,
  dictionary: LogisticsLocale,
  fallback: LogisticsLocale = LOGISTICS_FALLBACK_LOCALE,
): LogisticsTranslator {
  return (path, params) => {
    const raw =
      getNestedValue(dictionary, path) ?? getNestedValue(fallback, path) ?? "";
    const template = typeof raw === "string" ? raw : String(raw ?? "");
    return formatTranslation(template, language, params);
  };
}

const LOGISTICS_LOCALE_CACHE_NAMESPACE = "logistics-admin";

export function LogisticsLocaleProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { language } = useLanguage();
  const [loaded, setLoaded] = useState<
    Partial<Record<Language, LogisticsLocale>>
  >(() => {
    const initialLanguage = resolveInitialLanguage();
    const cachedActive = getCachedLocale<LogisticsLocale>(
      LOGISTICS_LOCALE_CACHE_NAMESPACE,
      initialLanguage,
    );

    return {
      en: LOGISTICS_FALLBACK_LOCALE,
      ...(cachedActive ? { [initialLanguage]: cachedActive } : {}),
    };
  });
  const [isReady, setIsReady] = useState(() => {
    const initialLanguage = resolveInitialLanguage();
    return (
      initialLanguage === "en" ||
      hasCachedLocale(LOGISTICS_LOCALE_CACHE_NAMESPACE, initialLanguage)
    );
  });

  useEffect(() => {
    let cancelled = false;

    const cachedActive = getCachedLocale<LogisticsLocale>(
      LOGISTICS_LOCALE_CACHE_NAMESPACE,
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
        logisticsLocaleLoaders[language](),
        language === "en"
          ? Promise.resolve(LOGISTICS_FALLBACK_LOCALE)
          : logisticsLocaleLoaders.en(),
      ]);
      if (cancelled) return;
      setCachedLocale(LOGISTICS_LOCALE_CACHE_NAMESPACE, language, active);
      setLoaded((prev) => ({ ...prev, en: fallback, [language]: active }));
      setIsReady(true);
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [language]);

  const dictionary = loaded[language] ?? LOGISTICS_FALLBACK_LOCALE;
  const t = useMemo(
    () =>
      createLogisticsTranslator(
        language,
        dictionary,
        loaded.en ?? LOGISTICS_FALLBACK_LOCALE,
      ),
    [language, dictionary, loaded.en],
  );

  return (
    <LogisticsLocaleContext.Provider value={{ t, isReady }}>
      {children}
    </LogisticsLocaleContext.Provider>
  );
}

export function useLogisticsLocale(): LogisticsLocaleContextValue {
  const ctx = useContext(LogisticsLocaleContext);
  if (!ctx) {
    throw new Error(
      "useLogisticsLocale must be used within LogisticsLocaleProvider",
    );
  }
  return ctx;
}

export function useLogisticsT(): LogisticsTranslator {
  return useLogisticsLocale().t;
}
