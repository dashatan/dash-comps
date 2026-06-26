import { Link } from "@tanstack/react-router";
import { ArrowRight, Building2, Palette, Plug, Sparkles } from "lucide-react";
import { GridContainer } from "@/components/common/grid";
import { PanelCard } from "@/features/overview/overview-components";
import { useLogisticsT } from "@/i18n/provider";
import { PageHeader } from "@/shared/page-header";

const SETTINGS_LINKS = [
  {
    id: "appearance",
    titleKey: "settings.appearance.title",
    descriptionKey: "settings.appearance.subtitle",
    to: "/settings/appearance",
    icon: Palette,
  },
  {
    id: "branding",
    titleKey: "settings.branding.title",
    descriptionKey: "settings.branding.subtitle",
    to: "/settings/branding",
    icon: Sparkles,
  },
  {
    id: "organisation",
    titleKey: "settings.organisation.title",
    descriptionKey: "settings.organisation.subtitle",
    to: "/settings/organisation",
    icon: Building2,
  },
  {
    id: "integrations",
    titleKey: "settings.integrations.title",
    descriptionKey: "settings.integrations.subtitle",
    to: "/settings/integrations",
    icon: Plug,
  },
] as const;

export function SettingsIndexPage() {
  const t = useLogisticsT();

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <PageHeader
        title={t("settings.title")}
        subtitle={t("settings.index.subtitle")}
        breadcrumbLabel={t("settings.title")}
        breadcrumbHref="/settings"
      />
      <GridContainer
        className="auto-rows-auto grid-rows-none items-stretch"
        aria-label={t("settings.title")}
      >
        {SETTINGS_LINKS.map((item) => {
          const Icon = item.icon;

          return (
            <PanelCard
              key={item.id}
              className="col-span-12 @lg:col-span-6"
              icon={<Icon className="size-5" />}
              title={t(item.titleKey)}
              description={t(item.descriptionKey)}
            >
              <Link
                to={item.to}
                className="mt-auto inline-flex w-fit items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                {t("settings.index.open")}
                <ArrowRight className="size-4" />
              </Link>
            </PanelCard>
          );
        })}
      </GridContainer>
    </div>
  );
}
