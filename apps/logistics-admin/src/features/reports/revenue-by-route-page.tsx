import {
  BarChart3,
  ChartArea,
  ListOrdered,
  Route,
  TrendingUp,
  Wallet,
} from "lucide-react";
import AreaChart from "@/components/common/charts/area";
import BarChart from "@/components/common/charts/bar";
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
import { formatEur } from "@/shared/formatters";

function formatMarginPercent(revenue: number, cost: number): string {
  if (revenue <= 0) {
    return "0%";
  }
  const margin = ((revenue - cost) / revenue) * 100;
  return `${margin.toFixed(1)}%`;
}

export function RevenueByRouteReportPage() {
  const { t } = useAppLanguage();

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <PageHeader
        title={t("reports.revenueByRoute.title")}
        subtitle={t("reports.revenueByRoute.description")}
        breadcrumbLabel={t("reports.title")}
        breadcrumbHref="/reports"
      />
      <QueryBoundary
        query={{
          queryKey: queryKeys.reports.bySlug("revenue-by-route"),
          queryFn: () => reportsRepository.getRevenueByRoute(),
        }}
      >
        {(report) => (
          <GridContainer
            className="auto-rows-auto grid-rows-none items-stretch"
            aria-label={t("reports.revenueByRoute.title")}
          >
            <KpiCard
              label={t("reports.summary.totalRevenue")}
              description={t("reports.summary.totalRevenueDescription")}
              value={formatEur(report.summary.totalRevenueEur)}
              icon={<TrendingUp className="size-5" />}
            />
            <KpiCard
              label={t("reports.summary.totalCost")}
              description={t("reports.summary.totalCostDescription")}
              value={formatEur(report.summary.totalCostEur)}
              icon={<Wallet className="size-5" />}
            />
            <KpiCard
              label={t("reports.summary.topRoute")}
              description={t("reports.summary.topRouteDescription")}
              value={report.summary.topRoute}
              icon={<Route className="size-5" />}
            />
            <KpiCard
              label={t("reports.summary.routes")}
              description={t("reports.summary.routesDescription")}
              value={String(report.summary.routeCount)}
              icon={<BarChart3 className="size-5" />}
            />

            <ChartCard
              className="col-span-12 @xl:col-span-8"
              icon={<ChartArea className="size-5" />}
              title={t("reports.charts.revenueCostTrend")}
              description={t("reports.charts.revenueCostTrendDescription")}
            >
              <AreaChart
                showLegend
                xAxis={[...report.monthlyTrend.labels]}
                series={[
                  {
                    name: "Revenue (k€)",
                    data: [...report.monthlyTrend.primary],
                  },
                  {
                    name: "Cost (k€)",
                    data: [...report.monthlyTrend.secondary],
                  },
                ]}
              />
            </ChartCard>

            <PanelCard
              className="col-span-12 @xl:col-span-4"
              icon={<ListOrdered className="size-5" />}
              title={t("reports.lists.corridorRankings.title")}
              description={t("reports.lists.corridorRankings.description")}
            >
              {report.topRoutes.map((route) => (
                <ListRow
                  key={route.name}
                  primary={route.name}
                  secondary={formatMarginPercent(route.revenue, route.cost)}
                  meta={formatEur(route.revenue)}
                />
              ))}
            </PanelCard>

            <ChartCard
              className="col-span-12"
              icon={<BarChart3 className="size-5" />}
              title={t("reports.charts.revenueByCorridor")}
              description={t("reports.charts.revenueByCorridorDescription")}
            >
              <BarChart
                xAxis={report.topRoutes.map((route) => route.name)}
                series={[
                  {
                    name: "Revenue (€)",
                    data: report.topRoutes.map((route) => route.revenue),
                  },
                  {
                    name: "Cost (€)",
                    data: report.topRoutes.map((route) => route.cost),
                  },
                ]}
                horizontal
              />
            </ChartCard>
          </GridContainer>
        )}
      </QueryBoundary>
    </div>
  );
}
