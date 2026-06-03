import fa from '@/lib/language/locales/fa.json'
import { NestedKeyOf, TranslationsTypeOf } from '@/lib/types'

export type TranslationType = TranslationsTypeOf<typeof fa>
export type TranslationKeys = NestedKeyOf<typeof fa>
export type LanguageKey = keyof typeof fa
