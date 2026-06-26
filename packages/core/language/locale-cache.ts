import type { Language } from "./utils";

const memoryCache = new Map<string, unknown>();

function cacheKey(namespace: string, language: Language): string {
  return `locale:${namespace}:${language}`;
}

export function getCachedLocale<T>(
  namespace: string,
  language: Language,
): T | undefined {
  const key = cacheKey(namespace, language);

  if (memoryCache.has(key)) {
    return memoryCache.get(key) as T;
  }

  if (typeof sessionStorage === "undefined") return undefined;

  try {
    const stored = sessionStorage.getItem(key);
    if (!stored) return undefined;

    const parsed = JSON.parse(stored) as T;
    memoryCache.set(key, parsed);
    return parsed;
  } catch {
    return undefined;
  }
}

export function setCachedLocale<T>(
  namespace: string,
  language: Language,
  locale: T,
): void {
  const key = cacheKey(namespace, language);
  memoryCache.set(key, locale);

  if (typeof sessionStorage === "undefined") return;

  try {
    sessionStorage.setItem(key, JSON.stringify(locale));
  } catch {
    // Ignore quota errors; in-memory cache still helps within the session.
  }
}

export function hasCachedLocale(
  namespace: string,
  language: Language,
): boolean {
  return getCachedLocale(namespace, language) !== undefined;
}
