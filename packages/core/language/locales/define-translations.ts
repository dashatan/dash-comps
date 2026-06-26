import type { AssertLocaleEqual } from "../types";
import type { LocaleSchema } from "./schema";
import type { SupportedLanguages } from "../utils";

/**
 * Compile-time validation via `AssertLocaleEqual`.
 * Run `pnpm sync:locales` to keep JSON files aligned and sorted.
 */
export function defineTranslations<
  const T extends Record<SupportedLanguages, LocaleSchema>,
>(locales: {
  [K in keyof T]: AssertLocaleEqual<LocaleSchema, T[K]>;
}): T {
  return locales;
}
