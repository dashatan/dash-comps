import type { ReactNode } from "react";
import { ThemeProvider } from "next-themes";
import { LanguageProvider } from "@/lib/language/client";
import { FALLBACK_LOCALE, localeLoaders } from "@/lib/language/locales";
import { LogisticsLocaleProvider } from "@/i18n/provider";
import { LocaleGate } from "@/app/locale-gate";
import { ErrorHandler } from "@/components/common/errors";

type AppProvidersProps = {
  children: ReactNode;
};

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      storageKey="dash-logistics-theme"
      enableSystem={true}
      themes={["light", "dark"]}
      disableTransitionOnChange={false}
    >
      <LanguageProvider
        fallbackLocale={FALLBACK_LOCALE}
        localeLoaders={localeLoaders}
      >
        <LogisticsLocaleProvider>
          <LocaleGate>
            <ErrorHandler>{children}</ErrorHandler>
          </LocaleGate>
        </LogisticsLocaleProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
