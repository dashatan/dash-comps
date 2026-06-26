import {
  LineChart as LineChartIcon,
  ListOrdered,
  PieChart,
  Truck,
  Wrench,
} from "lucide-react";
import BarChart from "@/components/common/charts/bar";
import LineChart from "@/components/common/charts/line";
import { Chart } from "@/components/common/charts";
import { GridContainer } from "@/components/common/grid";
import { queryKeys } from "@/core/query-keys";
import {
  ChartCard,
  KpiCard,
  ListRow,
  PanelCard,
} from "@/features/overview/overview-components";
import { reportsRepository } from "@/infrastructure/http/repositories";
import { useAppLanguage } from "@/i18n/use-app-language";
import { QueryBoundary } from "@/shared/components/query-boundary";
import { PageHeader } from "@/shared/page-header";
import { MONTH_LABELS } from "@/shared/formatters";

export function FleetUtilizationReportPage() {
  const { t } = useAppLanguage();

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <PageHeader
        title={t("reports.fleetUtilization.title")}
        subtitle={t("reports.fleetUtilization.description")}
        breadcrumbLabel={t("reports.title")}
        breadcrumbHref="/reports"
      />
      <QueryBoundary
        query={{
          queryKey: queryKeys.reports.bySlug("fleet-utilization"),
          queryFn: () => reportsRepository.getFleetUtilization(),
        }}
      >
        {(report) => {
          const regionalData = report.byRegion.map((item) => ({
            ...item,
            name: t(
              `shipments.regions.${item.name}` as Parameters<typeof t>[0],
            ),
          }));

          return (
            <GridContainer
              className="auto-rows-auto grid-rows-none items-stretch"
              aria-label={t("reports.fleetUtilization.title")}
            >
              <KpiCard
                label={t("reports.summary.fleetSize")}
                description={t("reports.summary.fleetSizeDescription")}
                value={String(report.summary.fleetSize)}
                icon={<Truck className="size-5" />}
              />
              <KpiCard
                label={t("reports.summary.activeVehicles")}
                description={t("reports.summary.activeVehiclesDescription")}
                value={String(report.summary.activeVehicles)}
                icon={<Truck className="size-5" />}
              />
              <KpiCard
                label={t("reports.summary.avgUtilization")}
                description={t("reports.summary.avgUtilizationDescription")}
                value={`${report.summary.avgUtilizationPercent}%`}
                icon={<PieChart className="size-5" />}
              />
              <KpiCard
                label={t("reports.summary.maintenance")}
                description={t("reports.summary.maintenanceDescription")}
                value={String(report.summary.maintenanceCount)}
                icon={<Wrench className="size-5" />}
              />

              <ChartCard
                className="col-span-12 @lg:col-span-5"
                icon={<PieChart className="size-5" />}
                title={t("reports.charts.regionalUtilization")}
                description={t("reports.charts.regionalUtilizationDescription")}
              >
                <Chart.Pie
                  data={regionalData}
                  donut
                  showLegend
                  showLabel={false}
                  centerSummaryLabel={t("reports.charts.total")}
                />
              </ChartCard>

              <ChartCard
                className="col-span-12 @lg:col-span-7"
                icon={<LineChartIcon className="size-5" />}
                title={t("reports.charts.utilizationTrend")}
                description={t("reports.charts.utilizationTrendDescription")}
              >
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
              </ChartCard>

              <ChartCard
                className="col-span-12 @xl:col-span-8"
                icon={<Truck className="size-5" />}
                title={t("reports.charts.utilizationByRegion")}
                description={t("reports.charts.utilizationByRegionDescription")}
              >
                <BarChart
                  xAxis={regionalData.map((region) => region.name)}
                  series={[
                    {
                      name: "Utilisation %",
                      data: regionalData.map((region) => region.value),
                    },
                  ]}
                />
              </ChartCard>

              <PanelCard
                className="col-span-12 @xl:col-span-4"
                icon={<ListOrdered className="size-5" />}
                title={t("reports.lists.regionalBreakdown.title")}
                description={t("reports.lists.regionalBreakdown.description")}
              >
                {regionalData.map((region) => (
                  <ListRow
                    key={region.name}
                    primary={region.name}
                    meta={`${region.value}%`}
                  />
                ))}
              </PanelCard>
            </GridContainer>
          );
        }}
      </QueryBoundary>
    </div>
  );
}
