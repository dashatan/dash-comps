export const RTL_LANGUAGES = ['fa', 'ar']
export const SUPPORTED_LANGUAGES_OBJECT = { fa: 'fa', en: 'en', ar: 'ar' }
export const SUPPORTED_LANGUAGES = Object.keys(SUPPORTED_LANGUAGES_OBJECT)
export type SUPPORTED_LANGUAGES_KEYS = keyof typeof SUPPORTED_LANGUAGES_OBJECT
export const DEFAULT_LANGUAGE = 'en'
export const COOKIE_EXPIRY_DAYS = 365
export const SUPPORTED_THEMES = ['light', 'dark', 'ocean', 'forest', 'sunset', 'nord', 'dracula']

export type Language = SUPPORTED_LANGUAGES_KEYS
export type SupportedLanguages = keyof typeof SUPPORTED_LANGUAGES_OBJECT

export function getDocumentDirection(lang: Language): 'rtl' | 'ltr' {
  return RTL_LANGUAGES.includes(lang) ? 'rtl' : 'ltr'
}

export const isValidLanguage = (lang: string): lang is Language => {
  return SUPPORTED_LANGUAGES.includes(lang as Language)
}

const LANGUAGE_FONT_CLASS = {
  en: 'font-en',
  fa: 'font-fa',
  ar: 'font-ar',
} as const satisfies Record<Language, string>

export function getFontClass(lang: Language): string {
  return LANGUAGE_FONT_CLASS[lang]
}

export function getLanguageFontFamily(lang: Language): string {
  const stacks = {
    en: 'var(--font-en)',
    fa: 'var(--font-fa)',
    ar: 'var(--font-ar)',
  } as const satisfies Record<Language, string>
  return stacks[lang]
}
