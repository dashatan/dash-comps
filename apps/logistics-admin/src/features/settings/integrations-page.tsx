"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link2, Plug } from "lucide-react";
import type {
  IntegrationDto,
  IntegrationType,
} from "@dash/logistics-contracts";
import { GridContainer } from "@/components/common/grid";
import BasicTextInput from "@/components/common/inputs/text/basic";
import { Select } from "@/components/common/inputs/select";
import Button from "@/components/common/buttons";
import { toast } from "@/components/common/sonner";
import { ListRow, PanelCard } from "@/features/overview/overview-components";
import { SettingsField } from "@/features/settings/components/settings-form-shell";
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

const INTEGRATION_TYPES: IntegrationType[] = ["erp", "telematics", "carrier"];

type ConnectFormState = {
  provider: string;
  type: IntegrationType;
  apiEndpoint: string;
  apiKey: string;
};

const EMPTY_CONNECT_FORM: ConnectFormState = {
  provider: "",
  type: "erp",
  apiEndpoint: "",
  apiKey: "",
};

export function IntegrationsPage() {
  const t = useLogisticsT();
  const [demoIntegrations, setDemoIntegrations] = useState<IntegrationDto[]>(
    [],
  );
  const [connectForm, setConnectForm] =
    useState<ConnectFormState>(EMPTY_CONNECT_FORM);

  const integrationsQuery = useQuery({
    queryKey: queryKeys.settings.integrations,
    queryFn: () => settingsRepository.getIntegrations(),
  });

  const allIntegrations = useMemo(
    () => [...(integrationsQuery.data ?? []), ...demoIntegrations],
    [integrationsQuery.data, demoIntegrations],
  );

  const handleConnect = () => {
    if (!connectForm.provider.trim() || !connectForm.apiEndpoint.trim()) {
      toast.error(t("settings.integrations.connect.validation"));
      return;
    }

    const integration: IntegrationDto = {
      id: `demo-${Date.now()}`,
      provider: connectForm.provider.trim(),
      type: connectForm.type,
      status: "pending",
      lastSyncAt: null,
    };

    setDemoIntegrations((current) => [...current, integration]);
    setConnectForm(EMPTY_CONNECT_FORM);
    toast.success(t("settings.demo.saved"));
  };

  if (integrationsQuery.isLoading) {
    return (
      <div className="flex min-h-0 flex-1 flex-col">
        <PageHeader
          title={t("settings.integrations.title")}
          subtitle={t("settings.integrations.subtitle")}
          breadcrumbLabel={t("settings.title")}
          breadcrumbHref="/settings/integrations"
        />
        <div className="flex flex-1 items-center justify-center p-12">
          <Loading label={t("common.loading")} />
        </div>
      </div>
    );
  }

  if (integrationsQuery.isError) {
    return (
      <div className="flex min-h-0 flex-1 flex-col">
        <PageHeader
          title={t("settings.integrations.title")}
          subtitle={t("settings.integrations.subtitle")}
          breadcrumbLabel={t("settings.title")}
          breadcrumbHref="/settings/integrations"
        />
        <div className="flex flex-1 items-center justify-center p-12 text-sm text-destructive">
          Failed to load data
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <PageHeader
        title={t("settings.integrations.title")}
        subtitle={t("settings.integrations.subtitle")}
        breadcrumbLabel={t("settings.title")}
        breadcrumbHref="/settings/integrations"
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
          {allIntegrations.map((integration) => (
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

        <PanelCard
          className="col-span-12 @lg:col-span-4"
          icon={<Link2 className="size-5" />}
          title={t("settings.integrations.connect.title")}
          description={t("settings.integrations.connect.description")}
        >
          <div className="flex flex-col gap-3">
            <SettingsField label={t("settings.integrations.connect.provider")}>
              <BasicTextInput
                value={connectForm.provider}
                onChange={(event) =>
                  setConnectForm((current) => ({
                    ...current,
                    provider: event.target.value,
                  }))
                }
              />
            </SettingsField>
            <SettingsField label={t("settings.integrations.connect.type")}>
              <Select.Single
                options={INTEGRATION_TYPES.map((type) => ({
                  value: type,
                  label: t(`settings.integrationTypes.${type}`),
                }))}
                value={connectForm.type}
                onChange={(value) => {
                  if (typeof value === "string") {
                    setConnectForm((current) => ({
                      ...current,
                      type: value as IntegrationType,
                    }));
                  }
                }}
              />
            </SettingsField>
            <SettingsField
              label={t("settings.integrations.connect.apiEndpoint")}
            >
              <BasicTextInput
                value={connectForm.apiEndpoint}
                onChange={(event) =>
                  setConnectForm((current) => ({
                    ...current,
                    apiEndpoint: event.target.value,
                  }))
                }
                className="font-mono text-xs dir-ltr"
              />
            </SettingsField>
            <SettingsField label={t("settings.integrations.connect.apiKey")}>
              <BasicTextInput
                type="password"
                value={connectForm.apiKey}
                onChange={(event) =>
                  setConnectForm((current) => ({
                    ...current,
                    apiKey: event.target.value,
                  }))
                }
                className="font-mono text-xs dir-ltr"
              />
            </SettingsField>
            <Button
              variant="contained"
              severity="primary"
              className="mt-2 w-full"
              onClick={handleConnect}
            >
              {t("settings.integrations.connect.action")}
            </Button>
          </div>
        </PanelCard>
      </GridContainer>
    </div>
  );
}
