"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/common/buttons";
import { useLanguage } from "@/lib";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const { t } = useLanguage();
  const [mounted, setMounted] = React.useState(false);

  // After component mounts, we can safely access the theme
  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Avoid hydration mismatch by rendering a placeholder before mounting
  if (!mounted) {
    return <Button variant="text" size={32} className="rounded-full" />;
  }

  const handleThemeChange = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);

    // Apply saved colors for the new theme
    const savedColors = localStorage.getItem("theme-colors");
    if (savedColors) {
      try {
        const colorSettings = JSON.parse(savedColors);
        if (Array.isArray(colorSettings)) {
          const themeColors = colorSettings.filter(
            (setting: { theme: string }) => setting.theme === newTheme,
          );

          // Remove all custom properties first
          colorSettings.forEach((setting: { name: string }) => {
            document.documentElement.style.removeProperty(setting.name);
          });

          // Apply new theme colors
          themeColors.forEach(({ name, value }: { name: string; value: string }) => {
            document.documentElement.style.setProperty(name, value);
          });
        }
      } catch (error) {
        console.warn("Failed to parse theme-colors:", error);
      }
    }
  };

  return (
    <Button
      variant="text"
      size={32}
      className="hover:text-primary rounded-full transition-colors"
      onClick={handleThemeChange}
      aria-label={t("common.toggleTheme")}
    >
      <Sun className="h-5 w-5 scale-100 rotate-0 transition-transform dark:scale-0 dark:-rotate-90" />
      <Moon className="absolute h-5 w-5 scale-0 rotate-90 transition-transform dark:scale-100 dark:rotate-0" />
      <span className="sr-only">{t("common.toggleTheme")}</span>
    </Button>
  );
}
