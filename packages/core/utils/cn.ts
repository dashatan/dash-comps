import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getNestedValue<T extends object>(
  obj: T,
  path: string,
  defaultValue?: unknown,
): unknown {
  const keys = path.split(".");
  let value: unknown = obj;

  for (const key of keys) {
    if (value === undefined || value === null) {
      return defaultValue;
    }
    value = (value as Record<string, unknown>)[key];
  }

  return value === undefined || value === null ? defaultValue : value;
}

export function nestedSearch<T extends Record<string, unknown>>(
  items: T[],
  searchKey: string,
  text?: string,
): T[] {
  if (!text) return items;

  return items.flatMap((item) =>
    searchChildren(text, item, searchKey || "label"),
  );

  function searchChildren(searchText: string, menu: T, key: string): T[] {
    const hasText = `${menu[key]}`.includes(searchText);
    if (hasText) return [menu];

    const children = menu.children as T[] | undefined;
    if (!hasText && children?.length) {
      const filteredChildren = children.flatMap((child) =>
        searchChildren(searchText, child, key),
      );
      if (!filteredChildren.length) return [];
      return [{ ...menu, children: filteredChildren } as T];
    }

    return [];
  }
}

export function createUUID() {
  return Math.random().toString(36).substring(2, 15);
}

export function makeArray(count: number) {
  return Array.from(Array(count).keys());
}
