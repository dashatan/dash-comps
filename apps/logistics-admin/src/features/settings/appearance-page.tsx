"use client";

import { useMemo } from "react";
import { useTheme } from "next-themes";
import {
  Clock,
  Languages,
  LayoutGrid,
  Moon,
  Palette,
  Type,
} from "lucide-react";
import { useLanguage, usePreferences } from "@dash/core";
import type { TranslationKeys } from "@dash/core/language/locales";
import type { FontFamily, FontSize, Spacing } from "@/store";
import { GridContainer } from "@/components/common/grid";
import { Select } from "@/components/common/inputs/select";
import { Checkbox } from "@/components/common/inputs/checkbox";
import { menuItems } from "@/config/menu-items";
import {
  DemoFormFooter,
  SettingsField,
} from "@/features/settings/components/settings-form-shell";
import { PanelCard } from "@/features/overview/overview-components";
import { useLogisticsT } from "@/i18n/provider";
import { PageHeader } from "@/shared/page-header";

const FONT_SIZES: FontSize[] = ["xs", "sm", "base", "lg", "xl"];
const FONT_FAMILIES: Array<{
  value: FontFamily | "default";
  labelKey: string;
}> = [
  { value: "default", labelKey: "settings.appearance.fontFamilies.default" },
  { value: "peyda", labelKey: "settings.appearance.fontFamilies.peyda" },
  { value: "vazir", labelKey: "settings.appearance.fontFamilies.vazir" },
  { value: "yekan", labelKey: "settings.appearance.fontFamilies.yekan" },
  { value: "mono", labelKey: "settings.appearance.fontFamilies.mono" },
];
const SPACING_OPTIONS: Spacing[] = ["compact", "normal", "comfortable"];
const LANGUAGE_OPTIONS = [
  { value: "en", label: "English" },
  { value: "fa", label: "فارسی" },
  { value: "ar", label: "العربية" },
];
const THEME_OPTIONS = [
  { value: "light", labelKey: "settings.appearance.themes.light" },
  { value: "dark", labelKey: "settings.appearance.themes.dark" },
  { value: "system", labelKey: "settings.appearance.themes.system" },
] as const;

function getTopLevelPaths(): string[] {
  return menuItems
    .map((item) => item.path)
    .filter((path): path is string => Boolean(path));
}

function isMenuVisible(path: string, visibleMenus: string[]): boolean {
  if (visibleMenus.length === 0) return true;
  return visibleMenus.includes(path);
}

