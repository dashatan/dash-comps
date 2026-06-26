import type { ReactNode } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ThemeProvider } from "next-themes";
import { LanguageProvider } from "@/lib/language/client";
import { FALLBACK_LOCALE, localeLoaders } from "@/lib/language/locales";
import { LogisticsLocaleProvider } from "@/i18n/provider";
import { LocaleGate } from "@/app/locale-gate";
import { ErrorHandler } from "@/components/common/errors";
import { queryClient } from "@/core/query-client";
import { TRACKER_MAP_ENV } from "@/core/env";
import { appStore } from "@/store";
import { PreferencesBootstrap } from "@/app/preferences-bootstrap";
import { Toaster } from "@/components/common/sonner";

appStore.getState().setEnv(TRACKER_MAP_ENV);

type AppProvidersProps = {
  children: ReactNode;
};

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
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
              <PreferencesBootstrap />
              <ErrorHandler>{children}</ErrorHandler>
              <Toaster />
            </LocaleGate>
          </LogisticsLocaleProvider>
        </LanguageProvider>
      </ThemeProvider>
      <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" />
    </QueryClientProvider>
  );
}
