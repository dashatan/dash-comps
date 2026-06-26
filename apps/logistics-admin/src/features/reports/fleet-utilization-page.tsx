import { GridCard, GridContainer, GridHeader } from "@/components/common/grid";
import LineChart from "@/components/common/charts/line";
import BarChart from "@/components/common/charts/bar";
import DoughnutChart from "@/components/common/charts/doughnut";
import { MONTH_LABELS } from "@/data/european-context";
import { getFleetUtilizationReport } from "@/data/reports";
import { useLogisticsT } from "@/i18n/provider";
import { PageHeader } from "@/shared/page-header";

function SummaryStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-muted/20 px-4 py-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-lg font-semibold tabular-nums">{value}</p>
    </div>
  );
}

export function FleetUtilizationReportPage() {
  const t = useLogisticsT();
  const report = getFleetUtilizationReport();
  const regionalData = report.byRegion.map((item) => ({
    ...item,
    name: t(`shipments.regions.${item.name}` as Parameters<typeof t>[0]),
  }));

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <PageHeader
        title={t("reports.fleetUtilization.title")}
        subtitle={t("reports.fleetUtilization.description")}
        breadcrumbLabel={t("reports.title")}
        breadcrumbHref="/reports"
      />
      <GridContainer aria-label={t("reports.fleetUtilization.title")}>
        <GridCard className="col-span-12 grid grid-cols-2 gap-3 @lg:grid-cols-4">
          <SummaryStat
            label={t("reports.summary.fleetSize")}
            value={String(report.summary.fleetSize)}
          />
          <SummaryStat
            label={t("reports.summary.activeVehicles")}
            value={String(report.summary.activeVehicles)}
          />
          <SummaryStat
            label={t("reports.summary.avgUtilization")}
            value={`${report.summary.avgUtilizationPercent}%`}
          />
          <SummaryStat
            label={t("reports.summary.maintenance")}
            value={String(report.summary.maintenanceCount)}
          />
        </GridCard>

        <GridCard className="col-span-12 @lg:col-span-5">
          <GridHeader title={t("overview.kpis.fleetUtilization")} />
          <div className="min-h-72">
            <DoughnutChart data={regionalData} showLegend />
          </div>
        </GridCard>

        <GridCard className="col-span-12 @lg:col-span-7">
          <GridHeader title={t("reports.fleetUtilization.title")} />
          <div className="min-h-72">
            <LineChart
              xAxis={[...MONTH_LABELS]}
              series={[
                {
                  name: "Utilisation %",
                  data: [...report.weeklyUtilization],
                },
              ]}
              type="smooth"
            />
          </div>
        </GridCard>

        <GridCard className="col-span-12">
          <GridHeader title={t("analytics.charts.regionalShare")} />
          <div className="min-h-80">
            <BarChart
              xAxis={regionalData.map((r) => r.name)}
              series={[
                {
                  name: "Utilisation %",
                  data: regionalData.map((r) => r.value),
                },
              ]}
            />
          </div>
        </GridCard>
      </GridContainer>
    </div>
  );
}
