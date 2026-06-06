import { useCallback } from "react";

export function useSecondConvertor() {
  return useCallback((seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainder = seconds % 60;
    if (minutes === 0) return `${remainder}s`;
    return `${minutes}m ${remainder}s`;
  }, []);
}
