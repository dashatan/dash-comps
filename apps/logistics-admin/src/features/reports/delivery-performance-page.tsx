import { GridCard, GridContainer, GridHeader } from "@/components/common/grid";
import LineChart from "@/components/common/charts/line";
import BarChart from "@/components/common/charts/bar";
import { queryKeys } from "@/core/query-keys";
import { reportsRepository } from "@/infrastructure/http/repositories";
import { useLogisticsT } from "@/i18n/provider";
import { QueryBoundary } from "@/shared/components/query-boundary";
import { PageHeader } from "@/shared/page-header";

function SummaryStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-muted/20 px-4 py-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-lg font-semibold tabular-nums">{value}</p>
    </div>
  );
}

export function DeliveryPerformanceReportPage() {
  const t = useLogisticsT();

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
          <GridContainer aria-label={t("reports.deliveryPerformance.title")}>
            <GridCard className="col-span-12 grid grid-cols-2 gap-3 @lg:grid-cols-4">
              <SummaryStat
                label={t("reports.summary.avgOnTime")}
                value={`${report.summary.avgOnTimePercent}%`}
              />
              <SummaryStat
                label={t("reports.summary.avgDelivery")}
                value={`${report.summary.avgDeliveryHours} h`}
              />
              <SummaryStat
                label={t("reports.summary.delayed")}
                value={String(report.summary.delayedShipments)}
              />
              <SummaryStat
                label={t("reports.summary.hubs")}
                value={String(report.summary.hubsMonitored)}
              />
            </GridCard>

            <GridCard className="col-span-12 @xl:col-span-7">
              <GridHeader title={t("analytics.charts.onTimeTrend")} />
              <div className="min-h-80">
                <LineChart
                  xAxis={[...report.onTimeTrend.labels]}
                  series={[
                    { name: "On-time %", data: [...report.onTimeTrend.values] },
                  ]}
                  type="smooth"
                />
              </div>
            </GridCard>

            <GridCard className="col-span-12 @xl:col-span-5">
              <GridHeader title={t("analytics.charts.delaysByHub")} />
              <div className="min-h-80">
                <BarChart
                  xAxis={[...report.byHub.labels]}
                  series={[
                    { name: "On-time %", data: [...report.byHub.primary] },
                    { name: "Avg hours", data: [...report.byHub.secondary] },
                  ]}
                />
              </div>
            </GridCard>
          </GridContainer>
        )}
      </QueryBoundary>
    </div>
  );
}
