import type { BundledLanguage } from "shiki";

const SUPPORTED_LANGS = new Set<BundledLanguage>([
  "tsx",
  "typescript",
  "javascript",
  "jsx",
  "json",
  "css",
  "html",
]);

function resolveLanguage(language: string): BundledLanguage {
  return SUPPORTED_LANGS.has(language as BundledLanguage)
    ? (language as BundledLanguage)
    : "tsx";
}

export async function highlightCode(code: string, language: string): Promise<string> {
  const { codeToHtml } = await import("shiki");

  return codeToHtml(code, {
    lang: resolveLanguage(language),
    themes: {
      light: "light-plus",
      dark: "dark-plus",
    },
    defaultColor: false,
  });
}
