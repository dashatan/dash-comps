import {
  AlertTriangle,
  Clock,
  LineChart as LineChartIcon,
  ListOrdered,
  MapPin,
  Percent,
} from "lucide-react";
import BarChart from "@/components/common/charts/bar";
import LineChart from "@/components/common/charts/line";
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

export function DeliveryPerformanceReportPage() {
  const { t } = useAppLanguage();

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <PageHeader
        title={t("reports.deliveryPerformance.title")}
        subtitle={t("reports.deliveryPerformance.description")}
        breadcrumbLabel={t("reports.title")}
        breadcrumbHref="/reports"
      />
      <QueryBoundary
        query={{
          queryKey: queryKeys.reports.bySlug("delivery-performance"),
          queryFn: () => reportsRepository.getDeliveryPerformance(),
        }}
      >
        {(report) => (
          <GridContainer
            className="auto-rows-auto grid-rows-none items-stretch"
            aria-label={t("reports.deliveryPerformance.title")}
          >
            <KpiCard
              label={t("reports.summary.avgOnTime")}
              description={t("reports.summary.avgOnTimeDescription")}
              value={`${report.summary.avgOnTimePercent}%`}
              icon={<Percent className="size-5" />}
            />
            <KpiCard
              label={t("reports.summary.avgDelivery")}
              description={t("reports.summary.avgDeliveryDescription")}
              value={`${report.summary.avgDeliveryHours} h`}
              icon={<Clock className="size-5" />}
            />
            <KpiCard
              label={t("reports.summary.delayed")}
              description={t("reports.summary.delayedDescription")}
              value={String(report.summary.delayedShipments)}
              icon={<AlertTriangle className="size-5" />}
            />
            <KpiCard
              label={t("reports.summary.hubs")}
              description={t("reports.summary.hubsDescription")}
              value={String(report.summary.hubsMonitored)}
              icon={<MapPin className="size-5" />}
            />

            <ChartCard
              className="col-span-12 @xl:col-span-8"
              icon={<LineChartIcon className="size-5" />}
              title={t("reports.charts.onTimeTrend")}
              description={t("reports.charts.onTimeTrendDescription")}
            >
              <LineChart
                xAxis={[...report.onTimeTrend.labels]}
                series={[
                  { name: "On-time %", data: [...report.onTimeTrend.values] },
                ]}
                type="smooth"
              />
            </ChartCard>

            <PanelCard
              className="col-span-12 @xl:col-span-4"
              icon={<ListOrdered className="size-5" />}
              title={t("reports.lists.hubRankings.title")}
              description={t("reports.lists.hubRankings.description")}
            >
              {report.byHub.labels.map((hub, index) => (
                <ListRow
                  key={hub}
                  primary={hub}
                  secondary={`${report.byHub.secondary[index]} h avg`}
                  meta={`${report.byHub.primary[index]}%`}
                />
              ))}
            </PanelCard>

            <ChartCard
              className="col-span-12"
              icon={<MapPin className="size-5" />}
              title={t("reports.charts.hubPerformance")}
              description={t("reports.charts.hubPerformanceDescription")}
            >
              <BarChart
                xAxis={[...report.byHub.labels]}
                series={[
                  { name: "On-time %", data: [...report.byHub.primary] },
                  { name: "Avg hours", data: [...report.byHub.secondary] },
                ]}
              />
            </ChartCard>
          </GridContainer>
        )}
      </QueryBoundary>
    </div>
  );
}
