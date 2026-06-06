import type { ReactNode } from "react";
import { useLanguage } from "@/lib/language/client";
import { useShowcaseLocale } from "@/i18n/provider";

type LocaleGateProps = {
  children: ReactNode;
};

export function LocaleGate({ children }: LocaleGateProps) {
  const { isLocaleReady } = useLanguage();
  const { isReady: isShowcaseReady } = useShowcaseLocale();

  if (!isLocaleReady || !isShowcaseReady) {
    return null;
  }

  return children;
}
