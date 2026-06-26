type LocaleRecord = Record<string, unknown>;

function isPlainObject(value: unknown): value is LocaleRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * Deep-merge locale dictionaries. Values from `override` win on leaf conflicts.
 */
export function mergeLocales<T extends LocaleRecord, U extends LocaleRecord>(
  base: T,
  override: U,
): T & U {
  const result = { ...base } as LocaleRecord;

  for (const [key, overrideValue] of Object.entries(override)) {
    const baseValue = result[key];

    if (isPlainObject(baseValue) && isPlainObject(overrideValue)) {
      result[key] = mergeLocales(baseValue, overrideValue);
      continue;
    }

    result[key] = overrideValue;
  }

  return result as T & U;
}
