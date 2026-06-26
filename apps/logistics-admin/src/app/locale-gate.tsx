import type { ReactNode } from "react";
import { useLanguage } from "@/lib/language/client";
import { useLogisticsLocale } from "@/i18n/provider";

type LocaleGateProps = {
  children: ReactNode;
};

export function LocaleGate({ children }: LocaleGateProps) {
  const { isLocaleReady } = useLanguage();
  const { isReady: isLogisticsReady } = useLogisticsLocale();

  if (!isLocaleReady || !isLogisticsReady) {
    return null;
  }

  return children;
}
