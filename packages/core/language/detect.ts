import Cookies from "js-cookie";
import {
  DEFAULT_LANGUAGE,
  isValidLanguage,
  type Language,
} from "./utils";

export function detectBrowserLanguage(): Language {
  if (typeof navigator === "undefined") return DEFAULT_LANGUAGE;

  const candidates = [
    navigator.language,
    ...(navigator.languages ?? []),
  ];

  for (const tag of candidates) {
    const code = tag.split("-")[0]?.toLowerCase();
    if (code && isValidLanguage(code)) return code;
  }

  return DEFAULT_LANGUAGE;
}

/**
 * Priority: cookie → localStorage → browser → defaultLanguage prop.
 */
export function resolveInitialLanguage(defaultLanguage: Language = DEFAULT_LANGUAGE): Language {
  if (typeof window === "undefined") return defaultLanguage;

  const cookieLang = Cookies.get("language");
  if (cookieLang && isValidLanguage(cookieLang)) return cookieLang;

  const stored = localStorage.getItem("language");
  if (stored && isValidLanguage(stored)) return stored;

  return detectBrowserLanguage();
}
