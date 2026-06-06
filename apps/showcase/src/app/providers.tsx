import { ThemeProvider } from "next-themes";
import { LanguageProvider } from "@/lib/language/client";
import { FALLBACK_LOCALE, localeLoaders } from "@/lib/language/locales";
import { ShowcaseLocaleProvider } from "@/i18n/provider";
import { LocaleGate } from "@/app/locale-gate";
import { ErrorHandler } from "@/components/common/errors";
import type { ReactNode } from "react";

type AppProvidersProps = {
  children: ReactNode;
};

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      storageKey="dash-comps-theme"
      enableSystem={true}
      themes={["light", "dark"]}
      disableTransitionOnChange={false}
    >
      <LanguageProvider fallbackLocale={FALLBACK_LOCALE} localeLoaders={localeLoaders}>
        <ShowcaseLocaleProvider>
          <LocaleGate>
            <ErrorHandler>{children}</ErrorHandler>
          </LocaleGate>
        </ShowcaseLocaleProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
