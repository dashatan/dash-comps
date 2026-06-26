"use client";

import { useEffect } from "react";
import { usePreferences } from "@dash/core";
import {
  useAppStore,
  defaultPreferences,
  storage,
  type Preferences,
} from "@/store";

const STORAGE_KEY = "dash-logistics-preferences";

function mergePreferences(stored: Partial<Preferences>): Preferences {
  return {
    ...defaultPreferences,
    ...stored,
    profileImages: stored.profileImages ?? defaultPreferences.profileImages,
    menuSettings: {
      ...defaultPreferences.menuSettings,
      ...stored.menuSettings,
    },
    sidebarBranding: {
      ...defaultPreferences.sidebarBranding,
      ...stored.sidebarBranding,
    },
    dateFormat: {
      ...defaultPreferences.dateFormat,
      ...stored.dateFormat,
    },
  };
}

export function PreferencesBootstrap() {
  const setPreferences = useAppStore((state) => state.setPreferences);
  const setPreferencesLoaded = useAppStore(
    (state) => state.setPreferencesLoaded,
  );

  usePreferences();

  useEffect(() => {
    const stored = storage.local.get<Partial<Preferences>>(STORAGE_KEY);
    if (stored) {
      setPreferences(mergePreferences(stored));
    }
    setPreferencesLoaded(true);

    return useAppStore.subscribe((state, prev) => {
      if (state.preferences !== prev.preferences) {
        storage.local.set(STORAGE_KEY, state.preferences);
      }
    });
  }, [setPreferences, setPreferencesLoaded]);

  return null;
}
