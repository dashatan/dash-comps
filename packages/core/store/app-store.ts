import { create } from "zustand";
import type { Env } from "./env";
import { defaultPreferences, type Preferences } from "./types";

type AppStoreState = {
  env: Env;
  preferences: Preferences;
  preferencesLoaded: boolean;
  serverTimeDiff: number;
  setEnv: (env: Env) => void;
  setPreferences: (preferences: Partial<Preferences>) => void;
  updatePreference: <K extends keyof Preferences>(key: K, value: Preferences[K]) => void;
  resetPreferences: () => void;
  updateProfileImages: (images: Record<string, string>) => void;
  setPreferencesLoaded: (loaded: boolean) => void;
  setServerTimeDiff: (diff: number) => void;
};

export const useAppStore = create<AppStoreState>((set) => ({
  env: {},
  preferences: defaultPreferences,
  preferencesLoaded: true,
  serverTimeDiff: 0,
  setEnv: (env) => set({ env }),
  setPreferences: (preferences) =>
    set((state) => ({
      preferences: { ...state.preferences, ...preferences },
    })),
  updatePreference: (key, value) =>
    set((state) => ({
      preferences: { ...state.preferences, [key]: value },
    })),
  resetPreferences: () => set({ preferences: defaultPreferences }),
  updateProfileImages: (images) =>
    set((state) => ({
      preferences: {
        ...state.preferences,
        profileImages: { ...state.preferences.profileImages, ...images },
      },
    })),
  setPreferencesLoaded: (preferencesLoaded) => set({ preferencesLoaded }),
  setServerTimeDiff: (serverTimeDiff) => set({ serverTimeDiff }),
}));

export const appStore = useAppStore;
