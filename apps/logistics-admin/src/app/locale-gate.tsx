import type { ReactNode } from "react";
import { useLanguage } from "@/lib/language/client";

type LocaleGateProps = {
  children: ReactNode;
};

export function LocaleGate({ children }: LocaleGateProps) {
  const { isLocaleReady } = useLanguage();

  if (!isLocaleReady) {
    return null;
  }

  return children;
}
