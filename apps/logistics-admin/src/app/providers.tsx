import type { ReactNode } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ThemeProvider } from "next-themes";
import { LanguageProvider } from "@/lib/language/client";
import {
  LOGISTICS_FALLBACK_LOCALE,
  logisticsLocaleLoaders,
} from "@/i18n/locales/registry";
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
          fallbackLocale={LOGISTICS_FALLBACK_LOCALE}
          localeLoaders={logisticsLocaleLoaders}
        >
          <LocaleGate>
            <PreferencesBootstrap />
            <ErrorHandler>{children}</ErrorHandler>
            <Toaster />
          </LocaleGate>
        </LanguageProvider>
      </ThemeProvider>
      <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" />
    </QueryClientProvider>
  );
}
