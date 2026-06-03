/**
 * General utility functions for the application
 */

import { PlateValue } from "@/components/compound/license-plate/types";
import type { Env } from "@/store/env";
import store from "@/store";
import { clsx, type ClassValue } from "clsx";
import { formatHex, parse } from "culori";
import { twMerge } from "tailwind-merge";

// Function to merge tailwind classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Export utility functions
export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const formatDate = (
  date: Date,
  locale: string = "en",
  options?: Intl.DateTimeFormatOptions,
) => {
  return new Intl.DateTimeFormat(locale, options).format(date);
};

export function getNestedValue(obj: any, path: string, defaultValue?: any) {
  const keys = path.split(".");
  let value = obj;

  for (const key of keys) {
    if (value === undefined || value === null) {
      return defaultValue;
    }
    value = value[key];
  }

  return value === undefined || value === null ? defaultValue : value;
}

export function nestedSearch(items: any[], searchKey: string, text?: string) {
  let res = [...items];
  if (text) {
    const newMenus = items?.flatMap((item) =>
      searchChildren(text, item, searchKey || "label"),
    );
    res = newMenus;
  } else {
    res = items;
  }

  function searchChildren(text: string, menu: any, searchKey: string) {
    let hasText = `${menu[searchKey]}`.includes(text);
    if (hasText) return menu;
    if (!hasText && menu.children?.length) {
      const children = menu.children.flatMap((child: any) =>
        searchChildren(text, child, searchKey),
      );
      const res = { ...menu, children };
      if (!children?.length) return [];
      else return res;
    }
    return [];
  }

  return res;
}

/**
 * Recursively filters menu items by a search string, including parents if any child matches.
 * Ensures children is only present if there are children, to match MenuItem type.
 */
export function filterMenusByText<T extends { children?: T[] }>(
  items: T[],
  searchKey: keyof T,
  text?: string,
): T[] {
  if (!text) return items;
  const lowerText = text.toLowerCase();

  return items
    .map((item) => {
      const matches = String(item[searchKey] ?? "")
        .toLowerCase()
        .includes(lowerText);
      const filteredChildren = item.children
        ? filterMenusByText(item.children, searchKey, text)
        : undefined;
      if (matches || (filteredChildren && filteredChildren.length > 0)) {
        // Only include children if there are any, otherwise omit the property
        const result: T = {
          ...item,
          ...(filteredChildren && filteredChildren.length > 0
            ? { children: filteredChildren }
            : {}),
        };
        return result;
      }
      return null;
    })
    .filter(Boolean) as T[];
}

export function getHexColor(varName: string) {
  if (typeof window === "undefined") return "";
  let value = getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
  // Try to convert oklch or other modern CSS color to hex if needed
  if (
    value.startsWith("oklch") ||
    value.startsWith("color(") ||
    value.startsWith("lab(") ||
    value.startsWith("lch(")
  ) {
    const parsed = parse(value);
    if (parsed) {
      value = formatHex(parsed);
    }
  }
  return value;
}

export const getStoreEnv = (): Env => {
  if (typeof window === "undefined") return {} as Env;
  return store.getState()?.root?.app?.env || ({} as Env);
};

export function getMapTileUrl(theme?: string) {
  const { MAP_TILE_LIGHT, MAP_TILE_DARK } = getStoreEnv();
  return theme === "dark" && !!MAP_TILE_DARK ? MAP_TILE_DARK : (MAP_TILE_LIGHT ?? "");
}

export const deviceType = (): "desktop" | "laptop" | "mobile" => {
  if (typeof window === "undefined") return "desktop";
  const width = document.documentElement.clientWidth;
  if (width <= 480) return "mobile";
  if (480 < width && width <= 1366) return "laptop";
  if (1366 > width) return "desktop";
  else return "desktop";
};

// Export profile image utilities

export function makeArray(count: number) {
  return Array.from(Array(count).keys());
}

export function isValidJSON(json: string) {
  try {
    const parsed = JSON.parse(json);
    return parsed !== null && typeof parsed === "object" && parsed;
  } catch (e) {
    return false;
  }
}

export function createUUID() {
  return Math.random().toString(36).substring(2, 15);
}

export function isFullPlate(plate?: PlateValue) {
  if (!plate) return false;
  const isFull = Object.values(plate).every(
    (value) => ![undefined, null, ""].includes(value),
  );
  return isFull;
}

export type LocationValue = {
  sources?: number[];
  devices?: number[];
  roads?: number[];
  provinces?: number[];
};

export function isFilledLocation(location?: LocationValue) {
  if (!location) return false;
  const isFilled = Object.values(location).some((value) => value && value.length > 0);
  return isFilled;
}

export * from "./profile-hash";
export * from "./date-time-helpers";
export * from "./params-handler";
