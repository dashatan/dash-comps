"use client";

import { useEffect, useCallback } from "react";
import { useLanguage } from "@/lib/language/client";
import {
  type Preferences,
  type FontSize,
  type FontFamily,
  type Spacing,
  useAppStore,
} from "@/store";

const applyFontSettings = (fontSize?: FontSize, fontFamily?: FontFamily) => {
  if (typeof window === "undefined") return;
  if (fontSize) {
    document.documentElement.setAttribute("data-font-size", fontSize);
  }
  if (fontFamily) {
    document.documentElement.setAttribute("data-font-family", fontFamily);
  }
};

const applySpacingSettings = (spacing?: Spacing) => {
  if (typeof window === "undefined") return;
  if (spacing) {
    document.documentElement.setAttribute("data-spacing", spacing);
  }
};

export function usePreferences() {
  const { language, setLanguage } = useLanguage();
  const preferences = useAppStore((state) => state.preferences);
  const isLoaded = useAppStore((state) => state.preferencesLoaded);
  const setPreferences = useAppStore((state) => state.setPreferences);
  const updatePreference = useAppStore((state) => state.updatePreference);
  const resetPreferences = useAppStore((state) => state.resetPreferences);
  const updateProfileImages = useAppStore((state) => state.updateProfileImages);

  useEffect(() => {
    if (!isLoaded) return;
    applyFontSettings(preferences.fontSize, preferences.fontFamily);
    applySpacingSettings(preferences.spacing);
  }, [preferences.fontSize, preferences.fontFamily, preferences.spacing, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    if (preferences.language && preferences.language !== language) {
      setLanguage(preferences.language as typeof language);
    }
  }, [preferences.language, language, setLanguage, isLoaded]);

  const updatePreferenceValue = useCallback(
    <K extends keyof Preferences>(key: K, value: Preferences[K]) => {
      updatePreference(key, value);
    },
    [updatePreference],
  );

  const savePreferences = useCallback(
    (newPreferences: Partial<Preferences>) => {
      setPreferences(newPreferences);

      if (newPreferences.language && newPreferences.language !== language) {
        setLanguage(newPreferences.language as typeof language);
      }

      if (newPreferences.fontSize || newPreferences.fontFamily) {
        applyFontSettings(newPreferences.fontSize, newPreferences.fontFamily);
      }

      if (newPreferences.spacing) {
        applySpacingSettings(newPreferences.spacing);
      }
    },
    [language, setLanguage, setPreferences],
  );

  const resetPreferencesToDefaults = useCallback(() => {
    resetPreferences();
    document.documentElement.removeAttribute("data-font-size");
    document.documentElement.removeAttribute("data-font-family");
    document.documentElement.removeAttribute("data-spacing");
    applyFontSettings("base", "peyda");
    applySpacingSettings("normal");
  }, [resetPreferences]);

  const setProfileImage = useCallback(
    (hash: string, imageData: string) => {
      updateProfileImages({ [hash]: imageData });
    },
    [updateProfileImages],
  );

  const removeProfileImage = useCallback(
    (hash: string) => {
      const updatedImages = { ...preferences.profileImages };
      delete updatedImages[hash];
      updatePreference("profileImages", updatedImages);
    },
    [preferences.profileImages, updatePreference],
  );

  const clearAllProfileImages = useCallback(() => {
    updatePreference("profileImages", {});
  }, [updatePreference]);

  return {
    preferences,
    isLoaded,
    updatePreference: updatePreferenceValue,
    savePreferences,
    resetPreferences: resetPreferencesToDefaults,
    setProfileImage,
    removeProfileImage,
    clearAllProfileImages,
  };
}
