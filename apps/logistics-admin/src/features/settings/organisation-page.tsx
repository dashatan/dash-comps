"use client";

import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Building2, Globe2, Wallet } from "lucide-react";
import type { OrganisationSettingsDto } from "@dash/logistics-contracts";
import { GridContainer } from "@/components/common/grid";
import BasicTextInput from "@/components/common/inputs/text/basic";
import { Select } from "@/components/common/inputs/select";
import {
  DemoFormFooter,
  SettingsField,
} from "@/features/settings/components/settings-form-shell";
import { PanelCard } from "@/features/overview/overview-components";
import { queryKeys } from "@/core/query-keys";
import {
  referenceRepository,
  settingsRepository,
} from "@/infrastructure/http/repositories";
import { useAppLanguage } from "@/i18n/use-app-language";
import Loading from "@/components/common/loading";
import { PageHeader } from "@/shared/page-header";
import { EU_REGIONS } from "@/shared/formatters";

const CURRENCY_OPTIONS = [
  { value: "EUR", label: "EUR — Euro" },
  { value: "GBP", label: "GBP — British pound" },
  { value: "CHF", label: "CHF — Swiss franc" },
];

const LOCALE_OPTIONS = [
  { value: "en-GB", label: "English (UK)" },
  { value: "de-DE", label: "Deutsch (DE)" },
  { value: "fr-FR", label: "Français (FR)" },
  { value: "nl-NL", label: "Nederlands (NL)" },
  { value: "es-ES", label: "Español (ES)" },
];

export function OrganisationPage() {
  const { t } = useAppLanguage();
  const [form, setForm] = useState<OrganisationSettingsDto | null>(null);
  const [initialForm, setInitialForm] =
    useState<OrganisationSettingsDto | null>(null);

  const settingsQuery = useQuery({
    queryKey: queryKeys.settings.organisation,
    queryFn: () => settingsRepository.getOrganisation(),
  });

  const hubsQuery = useQuery({
    queryKey: queryKeys.reference.hubs({ page: 0, pageSize: 100 }),
    queryFn: () => referenceRepository.listHubs({ page: 0, pageSize: 100 }),
  });

  useEffect(() => {
    if (!settingsQuery.data) return;
    setForm(settingsQuery.data);
    setInitialForm(settingsQuery.data);
  }, [settingsQuery.data]);

  const hubOptions = useMemo(
    () =>
      (hubsQuery.data?.items ?? []).map((hub) => ({
        value: hub.id,
        label: `${hub.city} (${hub.countryCode})`,
      })),
    [hubsQuery.data?.items],
  );

  const updateForm = (patch: Partial<OrganisationSettingsDto>) => {
    setForm((current) => (current ? { ...current, ...patch } : current));
  };

  if (settingsQuery.isLoading || !form) {
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

  if (settingsQuery.isError) {
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

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <PageHeader
        title={t("settings.organisation.title")}
        subtitle={t("settings.organisation.subtitle")}
        breadcrumbLabel={t("settings.title")}
        breadcrumbHref="/settings/organisation"
      />
      <GridContainer
        className="auto-rows-auto grid-rows-none items-stretch pb-24"
        aria-label={t("settings.organisation.title")}
      >
        <PanelCard
          className="col-span-12 @lg:col-span-6"
          icon={<Building2 className="size-5" />}
          title={t("settings.organisation.profile.title")}
          description={t("settings.organisation.profile.description")}
        >
          <div className="flex flex-col gap-3">
            <SettingsField
              label={t("settings.organisation.fields.companyName")}
            >
              <BasicTextInput
                value={form.companyName}
                onChange={(event) =>
                  updateForm({ companyName: event.target.value })
                }
              />
            </SettingsField>
            <SettingsField label={t("settings.organisation.fields.locale")}>
              <Select.Single
                options={LOCALE_OPTIONS}
                value={form.locale}
                onChange={(value) => {
                  if (typeof value === "string") {
                    updateForm({ locale: value });
                  }
                }}
              />
            </SettingsField>
          </div>
        </PanelCard>

        <PanelCard
          className="col-span-12 @lg:col-span-6"
          icon={<Globe2 className="size-5" />}
          title={t("settings.organisation.regional.title")}
          description={t("settings.organisation.regional.description")}
        >
          <div className="flex flex-col gap-3">
            <SettingsField
              label={t("settings.organisation.fields.defaultCurrency")}
            >
              <Select.Single
                options={CURRENCY_OPTIONS}
                value={form.defaultCurrency}
                onChange={(value) => {
                  if (typeof value === "string") {
                    updateForm({ defaultCurrency: value });
                  }
                }}
              />
            </SettingsField>
            <SettingsField
              label={t("settings.organisation.fields.defaultRegion")}
            >
              <Select.Single
                options={EU_REGIONS.map((region) => ({
                  value: region,
                  label: t(`shipments.regions.${region}`),
                }))}
                value={form.defaultRegion}
                onChange={(value) => {
                  if (typeof value === "string") {
                    updateForm({
                      defaultRegion:
                        value as OrganisationSettingsDto["defaultRegion"],
                    });
                  }
                }}
              />
            </SettingsField>
          </div>
        </PanelCard>

        <PanelCard
          className="col-span-12"
          icon={<Wallet className="size-5" />}
          title={t("settings.organisation.depots.title")}
          description={t("settings.organisation.depots.description")}
        >
          <SettingsField label={t("settings.organisation.fields.depotHubs")}>
            <Select.Multi
              options={hubOptions}
              value={form.depotHubIds}
              loading={hubsQuery.isLoading}
              onChange={(value) => {
                if (Array.isArray(value)) {
                  updateForm({ depotHubIds: value as string[] });
                }
              }}
              showChips
              label={t("settings.organisation.fields.depotHubsPlaceholder")}
            />
          </SettingsField>
        </PanelCard>
      </GridContainer>
      <DemoFormFooter
        onReset={() => {
          if (initialForm) {
            setForm(initialForm);
          }
        }}
      />
    </div>
  );
}
