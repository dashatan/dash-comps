import { useQuery } from "@tanstack/react-query";
import { Building2, Globe2, Wallet } from "lucide-react";
import { getHubById } from "@dash/logistics-seed";
import { GridContainer } from "@/components/common/grid";
import {
  PanelCard,
  WidgetDetailRow,
} from "@/features/overview/overview-components";
import { queryKeys } from "@/core/query-keys";
import { settingsRepository } from "@/infrastructure/http/repositories";
import { useLogisticsT } from "@/i18n/provider";
import Loading from "@/components/common/loading";
import { PageHeader } from "@/shared/page-header";

export function OrganisationPage() {
  const t = useLogisticsT();

  const settingsQuery = useQuery({
    queryKey: queryKeys.settings.organisation,
    queryFn: () => settingsRepository.getOrganisation(),
  });

  if (settingsQuery.isLoading) {
    return (
      <div className="flex min-h-0 flex-1 flex-col">
        <PageHeader
          title={t("settings.organisation.title")}
          subtitle={t("settings.organisation.subtitle")}
          breadcrumbLabel={t("settings.title")}
          breadcrumbHref="/settings/organisation"
        />
        <div className="flex flex-1 items-center justify-center p-12">
          <Loading label={t("common.loading")} />
        </div>
      </div>
    );
  }

  if (settingsQuery.isError || !settingsQuery.data) {
    return (
      <div className="flex min-h-0 flex-1 flex-col">
        <PageHeader
          title={t("settings.organisation.title")}
          subtitle={t("settings.organisation.subtitle")}
          breadcrumbLabel={t("settings.title")}
          breadcrumbHref="/settings/organisation"
        />
        <div className="flex flex-1 items-center justify-center p-12 text-sm text-destructive">
          Failed to load data
        </div>
      </div>
    );
  }

  const settings = settingsQuery.data;
  const depotCities = settings.depotHubIds
    .map((hubId) => getHubById(hubId).city)
    .join(", ");

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <PageHeader
        title={t("settings.organisation.title")}
        subtitle={t("settings.organisation.subtitle")}
        breadcrumbLabel={t("settings.title")}
        breadcrumbHref="/settings/organisation"
      />
      <GridContainer
        className="auto-rows-auto grid-rows-none items-stretch"
        aria-label={t("settings.organisation.title")}
      >
        <PanelCard
          className="col-span-12 @lg:col-span-6"
          icon={<Building2 className="size-5" />}
          title={t("settings.organisation.profile.title")}
          description={t("settings.organisation.profile.description")}
        >
          <WidgetDetailRow
            label={t("settings.organisation.fields.companyName")}
            value={settings.companyName}
          />
          <WidgetDetailRow
            label={t("settings.organisation.fields.locale")}
            value={settings.locale}
          />
        </PanelCard>

        <PanelCard
          className="col-span-12 @lg:col-span-6"
          icon={<Globe2 className="size-5" />}
          title={t("settings.organisation.regional.title")}
          description={t("settings.organisation.regional.description")}
        >
          <WidgetDetailRow
            label={t("settings.organisation.fields.defaultCurrency")}
            value={settings.defaultCurrency}
          />
          <WidgetDetailRow
            label={t("settings.organisation.fields.defaultRegion")}
            value={t(`shipments.regions.${settings.defaultRegion}`)}
          />
        </PanelCard>

        <PanelCard
          className="col-span-12"
          icon={<Wallet className="size-5" />}
          title={t("settings.organisation.depots.title")}
          description={t("settings.organisation.depots.description")}
        >
          <WidgetDetailRow
            label={t("settings.organisation.fields.depotHubs")}
            value={depotCities}
          />
        </PanelCard>
      </GridContainer>
    </div>
  );
}
