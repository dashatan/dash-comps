"use client";

import { ImageIcon, Sparkles } from "lucide-react";
import { usePreferences } from "@dash/core";
import { GridContainer } from "@/components/common/grid";
import BasicTextInput from "@/components/common/inputs/text/basic";
import { LogoSection } from "@dash/ui/layout/dashboard/sidebar";
import { cn } from "@/lib";
import {
  DemoFormFooter,
  SettingsField,
} from "@/features/settings/components/settings-form-shell";
import { PanelCard } from "@/features/overview/overview-components";
import { useAppLanguage } from "@/i18n/use-app-language";
import { PageHeader } from "@/shared/page-header";

const LOGO_PRESETS = [
  { id: "logo", src: "/logo.svg", labelKey: "settings.branding.presets.logo" },
  {
    id: "favicon",
    src: "/favicon.svg",
    labelKey: "settings.branding.presets.favicon",
  },
] as const;

function BrandingPreview({
  appName,
  logoSrc,
  expanded,
}: {
  appName: string;
  logoSrc: string;
  expanded: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-lg border border-sidebar-border bg-sidebar p-3",
        expanded ? "w-full max-w-xs" : "w-20",
      )}
    >
      <LogoSection
        expand={expanded}
        onLogoClick={() => undefined}
        appName={appName}
        logoSrc={logoSrc}
      />
    </div>
  );
}

export function BrandingPage() {
  const { t } = useAppLanguage();
  const { preferences, updatePreference } = usePreferences();
  const branding = preferences.sidebarBranding;

  const updateBranding = (patch: Partial<typeof branding>) => {
    updatePreference("sidebarBranding", { ...branding, ...patch });
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <PageHeader
        title={t("settings.branding.title")}
        subtitle={t("settings.branding.subtitle")}
        breadcrumbLabel={t("settings.title")}
        breadcrumbHref="/settings/branding"
      />
      <GridContainer
        className="auto-rows-auto grid-rows-none items-stretch pb-24"
        aria-label={t("settings.branding.title")}
      >
        <PanelCard
          className="col-span-12 @lg:col-span-6"
          icon={<Sparkles className="size-5" />}
          title={t("settings.branding.form.title")}
          description={t("settings.branding.form.description")}
        >
          <div className="flex flex-col gap-3">
            <SettingsField label={t("settings.branding.fields.appName")}>
              <BasicTextInput
                value={branding.appName}
                onChange={(event) =>
                  updateBranding({ appName: event.target.value })
                }
              />
            </SettingsField>
            <SettingsField
              label={t("settings.branding.fields.logoUrl")}
              description={t("settings.branding.fields.logoUrlDescription")}
            >
              <BasicTextInput
                value={branding.logoSrc}
                onChange={(event) =>
                  updateBranding({ logoSrc: event.target.value })
                }
                className="font-mono text-xs dir-ltr"
              />
            </SettingsField>
          </div>
        </PanelCard>

        <PanelCard
          className="col-span-12 @lg:col-span-6"
          icon={<ImageIcon className="size-5" />}
          title={t("settings.branding.presets.title")}
          description={t("settings.branding.presets.description")}
        >
          <div className="grid grid-cols-2 gap-3">
            {LOGO_PRESETS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => updateBranding({ logoSrc: preset.src })}
                className={cn(
                  "flex flex-col items-center gap-2 rounded-lg border p-4 transition-colors hover:bg-muted/30",
                  branding.logoSrc === preset.src
                    ? "border-primary bg-primary/5"
                    : "border-border",
                )}
              >
                <img
                  src={preset.src}
                  alt={t(preset.labelKey as Parameters<typeof t>[0])}
                  className="size-12 rounded-lg object-contain"
                />
                <span className="text-xs text-muted-foreground">
                  {t(preset.labelKey as Parameters<typeof t>[0])}
                </span>
              </button>
            ))}
          </div>
        </PanelCard>

        <PanelCard
          className="col-span-12"
          icon={<ImageIcon className="size-5" />}
          title={t("settings.branding.preview.title")}
          description={t("settings.branding.preview.description")}
        >
          <div className="flex flex-wrap items-start gap-6">
            <div className="flex flex-col gap-2">
              <p className="text-xs text-muted-foreground">
                {t("settings.branding.preview.expanded")}
              </p>
              <BrandingPreview
                appName={branding.appName}
                logoSrc={branding.logoSrc}
                expanded
              />
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-xs text-muted-foreground">
                {t("settings.branding.preview.collapsed")}
              </p>
              <BrandingPreview
                appName={branding.appName}
                logoSrc={branding.logoSrc}
                expanded={false}
              />
            </div>
          </div>
        </PanelCard>
      </GridContainer>
      <DemoFormFooter />
    </div>
  );
}
