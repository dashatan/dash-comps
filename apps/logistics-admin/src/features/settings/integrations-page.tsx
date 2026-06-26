import { useQuery } from "@tanstack/react-query";
import { Plug } from "lucide-react";
import { GridContainer } from "@/components/common/grid";
import { ListRow, PanelCard } from "@/features/overview/overview-components";
import { queryKeys } from "@/core/query-keys";
import { settingsRepository } from "@/infrastructure/http/repositories";
import { useLogisticsT } from "@/i18n/provider";
import Loading from "@/components/common/loading";
import { PageHeader } from "@/shared/page-header";
import { formatEuropeanDateTime } from "@/shared/formatters";

const STATUS_DOT = {
  connected: "bg-emerald-500",
  error: "bg-destructive",
  pending: "bg-amber-500",
} as const;

export function IntegrationsPage() {
  const t = useLogisticsT();

  const integrationsQuery = useQuery({
    queryKey: queryKeys.settings.integrations,
    queryFn: () => settingsRepository.getIntegrations(),
  });

  if (integrationsQuery.isLoading) {
    return (
      <div className="flex min-h-0 flex-1 flex-col">
        <PageHeader
          title={t("settings.integrations.title")}
          subtitle={t("settings.integrations.subtitle")}
          breadcrumbLabel={t("settings.title")}
          breadcrumbHref="/settings/organisation"
        />
        <div className="flex flex-1 items-center justify-center p-12">
          <Loading label={t("common.loading")} />
        </div>
      </div>
    );
  }

  if (integrationsQuery.isError || !integrationsQuery.data) {
    return (
      <div className="flex min-h-0 flex-1 flex-col">
        <PageHeader
          title={t("settings.integrations.title")}
          subtitle={t("settings.integrations.subtitle")}
          breadcrumbLabel={t("settings.title")}
          breadcrumbHref="/settings/organisation"
        />
        <div className="flex flex-1 items-center justify-center p-12 text-sm text-destructive">
          Failed to load data
        </div>
      </div>
    );
  }

  const integrations = integrationsQuery.data;

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <PageHeader
        title={t("settings.integrations.title")}
        subtitle={t("settings.integrations.subtitle")}
        breadcrumbLabel={t("settings.title")}
        breadcrumbHref="/settings/organisation"
      />
      <GridContainer
        className="auto-rows-auto grid-rows-none items-stretch"
        aria-label={t("settings.integrations.title")}
      >
        <PanelCard
          className="col-span-12 @lg:col-span-8"
          icon={<Plug className="size-5" />}
          title={t("settings.integrations.list.title")}
          description={t("settings.integrations.list.description")}
        >
          {integrations.map((integration) => (
            <ListRow
              key={integration.id}
              primary={integration.provider}
              secondary={t(`settings.integrationTypes.${integration.type}`)}
              meta={
                integration.lastSyncAt
                  ? formatEuropeanDateTime(integration.lastSyncAt)
                  : t("settings.integrations.neverSynced")
              }
              trailing={
                <span
                  className={`size-2 shrink-0 rounded-full ${STATUS_DOT[integration.status]}`}
                  title={t(
                    `settings.integrationStatuses.${integration.status}`,
                  )}
                />
              }
            />
          ))}
        </PanelCard>
      </GridContainer>
    </div>
  );
}
