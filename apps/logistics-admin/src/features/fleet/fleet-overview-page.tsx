import type { ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { Truck, Users, ClipboardList, Activity } from "lucide-react";
import Loading from "@/components/common/loading";
import { GridCard, GridContainer, GridHeader } from "@/components/common/grid";
import { queryKeys } from "@/core/query-keys";
import { fleetRepository } from "@/infrastructure/http/repositories";
import { useLogisticsT } from "@/i18n/provider";
import { PageHeader } from "@/shared/page-header";

function KpiCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: ReactNode;
}) {
  return (
    <GridCard className="col-span-12 @lg:col-span-6 @2xl:col-span-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <span className="text-xs text-muted-foreground">{label}</span>
          <span className="text-2xl font-semibold tabular-nums">{value}</span>
        </div>
        <div className="flex size-10 items-center justify-center rounded-lg bg-muted text-muted-foreground">
          {icon}
        </div>
      </div>
    </GridCard>
  );
}

export function FleetOverviewPage() {
  const t = useLogisticsT();
  const {
    data: summary,
    isLoading,
    isError,
  } = useQuery({
    queryKey: queryKeys.fleet.summary,
    queryFn: () => fleetRepository.getSummary(),
  });

  if (isLoading) {
    return (
      <div className="flex min-h-0 flex-1 flex-col">
        <PageHeader
          title={t("fleet.title")}
          subtitle={t("fleet.subtitle")}
          breadcrumbLabel={t("fleet.title")}
          breadcrumbHref="/fleet"
        />
        <div className="flex flex-1 items-center justify-center p-12">
          <Loading label="Loading…" />
        </div>
      </div>
    );
  }

  if (isError || !summary) {
    return (
      <div className="flex min-h-0 flex-1 flex-col">
        <PageHeader
          title={t("fleet.title")}
          subtitle={t("fleet.subtitle")}
          breadcrumbLabel={t("fleet.title")}
          breadcrumbHref="/fleet"
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
        title={t("fleet.title")}
        subtitle={t("fleet.subtitle")}
        breadcrumbLabel={t("fleet.title")}
        breadcrumbHref="/fleet"
      />
      <GridContainer aria-label={t("fleet.title")}>
        <KpiCard
          label={t("fleet.overview.fleetSize")}
          value={String(summary.vehicleCount)}
          icon={<Truck className="size-5" />}
        />
        <KpiCard
          label={t("fleet.overview.activeVehicles")}
          value={`${summary.activeVehicles} (${summary.utilizationPercent}%)`}
          icon={<Activity className="size-5" />}
        />
        <KpiCard
          label={t("fleet.overview.driversOnDuty")}
          value={String(summary.driversOnDuty)}
          icon={<Users className="size-5" />}
        />
        <KpiCard
          label={t("fleet.overview.openAssignments")}
          value={String(summary.activeAssignments)}
          icon={<ClipboardList className="size-5" />}
        />

        <GridCard className="col-span-12 @md:col-span-4">
          <GridHeader title={t("fleet.vehicles.title")} />
          <p className="mb-4 text-sm text-muted-foreground">
            {t("fleet.vehicles.subtitle")}
          </p>
          <Link
            to="/fleet/vehicles"
            className="inline-flex rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          >
            {t("fleet.overview.viewVehicles")}
          </Link>
        </GridCard>

        <GridCard className="col-span-12 @md:col-span-4">
          <GridHeader title={t("fleet.drivers.title")} />
          <p className="mb-4 text-sm text-muted-foreground">
            {t("fleet.drivers.subtitle")}
          </p>
          <Link
            to="/fleet/drivers"
            className="inline-flex rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          >
            {t("fleet.overview.viewDrivers")}
          </Link>
        </GridCard>

        <GridCard className="col-span-12 @md:col-span-4">
          <GridHeader title={t("fleet.assignments.title")} />
          <p className="mb-4 text-sm text-muted-foreground">
            {t("fleet.assignments.subtitle")} ({summary.assignmentCount} /{" "}
            {summary.driverCount} drivers)
          </p>
          <Link
            to="/fleet/assignments"
            className="inline-flex rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          >
            {t("fleet.overview.viewAssignments")}
          </Link>
        </GridCard>
      </GridContainer>
    </div>
  );
}
