"use client";

import { createContext, useContext } from "react";
import type { CardAppearance, CardSeverity, CardSize } from "@/components/common/card/types";

export type CardContextValue = {
  size: CardSize;
  divided: boolean;
  severity: CardSeverity;
  appearance: CardAppearance;
};

const CardContext = createContext<CardContextValue | null>(null);

export function CardProvider({
  value,
  children,
}: {
  value: CardContextValue;
  children: React.ReactNode;
}) {
  return <CardContext.Provider value={value}>{children}</CardContext.Provider>;
}

export function useCardContext(): CardContextValue {
  return (
    useContext(CardContext) ?? {
      size: "md",
      divided: false,
      severity: "default",
      appearance: "soft",
    }
  );
}
