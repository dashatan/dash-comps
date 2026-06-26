import { ColorSetting } from "@/lib/hooks/use-theme-persistence";
import { ColorVar } from "./types";
import { getCurrentTheme } from "./color-utils";

/**
 * Extracts CSS variables from the document
 */
export function extractThemeColors(): ColorVar[] {
  const root = document.documentElement;
  const computedStyle = getComputedStyle(root);

  return [
    {
      name: "--background",
      label: "Background",
      value: computedStyle.getPropertyValue("--background").trim(),
    },
    {
      name: "--foreground",
      label: "Foreground",
      value: computedStyle.getPropertyValue("--foreground").trim(),
    },
    {
      name: "--card",
      label: "Card",
      value: computedStyle.getPropertyValue("--card").trim(),
    },
    {
      name: "--card-foreground",
      label: "Card Foreground",
      value: computedStyle.getPropertyValue("--card-foreground").trim(),
    },
    {
      name: "--primary",
      label: "Primary",
      value: computedStyle.getPropertyValue("--primary").trim(),
    },
    {
      name: "--primary-foreground",
      label: "Primary Foreground",
      value: computedStyle.getPropertyValue("--primary-foreground").trim(),
    },
    {
      name: "--secondary",
      label: "Secondary",
      value: computedStyle.getPropertyValue("--secondary").trim(),
    },
    {
      name: "--muted",
      label: "Muted",
      value: computedStyle.getPropertyValue("--muted").trim(),
    },
    {
      name: "--muted-foreground",
      label: "Muted Foreground",
      value: computedStyle.getPropertyValue("--muted-foreground").trim(),
    },
    {
      name: "--accent",
      label: "Accent",
      value: computedStyle.getPropertyValue("--accent").trim(),
    },
    {
      name: "--border",
      label: "Border",
      value: computedStyle.getPropertyValue("--border").trim(),
    },
  ];
}

/**
 * Categorizes colors into background, primary, and utility groups
 */
export function categorizeColors(colors: ColorVar[]) {
  const background = colors.filter(
    (c) =>
      c.name === "--background" ||
      c.name === "--foreground" ||
      c.name === "--card" ||
      c.name === "--card-foreground",
  );

  const primary = colors.filter(
    (c) =>
      c.name === "--primary" ||
      c.name === "--primary-foreground" ||
      c.name === "--secondary" ||
      c.name === "--accent",
  );

  const utility = colors.filter(
    (c) =>
      c.name === "--muted" ||
      c.name === "--muted-foreground" ||
      c.name === "--border",
  );

  return { background, primary, utility };
}

/**
 * Creates color settings with theme information
 */
export function createColorSettings(colors: ColorVar[]): ColorSetting[] {
  const currentTheme = getCurrentTheme();
  return colors.map(({ name, value }) => ({
    name,
    value,
    theme: currentTheme,
  }));
}

/**
 * Resets theme colors for the current theme
 */
export function resetThemeColors(colors: ColorVar[]) {
  const currentTheme = getCurrentTheme();

  // Remove all custom properties for the current theme
  colors.forEach((color) => {
    document.documentElement.style.removeProperty(color.name);
  });

  // Clear saved theme for the current theme only
  const savedColors = localStorage.getItem("theme-colors");
  if (savedColors) {
    try {
      const existingColors = JSON.parse(savedColors) as ColorSetting[];
      if (Array.isArray(existingColors)) {
        const otherThemeColors = existingColors.filter(
          (setting) => setting.theme !== currentTheme,
        );
        localStorage.setItem("theme-colors", JSON.stringify(otherThemeColors));
      }
    } catch (error) {
      console.warn("Failed to parse theme-colors, clearing:", error);
      localStorage.removeItem("theme-colors");
    }
  }
}
