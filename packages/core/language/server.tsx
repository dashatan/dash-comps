"use server";

import { Language, LanguageProvider, translations } from "./";

export async function ServerLanguageProvider({
  children,
  language,
}: {
  children: React.ReactNode;
  language: Language;
}) {
  return (
    <LanguageProvider defaultLanguage={language} translations={translations}>
      {children}
    </LanguageProvider>
  );
}
