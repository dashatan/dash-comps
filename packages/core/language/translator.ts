import { getNestedValue } from "../utils/cn";
import { formatTranslation, type TranslationParams } from "./plural";
import type { TranslationKeys, TranslationType } from "./locales/schema";
import type { Language } from "./utils";

export type Translation = (
  key: TranslationKeys,
  params?: TranslationParams,
) => string;

function toTranslationString(raw: unknown): string {
  if (raw === undefined || raw === null) return "";
  if (typeof raw === "string") return raw;
  if (typeof raw === "number" || typeof raw === "boolean") return String(raw);
  return "";
}

function resolveTemplate(
  dictionary: TranslationType,
  fallbackDictionary: TranslationType,
  key: TranslationKeys,
): string {
  const raw = getNestedValue(dictionary, key);
  if (raw !== undefined && raw !== null) {
    return toTranslationString(raw);
  }
  return toTranslationString(getNestedValue(fallbackDictionary, key));
}

/**
 * Factory for `t()` usable in utilities, tests, and outside React.
 * Missing keys fall back to `fallbackDictionary` (typically English).
 */
export function createTranslator(
  language: Language,
  dictionary: TranslationType,
  fallbackDictionary: TranslationType = dictionary,
): Translation {
  return (key, params) => {
    const template = resolveTemplate(dictionary, fallbackDictionary, key);
    return formatTranslation(template, language, params);
  };
}
