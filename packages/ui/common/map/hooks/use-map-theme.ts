"use client";

import { useTheme } from "next-themes";
import type { MapTheme } from "@/components/common/map/types";

/**
 * Maps next-themes resolved theme to map tile variant.
 * Pass the result to `<LeafletMap theme={...} tiles={{ light, dark }} />`.
 */
export function useMapTheme(): MapTheme {
  const { resolvedTheme } = useTheme();
  return resolvedTheme === "dark" ? "dark" : "light";
}
