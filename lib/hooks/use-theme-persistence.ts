'use client';

import { useState, useEffect } from 'react';

export type ColorSetting = {
  name: string;
  value: string;
  theme: 'light' | 'dark';
};

export function useThemePersistence() {
  const [isLoaded, setIsLoaded] = useState(false);

  // Load saved theme from localStorage on component mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const savedColors = localStorage.getItem('dash-comps-theme');

      if (savedColors) {
        const colorSettings = JSON.parse(savedColors) as ColorSetting[];
        const currentTheme = document.documentElement.classList.contains('dark')
          ? 'dark'
          : 'light';

        // Apply saved colors for the current theme
        colorSettings
          .filter((setting) => setting.theme === currentTheme)
          .forEach(({ name, value }) => {
            document.documentElement.style.setProperty(name, value);
          });
      }

      setIsLoaded(true);
    } catch (error) {
      console.error('Failed to load saved theme:', error);
      setIsLoaded(true);
    }
  }, []);

  // Save current theme to localStorage
  const saveTheme = (colors: ColorSetting[]) => {
    if (typeof window === 'undefined') return;

    try {
      // Get existing saved colors
      const savedColors = localStorage.getItem('dash-comps-theme');
      let existingColors: ColorSetting[] = [];

      if (savedColors) {
        existingColors = JSON.parse(savedColors);
      }

      // Filter out existing colors for the current theme
      const currentTheme = document.documentElement.classList.contains('dark')
        ? 'dark'
        : 'light';
      const otherThemeColors = existingColors.filter(
        (setting) => setting.theme !== currentTheme
      );

      // Combine with new colors
      const updatedColors = [...otherThemeColors, ...colors];
      localStorage.setItem('dash-comps-theme', JSON.stringify(updatedColors));
    } catch (error) {
      console.error('Failed to save theme:', error);
    }
  };

  // Clear saved theme
  const clearSavedTheme = () => {
    if (typeof window === 'undefined') return;

    try {
      localStorage.removeItem('dash-comps-theme');
    } catch (error) {
      console.error('Failed to clear saved theme:', error);
    }
  };

  return { isLoaded, saveTheme, clearSavedTheme };
}
