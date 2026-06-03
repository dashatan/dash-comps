import { ThemeProvider } from "next-themes";
import { LanguageProvider } from "@/lib/language/client";
import type { TranslationType } from "@/lib/language/locales";
import type { SupportedLanguages } from "@/lib/language/utils";
import fa from "@/lib/language/locales/fa.json";
import en from "@/lib/language/locales/en.json";
import ar from "@/lib/language/locales/ar.json";
import type { ReactNode } from "react";

const translations = { fa, en, ar } as unknown as Record<SupportedLanguages, TranslationType>;

type AppProvidersProps = {
  children: ReactNode;
};

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      storageKey="dash-comps-theme"
      enableSystem={false}
      themes={["light", "dark"]}
      disableTransitionOnChange={false}
    >
      <LanguageProvider defaultLanguage="en" translations={translations}>
        {children}
      </LanguageProvider>
    </ThemeProvider>
  );
}
