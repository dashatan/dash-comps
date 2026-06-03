'use server'

import { Language, LanguageProvider, SupportedLanguages } from './'
import fa from '@/lib/language/locales/fa.json'
import en from '@/lib/language/locales/en.json'
import ar from '@/lib/language/locales/ar.json'
import { TranslationType } from '@/lib/language/locales'

export async function ServerLanguageProvider({ children, language }: { children: React.ReactNode; language: Language }) {
  const translations = { fa, en, ar } as unknown as Record<SupportedLanguages, TranslationType>

  return (
    <LanguageProvider defaultLanguage={language} translations={translations}>
      {children}
    </LanguageProvider>
  )
}