export function AppearancePage() {
  const t = useLogisticsT();
  const { theme, setTheme } = useTheme();
  const { language, setLanguage, t: tNav } = useLanguage();
  const { preferences, updatePreference, resetPreferences } = usePreferences();

  const topLevelMenus = useMemo(
    () =>
      menuItems
        .filter((item) => item.path)
        .map((item) => ({
          path: item.path as string,
          titleKey: item.title,
        })),
    [],
  );

  const allPaths = useMemo(() => getTopLevelPaths(), []);

  const toggleMenuVisibility = (path: string, checked: boolean) => {
    const current = preferences.menuSettings.visibleMenus;
    let next: string[];

    if (current.length === 0) {
      next = checked ? allPaths : allPaths.filter((p) => p !== path);
    } else if (checked) {
      next = [...new Set([...current, path])];
      if (next.length >= allPaths.length) {
        next = [];
      }
    } else {
      next = current.filter((p) => p !== path);
    }

    updatePreference("menuSettings", {
      ...preferences.menuSettings,
      visibleMenus: next,
    });
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <PageHeader
        title={t("settings.appearance.title")}
        subtitle={t("settings.appearance.subtitle")}
        breadcrumbLabel={t("settings.title")}
        breadcrumbHref="/settings/appearance"
      />
      <GridContainer
        className="auto-rows-auto grid-rows-none items-stretch pb-24"
        aria-label={t("settings.appearance.title")}
      >
        <PanelCard
          className="col-span-12 @lg:col-span-6"
          icon={<Palette className="size-5" />}
          title={t("settings.appearance.theme.title")}
          description={t("settings.appearance.theme.description")}
        >
          <SettingsField label={t("settings.appearance.theme.label")}>
            <Select.Single
              options={THEME_OPTIONS.map((option) => ({
                value: option.value,
                label: t(option.labelKey),
              }))}
              value={theme ?? "system"}
              onChange={(value) => {
                if (typeof value === "string") {
                  setTheme(value);
                }
              }}
            />
          </SettingsField>
        </PanelCard>

        <PanelCard
          className="col-span-12 @lg:col-span-6"
          icon={<Languages className="size-5" />}
          title={t("settings.appearance.language.title")}
          description={t("settings.appearance.language.description")}
        >
          <SettingsField label={t("settings.appearance.language.label")}>
            <Select.Single
              options={LANGUAGE_OPTIONS}
              value={language}
              onChange={(value) => {
                if (typeof value === "string") {
                  setLanguage(value as typeof language);
                  updatePreference("language", value);
                }
              }}
            />
          </SettingsField>
        </PanelCard>

        <PanelCard
          className="col-span-12 @lg:col-span-4"
          icon={<Type className="size-5" />}
          title={t("settings.appearance.typography.title")}
          description={t("settings.appearance.typography.description")}
        >
          <div className="flex flex-col gap-3">
            <SettingsField label={t("settings.appearance.fontSize.label")}>
              <Select.Single
                options={FONT_SIZES.map((size) => ({
                  value: size,
                  label: t(`settings.appearance.fontSizes.${size}`),
                }))}
                value={preferences.fontSize ?? "base"}
                onChange={(value) => {
                  if (typeof value === "string") {
                    updatePreference("fontSize", value as FontSize);
                  }
                }}
              />
            </SettingsField>
            <SettingsField label={t("settings.appearance.fontFamily.label")}>
              <Select.Single
                options={FONT_FAMILIES.map((family) => ({
                  value: family.value,
                  label: t(family.labelKey as Parameters<typeof t>[0]),
                }))}
                value={preferences.fontFamily ?? "default"}
                onChange={(value) => {
                  if (value === "default") {
                    updatePreference("fontFamily", undefined);
                    document.documentElement.removeAttribute(
                      "data-font-family",
                    );
                  } else if (typeof value === "string") {
                    updatePreference("fontFamily", value as FontFamily);
                  }
                }}
              />
            </SettingsField>
            <SettingsField label={t("settings.appearance.spacing.label")}>
              <Select.Single
                options={SPACING_OPTIONS.map((spacing) => ({
                  value: spacing,
                  label: t(`settings.appearance.spacingOptions.${spacing}`),
                }))}
                value={preferences.spacing ?? "normal"}
                onChange={(value) => {
                  if (typeof value === "string") {
                    updatePreference("spacing", value as Spacing);
                  }
                }}
              />
            </SettingsField>
          </div>
        </PanelCard>

        <PanelCard
          className="col-span-12 @lg:col-span-8"
          icon={<LayoutGrid className="size-5" />}
          title={t("settings.appearance.menu.title")}
          description={t("settings.appearance.menu.description")}
        >
          <div className="flex flex-col gap-3">
            <Checkbox.Labeled
              id="menu-default-expanded"
              label={t("settings.appearance.menu.defaultExpanded")}
              checked={preferences.menuSettings.defaultExpanded ?? true}
              onChange={(checked) =>
                updatePreference("menuSettings", {
                  ...preferences.menuSettings,
                  defaultExpanded: checked,
                })
              }
            />
            <Checkbox.Labeled
              id="menu-show-clock"
              label={t("settings.appearance.menu.showClock")}
              checked={preferences.menuSettings.showClock ?? true}
              onChange={(checked) =>
                updatePreference("menuSettings", {
                  ...preferences.menuSettings,
                  showClock: checked,
                })
              }
            />
            <div className="mt-2 flex flex-col gap-2 border-t border-border pt-3">
              <p className="text-xs font-medium text-muted-foreground">
                {t("settings.appearance.menu.visibleModules")}
              </p>
              {topLevelMenus.map((item) => (
                <Checkbox.Labeled
                  key={item.path}
                  id={`menu-visible-${item.path}`}
                  label={tNav(item.titleKey as TranslationKeys)}
                  checked={isMenuVisible(
                    item.path,
                    preferences.menuSettings.visibleMenus,
                  )}
                  onChange={(checked) =>
                    toggleMenuVisibility(item.path, checked)
                  }
                />
              ))}
            </div>
          </div>
        </PanelCard>

        <PanelCard
          className="col-span-12"
          icon={<Moon className="size-5" />}
          title={t("settings.appearance.preview.title")}
          description={t("settings.appearance.preview.description")}
        >
          <div className="flex flex-wrap items-center gap-4 rounded-lg border border-border bg-muted/20 p-4">
            <Clock className="size-5 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              {t("settings.appearance.preview.hint")}
            </p>
          </div>
        </PanelCard>
      </GridContainer>
      <DemoFormFooter onReset={() => resetPreferences()} />
    </div>
  );
}
