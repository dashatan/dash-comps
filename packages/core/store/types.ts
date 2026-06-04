import type { Env } from "./env";

export type FontSize = "xs" | "sm" | "base" | "lg" | "xl";
export type FontFamily = "peyda" | "yekan" | "vazir" | "mono";
export type Spacing = "compact" | "normal" | "comfortable";

export type DateFormatPreferences = {
  monthFormat?: "name" | "digit" | "narrow";
  separator?: string;
  yearFormat?: "full" | "2-digit";
};

export type MenuSettings = {
  visibleMenus: string[];
  defaultExpanded?: boolean;
};

/** Form field defaults (e.g. date preset keys like `1m`, `3m`, `1y`). */
export type FormDefaults = {
  datePreset?: string;
};

export type Preferences = {
  language?: string;
  fontSize?: FontSize;
  fontFamily?: FontFamily;
  spacing?: Spacing;
  profileImages: Record<string, string>;
  menuSettings: MenuSettings;
  dateFormat?: DateFormatPreferences;
  formDefaults?: FormDefaults;
};

export type ProfileUser = {
  first_name?: string;
  last_name?: string;
  username?: string;
};

export type ObserveSearchParams = {
  plate?: Record<string, unknown>;
  date?: [number, number];
  type?: string;
};

export type { Env };

export const defaultPreferences: Preferences = {
  profileImages: {},
  menuSettings: { visibleMenus: [], defaultExpanded: true },
  fontSize: "base",
  spacing: "normal",
  dateFormat: {
    monthFormat: "digit",
    separator: "/",
    yearFormat: "full",
  },
};
