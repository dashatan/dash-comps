import type { ReactNode } from "react";
import type { FleetSummaryDto } from "@dash/logistics-contracts";
import {
  WidgetDetailRow,
  WidgetProgress,
  WidgetStat,
} from "@/features/overview/overview-components";
import type { AppTranslationKeys } from "@/i18n/use-app-language";
import type { TranslationParams } from "@dash/core";

type AppTranslator = (
  key: AppTranslationKeys,
  params?: TranslationParams,
) => string;

type FleetSnapshotWidgetProps = {
  summary: FleetSummaryDto;
  t: AppTranslator;
};

export function FleetSnapshotWidget({ summary, t }: FleetSnapshotWidgetProps) {
  const idleVehicles =
    summary.vehicleCount - summary.activeVehicles - summary.maintenanceCount;

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3">
      <WidgetProgress
        label={t("overview.widgets.fleet.utilization")}
        value={summary.utilizationPercent}
      />

      <div className="grid grid-cols-2 gap-2">
        <WidgetStat
          label={t("fleet.overview.fleetSize")}
          value={String(summary.vehicleCount)}
        />
        <WidgetStat
          label={t("fleet.overview.driversOnDuty")}
          value={`${summary.driversOnDuty}/${summary.driverCount}`}
        />
        <WidgetStat
          label={t("fleet.overview.openAssignments")}
          value={`${summary.activeAssignments}/${summary.assignmentCount}`}
        />
        <WidgetStat
          label={t("reports.summary.maintenance")}
          value={String(summary.maintenanceCount)}
        />
      </div>

      <div className="flex min-h-0 flex-1 flex-col justify-between gap-3">
        <WidgetSection title={t("overview.widgets.fleet.vehicles")}>
          <WidgetDetailRow
            label={t("overview.widgets.fleet.active")}
            value={String(summary.activeVehicles)}
          />
          <WidgetDetailRow
            label={t("reports.summary.maintenance")}
            value={String(summary.maintenanceCount)}
          />
          <WidgetDetailRow
            label={t("overview.widgets.fleet.idle")}
            value={String(Math.max(idleVehicles, 0))}
          />
        </WidgetSection>

        <WidgetSection title={t("overview.widgets.fleet.drivers")}>
          <WidgetDetailRow
            label={t("overview.widgets.fleet.onDuty")}
            value={String(summary.driversOnDuty)}
          />
          <WidgetDetailRow
            label={t("overview.widgets.fleet.registered")}
            value={String(summary.driverCount)}
          />
        </WidgetSection>

        <WidgetSection title={t("overview.widgets.fleet.assignments")}>
          <WidgetDetailRow
            label={t("overview.widgets.fleet.active")}
            value={String(summary.activeAssignments)}
          />
          <WidgetDetailRow
            label={t("overview.widgets.fleet.scheduled")}
            value={String(summary.assignmentCount)}
          />
        </WidgetSection>
      </div>
    </div>
  );
}

function WidgetSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
        {title}
      </p>
      <div className="flex flex-col gap-1">{children}</div>
    </div>
  );
}
