import {
  GridCard,
  GridContainer,
  GridHeader,
} from "@/components/common/grid";
import AreaChart from "@/components/common/charts/area";
import BarChart from "@/components/common/charts/bar";
import { formatEur } from "@/data/european-context";
import { getRevenueByRouteReport } from "@/data/reports";
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

export function RevenueByRouteReportPage() {
  const t = useLogisticsT();
  const report = getRevenueByRouteReport();

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <PageHeader
        title={t("reports.revenueByRoute.title")}
        subtitle={t("reports.revenueByRoute.description")}
        breadcrumbLabel={t("reports.title")}
        breadcrumbHref="/reports"
      />
      <GridContainer aria-label={t("reports.revenueByRoute.title")}>
        <GridCard className="col-span-12 grid grid-cols-2 gap-3 @lg:grid-cols-4">
          <SummaryStat
            label={t("reports.summary.totalRevenue")}
            value={formatEur(report.summary.totalRevenueEur)}
          />
          <SummaryStat
            label={t("reports.summary.totalCost")}
            value={formatEur(report.summary.totalCostEur)}
          />
          <SummaryStat
            label={t("reports.summary.topRoute")}
            value={report.summary.topRoute}
          />
          <SummaryStat
            label={t("reports.summary.routes")}
            value={String(report.summary.routeCount)}
          />
        </GridCard>

        <GridCard className="col-span-12">
          <GridHeader title={t("overview.charts.revenueCost")} />
          <div className="min-h-80">
            <AreaChart
              xAxis={[...report.monthlyTrend.labels]}
              series={[
                { name: "Revenue (k€)", data: [...report.monthlyTrend.primary] },
                { name: "Cost (k€)", data: [...report.monthlyTrend.secondary] },
              ]}
            />
          </div>
        </GridCard>

        <GridCard className="col-span-12">
          <GridHeader title={t("analytics.charts.topRoutes")} />
          <div className="min-h-96">
            <BarChart
              xAxis={report.topRoutes.map((r) => r.name)}
              series={[
                { name: "Revenue (€)", data: report.topRoutes.map((r) => r.revenue) },
                { name: "Cost (€)", data: report.topRoutes.map((r) => r.cost) },
              ]}
              horizontal
            />
          </div>
        </GridCard>
      </GridContainer>
    </div>
  );
}
