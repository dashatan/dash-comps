'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';

export type Language = 'en' | 'fa' | 'ar';

// Define translation interface
export interface Translations {
  common: {
    home: string;
    projects: string;
    components: string;
    contact: string;
    toggleTheme: string;
    toggleLanguage: string;
    search: string;
    menu: string;
    close: string;
    loading: string;
    save: string;
    cancel: string;
    submit: string;
    edit: string;
    delete: string;
    view: string;
    welcome: string;
    error: string;
    success: string;
    warning: string;
    info: string;
  };
  home: {
    hero: {
      title: string;
      subtitle: string;
      viewResume: string;
    };
    services: {
      title: string;
      description: string;
      webDev: string;
      webDevDesc: string;
      mobileDev: string;
      mobileDevDesc: string;
      uiDesign: string;
      uiDesignDesc: string;
    };
  };
  projects: {
    title: string;
    subtitle: string;
    viewAll: string;
    viewDetails: string;
    sourceCode: string;
    liveDemo: string;
    technologies: string;
    description: string;
    projectDetails: string;
    relatedProjects: string;
    filter: {
      all: string;
      web: string;
      mobile: string;
      design: string;
    };
  };
  components: {
    title: string;
    subtitle: string;
    searchPlaceholder: string;
    categories: {
      buttons: string;
      cards: string;
      forms: string;
      navigation: string;
      layout: string;
      feedback: string;
      inputs: string;
      data: string;
    };
  };
  contact: {
    title: string;
    subtitle: string;
    nameLabel: string;
    namePlaceholder: string;
    emailLabel: string;
    emailPlaceholder: string;
    messageLabel: string;
    messagePlaceholder: string;
    sendMessage: string;
    successMessage: string;
    errorMessage: string;
    socialMedia: string;
    location: string;
  };
  validation: {
    required: string;
    invalidEmail: string;
    minLength: string;
    maxLength: string;
  };
  footer: {
    copyright: string;
    termsOfService: string;
    privacyPolicy: string;
    madeWith: string;
  };
  accessibility: {
    skipToContent: string;
    darkMode: string;
    lightMode: string;
    menuOpen: string;
    menuClose: string;
    searchButton: string;
    languageSelector: string;
  };
  errors: {
    notFound: string;
    goHome: string;
    serverError: string;
    tryAgain: string;
  };
  themeBuilder: {
    title: string;
    resetDefaults: string;
    background: string;
    primary: string;
    utility: string;
  };
  debugger: {
    title: string;
    currentLanguage: string;
    validationResults: string;
    valid: string;
    invalid: string;
    errors: string;
    warnings: string;
    translationExamples: string;
    validateTranslations: string;
  };
}

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string>) => string;
  isLoading: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

// Translation cache to avoid reloading the same language
const translationCache: Record<Language, Translations> = {} as Record<
  Language,
  Translations
>;

// Load translations dynamically with caching
async function loadTranslations(lang: Language): Promise<Translations> {
  // Return cached translations if available
  if (translationCache[lang]) {
    return translationCache[lang];
  }

  try {
    const translations = await import(`@/locales/${lang}.json`);
    // Cache the translations
    translationCache[lang] = translations.default;
    return translations.default;
  } catch (error) {
    console.error(`Failed to load translations for ${lang}:`, error);
    return {} as Translations;
  }
}

// Preload all languages in the background
function preloadTranslations() {
  ['en', 'fa', 'ar'].forEach((lang) => {
    import(`@/locales/${lang}.json`)
      .then((translations) => {
        translationCache[lang as Language] = translations.default;
      })
      .catch((error) => {
        console.error(`Failed to preload translations for ${lang}:`, error);
      });
  });
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');
  const [translations, setTranslations] = useState<Translations | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load language preference and translations on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && ['en', 'fa', 'ar'].includes(savedLanguage)) {
      setLanguage(savedLanguage);
    }

    // Load initial translations
    loadTranslations(savedLanguage || 'en')
      .then(setTranslations)
      .finally(() => setIsLoading(false));

    // Preload other languages in the background
    preloadTranslations();
  }, []);

  // Save language preference and load new translations when language changes
  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.lang = language;
    document.documentElement.dir =
      language === 'ar' || language === 'fa' ? 'rtl' : 'ltr';

    setIsLoading(true);
    loadTranslations(language)
      .then(setTranslations)
      .finally(() => setIsLoading(false));
  }, [language]);

  // Translation function with parameter support and memoization
  const t = useCallback(
    (key: string, params?: Record<string, string>): string => {
      if (!translations) return key;

      const keys = key.split('.');
      let value: any = translations;

      for (const k of keys) {
        value = value?.[k];
      }

      if (typeof value !== 'string') return key;

      if (params) {
        return Object.entries(params).reduce(
          (acc, [key, value]) => acc.replace(`{{${key}}}`, value),
          value
        );
      }

      return value;
    },
    [translations]
  );

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isLoading }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
