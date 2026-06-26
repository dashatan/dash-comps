import {
  GridCard,
  GridContainer,
  GridHeader,
} from "@/components/common/grid";
import LineChart from "@/components/common/charts/line";
import BarChart from "@/components/common/charts/bar";
import { getDeliveryPerformanceReport } from "@/data/reports";
import { useLogisticsT } from "@/i18n/provider";
import { PageHeader } from "@/shared/page-header";

function SummaryStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-border bg-muted/20 rounded-lg border px-4 py-3">
      <p className="text-muted-foreground text-xs">{label}</p>
      <p className="text-lg font-semibold tabular-nums">{value}</p>
    </div>
  );
}

export function DeliveryPerformanceReportPage() {
  const t = useLogisticsT();
  const report = getDeliveryPerformanceReport();

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <PageHeader
        title={t("reports.deliveryPerformance.title")}
        subtitle={t("reports.deliveryPerformance.description")}
        breadcrumbLabel={t("reports.title")}
        breadcrumbHref="/reports"
      />
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
              series={[{ name: "On-time %", data: [...report.onTimeTrend.values] }]}
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
    </div>
  );
}
