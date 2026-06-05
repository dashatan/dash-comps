import fa from "@/lib/language/locales/fa.json";
import en from "@/lib/language/locales/en.json";
import ar from "@/lib/language/locales/ar.json";
import { LeafKeyOf, NestedTypeOf } from "../types";
import type { SupportedLanguages } from "../utils";

const baseLocale = en;

export type LocaleSchema = NestedTypeOf<typeof baseLocale>;
export type TranslationType = LocaleSchema;
export type TranslationKeys = LeafKeyOf<typeof baseLocale>;

export const translations = {
  fa,
  en,
  ar,
} satisfies Record<SupportedLanguages, LocaleSchema>;
