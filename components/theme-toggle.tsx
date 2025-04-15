'use client';

import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/lib/language-context';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const { t } = useLanguage();

  const handleThemeChange = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);

    // Apply saved colors for the new theme
    const savedColors = localStorage.getItem('dash-comps-theme');
    if (savedColors) {
      const colorSettings = JSON.parse(savedColors);
      const themeColors = colorSettings.filter(
        (setting: { theme: string }) => setting.theme === newTheme
      );

      // Remove all custom properties first
      colorSettings.forEach((setting: { name: string }) => {
        document.documentElement.style.removeProperty(setting.name);
      });

      // Apply new theme colors
      themeColors.forEach(
        ({ name, value }: { name: string; value: string }) => {
          document.documentElement.style.setProperty(name, value);
        }
      );
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className="rounded-full hover:text-primary transition-colors"
      onClick={handleThemeChange}
      aria-label={t('common.toggleTheme')}
    >
      <Sun className="h-5 w-5 rotate-0 scale-100 transition-transform dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-transform dark:rotate-0 dark:scale-100" />
      <span className="sr-only">{t('common.toggleTheme')}</span>
    </Button>
  );
}
