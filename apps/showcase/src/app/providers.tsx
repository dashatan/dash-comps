import { ThemeProvider } from "next-themes";
import { LanguageProvider } from "@/lib/language/client";
import { translations } from "@/lib/language/locales";
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
      <LanguageProvider defaultLanguage="en" translations={translations}>
        <ErrorHandler>{children}</ErrorHandler>
      </LanguageProvider>
    </ThemeProvider>
  );
}
