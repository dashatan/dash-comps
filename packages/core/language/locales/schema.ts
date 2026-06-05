import en from "@/lib/language/locales/en.json";
import { LeafKeyOf, NestedTypeOf } from "../types";

const baseLocale = en;

export type LocaleSchema = NestedTypeOf<typeof baseLocale>;
export type TranslationType = LocaleSchema;
export type TranslationKeys = LeafKeyOf<typeof baseLocale>;
