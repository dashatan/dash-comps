import type { Language } from "./utils";

/** BCP 47 tags used by Intl.PluralRules for each app language */
const PLURAL_LOCALES: Record<Language, string> = {
  en: "en",
  fa: "fa",
  ar: "ar",
};

export type TranslationParamValue = string | number;

export type TranslationParams = Record<string, TranslationParamValue>;

type PluralRuleCategory = Intl.LDMLPluralRule;

type ParsedPluralTemplate = {
  named: Partial<Record<PluralRuleCategory, string>>;
  positional: string[];
};

const PLURAL_RULE_PATTERN = /^([a-z]+)=(.*)$/s;

/**
 * Plural forms in locale JSON, separated by `|`.
 *
 * @example Named (recommended — works for en, fa, ar)
 * "one={{count}} item|other={{count}} items"
 *
 * @example Arabic with extra categories
 * "zero={{count}} عناصر|one={{count}} عنصر|two=عنصران|few={{count}} عناصر|many={{count}} عنصرًا|other={{count}} عنصر"
 *
 * @example Positional shorthand (en-style: first = one, second = other)
 * "{{count}} item|{{count}} items"
 */
export function getPluralCategory(
  language: Language,
  count: number,
): PluralRuleCategory {
  return new Intl.PluralRules(PLURAL_LOCALES[language]).select(count);
}

function parsePluralTemplate(value: string): ParsedPluralTemplate {
  const named: ParsedPluralTemplate["named"] = {};
  const positional: string[] = [];

  for (const segment of value.split("|")) {
    const trimmed = segment.trim();
    const match = trimmed.match(PLURAL_RULE_PATTERN);
    if (match) {
      named[match[1] as PluralRuleCategory] = match[2];
    } else if (trimmed) {
      positional.push(trimmed);
    }
  }

  return { named, positional };
}

function resolvePositionalTemplate(
  positional: string[],
  category: PluralRuleCategory,
): string {
  if (positional.length === 0) return "";
  if (positional.length === 1) return positional[0];
  if (category === "one") return positional[0];
  return positional[1] ?? positional[positional.length - 1];
}

function pickPluralTemplate(
  parsed: ParsedPluralTemplate,
  category: PluralRuleCategory,
): string {
  const { named, positional } = parsed;

  if (Object.keys(named).length > 0) {
    return (
      named[category] ??
      named.other ??
      named.many ??
      named.few ??
      Object.values(named).at(-1) ??
      ""
    );
  }

  return resolvePositionalTemplate(positional, category);
}

function normalizeCount(count: TranslationParamValue): number | undefined {
  if (typeof count === "number") {
    return Number.isFinite(count) ? count : undefined;
  }
  const parsed = Number.parseInt(String(count), 10);
  return Number.isNaN(parsed) ? undefined : parsed;
}

export function interpolateParams(
  template: string,
  params: TranslationParams,
): string {
  return Object.entries(params).reduce<string>(
    (acc, [paramKey, paramValue]) => {
      const replacement = String(paramValue);
      return acc.replaceAll(`{{${paramKey}}}`, replacement);
    },
    template,
  );
}

/**
 * Resolves plural segments (if any), then interpolates `{{param}}` placeholders.
 */
export function formatTranslation(
  template: string,
  language: Language,
  params?: TranslationParams,
): string {
  if (!params) return template;

  const count = normalizeCount(params.count);
  const hasPlural = template.includes("|") && count !== undefined;

  const resolvedTemplate = hasPlural
    ? pickPluralTemplate(
        parsePluralTemplate(template),
        getPluralCategory(language, count),
      )
    : template;

  return interpolateParams(resolvedTemplate, params);
}
