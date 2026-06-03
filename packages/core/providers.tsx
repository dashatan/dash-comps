"use client";

import { ThemeProvider } from "./themes/theme-provider";
import { ServerLanguageProvider } from "./language/server";
import type { Language } from "./language/utils";

export type ProvidersProps = {
  children: React.ReactNode;
  theme?: string;
  language?: Language;
};

/** Next.js app shell — pass theme/language from server layout when available. */
export default function Providers({
  children,
  theme = "light",
  language = "en",
}: ProvidersProps) {
  return (
    <ThemeProvider theme={theme}>
      <ServerLanguageProvider language={language}>{children}</ServerLanguageProvider>
    </ThemeProvider>
  );
}
