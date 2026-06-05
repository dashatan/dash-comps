"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { TranslationType, TranslationKeys } from "./locales";
import Cookies from "js-cookie";
import {
  COOKIE_EXPIRY_DAYS,
  DEFAULT_LANGUAGE,
  getDocumentDirection,
  isValidLanguage,
  Language,
  SupportedLanguages,
} from "./utils";
import { getNestedValue } from "../utils/cn";
import {
  formatTranslation,
  type TranslationParams,
} from "./plural";

export type Translation = (
  key: TranslationKeys,
  params?: TranslationParams,
) => string;

export type { TranslationParams } from "./plural";

export interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translation;
}

export interface LanguageProviderProps {
  children: React.ReactNode;
  defaultLanguage?: Language;
  translations: Record<SupportedLanguages, TranslationType>;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

function toTranslationString(raw: unknown): string {
  if (raw === undefined || raw === null) return "";
  if (typeof raw === "string") return raw;
  if (typeof raw === "number" || typeof raw === "boolean") return String(raw);
  return "";
}

export function LanguageProvider({
  children,
  defaultLanguage = DEFAULT_LANGUAGE,
  translations,
}: LanguageProviderProps) {
  const [language, setLanguage] = useState<Language>(defaultLanguage);
  const [isClient, setIsClient] = useState(() => typeof window !== "undefined");
  const translation = useMemo<TranslationType>(
    () => translations[language],
    [language, translations],
  );

  const t = useCallback(
    (key: TranslationKeys, params?: TranslationParams): string => {
      const value = toTranslationString(getNestedValue(translation, key));
      return formatTranslation(value, language, params);
    },
    [language, translation],
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
    !isClient && setIsClient(true);
    if (typeof document !== "undefined") {
      document.documentElement.lang = language;
      document.documentElement.dir = getDocumentDirection(language);
      document.title = translations[language].app.name;
    }
    const lang = Cookies.get("language") as Language;
    if (lang && lang !== language && isValidLanguage(lang))
      handleSetLanguage(lang);
  }, [language, handleSetLanguage]);

  const contextValue: LanguageContextType = {
    language,
    setLanguage: handleSetLanguage,
    t,
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
