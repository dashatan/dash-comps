"use client";

import { useState, useEffect } from "react";

export type ColorSetting = {
  name: string;
  value: string;
  theme: "light" | "dark";
};

export function useThemePersistence() {
  const [isLoaded, setIsLoaded] = useState(false);

  // Load saved theme from localStorage on component mount
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const savedColors = localStorage.getItem("theme-colors");

      if (savedColors) {
        // Check if the value is valid JSON (not a plain string like "dark")
        let colorSettings: ColorSetting[];
        try {
          colorSettings = JSON.parse(savedColors) as ColorSetting[];
          // Validate that it's an array
          if (!Array.isArray(colorSettings)) {
            throw new Error("Invalid color settings format");
          }
        } catch (parseError) {
          // If parsing fails, clear the corrupted data
          console.warn("Invalid theme-colors data, clearing:", parseError);
          localStorage.removeItem("theme-colors");
          setIsLoaded(true);
          return;
        }

        const currentTheme = document.documentElement.classList.contains("dark")
          ? "dark"
          : "light";

        // Apply saved colors for the current theme
        colorSettings
          .filter((setting) => setting.theme === currentTheme)
          .forEach(({ name, value }) => {
            document.documentElement.style.setProperty(name, value);
          });
      }

      setIsLoaded(true);
    } catch (error) {
      console.error("Failed to load saved theme:", error);
      setIsLoaded(true);
    }
  }, []);

  // Save current theme to localStorage
  const saveTheme = (colors: ColorSetting[]) => {
    if (typeof window === "undefined") return;

    try {
      // Get existing saved colors
      const savedColors = localStorage.getItem("theme-colors");
      let existingColors: ColorSetting[] = [];

      if (savedColors) {
        try {
          const parsed = JSON.parse(savedColors);
          // Validate that it's an array
          if (Array.isArray(parsed)) {
            existingColors = parsed;
          }
        } catch (parseError) {
          // If parsing fails, start with empty array
          console.warn(
            "Failed to parse existing theme-colors, starting fresh:",
            parseError,
          );
          existingColors = [];
        }
      }

      // Filter out existing colors for the current theme
      const currentTheme =
        typeof document !== "undefined" &&
        document.documentElement.classList.contains("dark")
          ? "dark"
          : "light";
      const otherThemeColors = existingColors.filter(
        (setting) => setting.theme !== currentTheme,
      );

      // Combine with new colors
      const updatedColors = [...otherThemeColors, ...colors];
      localStorage.setItem("theme-colors", JSON.stringify(updatedColors));
    } catch (error) {
      console.error("Failed to save theme:", error);
    }
  };

  // Clear saved theme
  const clearSavedTheme = () => {
    if (typeof window === "undefined") return;

    try {
      localStorage.removeItem("theme-colors");
    } catch (error) {
      console.error("Failed to clear saved theme:", error);
    }
  };

  return { isLoaded, saveTheme, clearSavedTheme };
}
