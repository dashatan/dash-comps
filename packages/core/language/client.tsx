"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import type { TranslationType } from "./locales/schema";
import { FALLBACK_LOCALE, localeLoaders } from "./locales/registry";
import Cookies from "js-cookie";
import {
  COOKIE_EXPIRY_DAYS,
  DEFAULT_LANGUAGE,
  getDocumentDirection,
  Language,
  SupportedLanguages,
} from "./utils";
import { resolveInitialLanguage } from "./detect";
import {
  getCachedLocale,
  hasCachedLocale,
  setCachedLocale,
} from "./locale-cache";
import { createTranslator, type Translation } from "./translator";

const CORE_LOCALE_CACHE_NAMESPACE = "core";

export type { TranslationParams } from "./plural";
export type { Translation } from "./translator";
export { createTranslator } from "./translator";

export interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translation;
  isLocaleReady: boolean;
}

type LanguageProviderBaseProps = {
  children: React.ReactNode;
  defaultLanguage?: Language;
};

type LanguageProviderSyncProps = LanguageProviderBaseProps & {
  translations: Record<SupportedLanguages, TranslationType>;
  fallbackLocale?: never;
  localeLoaders?: never;
};

type LanguageProviderLazyProps = LanguageProviderBaseProps & {
  fallbackLocale?: TranslationType;
  localeLoaders?: Record<Language, () => Promise<TranslationType>>;
  translations?: never;
};

export type LanguageProviderProps =
  | LanguageProviderSyncProps
  | LanguageProviderLazyProps;

export const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

const defaultLocaleLoaders = localeLoaders;

export function LanguageProvider(props: LanguageProviderProps) {
  const {
    children,
    defaultLanguage = DEFAULT_LANGUAGE,
  } = props;

  const isLazy = !("translations" in props && props.translations);

  const [language, setLanguage] = useState<Language>(() =>
    resolveInitialLanguage(defaultLanguage),
  );
  const [loadedLocales, setLoadedLocales] = useState<
    Partial<Record<Language, TranslationType>>
  >(() => {
    if (!isLazy) return {};

    const initialLanguage = resolveInitialLanguage(defaultLanguage);
    const fallback = props.fallbackLocale ?? FALLBACK_LOCALE;
    const cachedActive = getCachedLocale<TranslationType>(
      CORE_LOCALE_CACHE_NAMESPACE,
      initialLanguage,
    );

    return {
      en: fallback,
      ...(cachedActive ? { [initialLanguage]: cachedActive } : {}),
    };
  });
  const [isLocaleReady, setIsLocaleReady] = useState(() => {
    if (!isLazy) return true;

    const initialLanguage = resolveInitialLanguage(defaultLanguage);
    return (
      initialLanguage === "en" ||
      hasCachedLocale(CORE_LOCALE_CACHE_NAMESPACE, initialLanguage)
    );
  });

  const fallbackLocale = isLazy
    ? (props.fallbackLocale ?? FALLBACK_LOCALE)
    : (props.translations.en ?? FALLBACK_LOCALE);

  const loaders = isLazy
    ? (props.localeLoaders ?? defaultLocaleLoaders)
    : null;

  const syncTranslations = !isLazy ? props.translations : undefined;

  useEffect(() => {
    if (!isLazy) return;
    const activeLoaders = loaders ?? defaultLocaleLoaders;

    let cancelled = false;

    async function load() {
      const cachedActive = getCachedLocale<TranslationType>(
        CORE_LOCALE_CACHE_NAMESPACE,
        language,
      );

      if (cachedActive) {
        setLoadedLocales((prev) => ({
          ...prev,
          [language]: cachedActive,
        }));
        setIsLocaleReady(true);
      } else {
        setIsLocaleReady(false);
      }

      try {
        const [active, fallback] = await Promise.all([
          activeLoaders[language](),
          language === "en" ? Promise.resolve(fallbackLocale) : activeLoaders.en(),
        ]);
        if (cancelled) return;
        setCachedLocale(CORE_LOCALE_CACHE_NAMESPACE, language, active);
        setLoadedLocales((prev) => ({
          ...prev,
          en: fallback,
          [language]: active,
        }));
      } finally {
        if (!cancelled) setIsLocaleReady(true);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [isLazy, loaders, language, fallbackLocale]);

  const activeDictionary = useMemo(() => {
    if (syncTranslations) return syncTranslations[language];
    return loadedLocales[language] ?? fallbackLocale;
  }, [syncTranslations, language, loadedLocales, fallbackLocale]);

  const t = useMemo(
    () => createTranslator(language, activeDictionary, fallbackLocale),
    [language, activeDictionary, fallbackLocale],
  );

  const handleSetLanguage = useCallback((newLanguage: Language) => {
    setLanguage(newLanguage);
    localStorage.setItem("language", newLanguage);
    Cookies.set("language", newLanguage, {
      expires: COOKIE_EXPIRY_DAYS,
      sameSite: "lax",
    });
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;

    document.documentElement.lang = language;
    document.documentElement.dir = getDocumentDirection(language);

    const titleSource = syncTranslations?.[language] ?? loadedLocales[language];
    document.title =
      titleSource?.app.name ||
      fallbackLocale.app.name ||
      FALLBACK_LOCALE.app.name;
  }, [language, syncTranslations, loadedLocales, fallbackLocale]);

  const contextValue: LanguageContextType = {
    language,
    setLanguage: handleSetLanguage,
    t,
    isLocaleReady,
  };

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
