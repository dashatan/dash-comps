import { useAppStore, appStore } from "./app-store";

export { useAppStore, appStore } from "./app-store";
export {
  useDashboardStore,
  default as useDashboardSignals,
} from "./dashboard-store";
export { useObserveStore, setObservesSearchParams } from "./observe-store";
export { default as storage } from "./storage";
export type * from "./types";
export type { Env } from "./env";
export { defaultPreferences } from "./types";

type LegacyRootState = {
  root: {
    app: {
      env: import("./env").Env;
      preferences: import("./types").Preferences;
      preferencesLoaded: boolean;
      serverTimeDiff: number;
    };
  };
};

type LegacyAction =
  | {
      type: "app/setPreferences";
      payload: Partial<import("./types").Preferences>;
    }
  | {
      type: "app/updatePreference";
      payload: {
        key: keyof import("./types").Preferences;
        value: import("./types").Preferences[keyof import("./types").Preferences];
      };
    }
  | { type: "app/resetPreferences" }
  | { type: "app/updateProfileImages"; payload: Record<string, string> };

export const useAppSelector = <T>(selector: (state: LegacyRootState) => T): T =>
  useAppStore((state) =>
    selector({
      root: {
        app: {
          env: state.env,
          preferences: state.preferences,
          preferencesLoaded: state.preferencesLoaded,
          serverTimeDiff: state.serverTimeDiff,
        },
      },
    }),
  );

export const useAppDispatch = () => {
  const setPreferencesAction = useAppStore((state) => state.setPreferences);
  const updatePreferenceAction = useAppStore((state) => state.updatePreference);
  const resetPreferencesAction = useAppStore((state) => state.resetPreferences);
  const updateProfileImagesAction = useAppStore(
    (state) => state.updateProfileImages,
  );

  return (action: LegacyAction) => {
    switch (action.type) {
      case "app/setPreferences":
        setPreferencesAction(action.payload);
        break;
      case "app/updatePreference":
        updatePreferenceAction(action.payload.key, action.payload.value);
        break;
      case "app/resetPreferences":
        resetPreferencesAction();
        break;
      case "app/updateProfileImages":
        updateProfileImagesAction(action.payload);
        break;
      default:
        break;
    }
  };
};

export function setPreferences(
  preferences: Partial<import("./types").Preferences>,
) {
  return { type: "app/setPreferences" as const, payload: preferences };
}

export function updatePreference<
  K extends keyof import("./types").Preferences,
>(payload: { key: K; value: import("./types").Preferences[K] }) {
  return { type: "app/updatePreference" as const, payload };
}

export function resetPreferences() {
  return { type: "app/resetPreferences" as const };
}

export function updateProfileImages(payload: Record<string, string>) {
  return { type: "app/updateProfileImages" as const, payload };
}

export type { Preferences, FontSize, FontFamily, Spacing } from "./types";

const legacyStore = {
  getState: () => {
    const state = useAppStore.getState();
    return {
      root: {
        app: {
          env: state.env,
          preferences: state.preferences,
          preferencesLoaded: state.preferencesLoaded,
          serverTimeDiff: state.serverTimeDiff,
        },
      },
    };
  },
};

export default legacyStore;
