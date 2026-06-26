import { useQueries } from "@tanstack/react-query";
import {
  AlertTriangle,
  BarChart3,
  ChartArea,
  Globe2,
  LineChart as LineChartIcon,
  Package,
  PieChart,
  Route,
  TrendingUp,
} from "lucide-react";
import Loading from "@/components/common/loading";
import { GridContainer } from "@/components/common/grid";
import { Chart } from "@/components/common/charts";
import AreaChart from "@/components/common/charts/area";
import BarChart from "@/components/common/charts/bar";
import LineChart from "@/components/common/charts/line";
import {
  ChartCard,
  KpiCard,
  ListRow,
  PanelCard,
} from "@/features/overview/overview-components";
import { queryKeys } from "@/core/query-keys";
import { analyticsRepository } from "@/infrastructure/http/repositories";
import { useAppLanguage } from "@/i18n/use-app-language";
import { LogisticsGeoMap } from "@/shared/components/logistics-geo-map";
import { PageHeader } from "@/shared/page-header";
import { MONTH_LABELS } from "@/shared/formatters";

export function AnalyticsPage() {
  const { t } = useAppLanguage();

  const [
    statusVolumeQuery,
    onTimeTrendQuery,
    revenueCostQuery,
    dailyVolumeQuery,
    countryVolumeQuery,
    delaysByHubQuery,
    regionalShareQuery,
    recentTrendQuery,
    topRoutesQuery,
  ] = useQueries({
    queries: [
      {
        queryKey: queryKeys.analytics.shipmentVolume,
        queryFn: () => analyticsRepository.getShipmentVolume(),
      },
      {
        queryKey: queryKeys.analytics.onTimeTrend,
        queryFn: () => analyticsRepository.getOnTimeTrend(),
      },
      {
        queryKey: queryKeys.analytics.revenueCost,
        queryFn: () => analyticsRepository.getRevenueCost(),
      },
      {
        queryKey: queryKeys.analytics.dailyVolume,
        queryFn: () => analyticsRepository.getDailyVolume(),
      },
      {
        queryKey: queryKeys.analytics.countryVolume,
        queryFn: () => analyticsRepository.getCountryVolume(),
      },
      {
        queryKey: queryKeys.analytics.delaysByHub,
        queryFn: () => analyticsRepository.getDelaysByHub(),
      },
      {
        queryKey: queryKeys.analytics.regionalShare,
        queryFn: () => analyticsRepository.getRegionalShare(),
      },
      {
        queryKey: queryKeys.analytics.recentTrend,
        queryFn: () => analyticsRepository.getRecentTrend(),
      },
      {
        queryKey: queryKeys.analytics.topRoutes(6),
        queryFn: () => analyticsRepository.getTopRoutes(6),
      },
    ],
  });

  const queries = [
    statusVolumeQuery,
    onTimeTrendQuery,
    revenueCostQuery,
    dailyVolumeQuery,
    countryVolumeQuery,
    delaysByHubQuery,
    regionalShareQuery,
    recentTrendQuery,
    topRoutesQuery,
  ];

  const isLoading = queries.some((query) => query.isLoading);
  const isError = queries.some((query) => query.isError);

  if (isLoading) {
    return (
      <div className="flex min-h-0 flex-1 flex-col">
        <PageHeader
          title={t("analytics.title")}
          subtitle={t("analytics.subtitle")}
          breadcrumbLabel={t("analytics.title")}
          breadcrumbHref="/analytics"
        />
        <div className="flex flex-1 items-center justify-center p-12">
          <Loading label="Loading…" />
        </div>
      </div>
    );
  }

  if (
    isError ||
    !statusVolumeQuery.data ||
    !onTimeTrendQuery.data ||
    !revenueCostQuery.data ||
    !dailyVolumeQuery.data ||
    !countryVolumeQuery.data ||
    !delaysByHubQuery.data ||
    !regionalShareQuery.data ||
    !recentTrendQuery.data ||
    !topRoutesQuery.data
  ) {
    return (
      <div className="flex min-h-0 flex-1 flex-col">
        <PageHeader
          title={t("analytics.title")}
          subtitle={t("analytics.subtitle")}
          breadcrumbLabel={t("analytics.title")}
          breadcrumbHref="/analytics"
        />
        <div className="flex flex-1 items-center justify-center p-12 text-sm text-destructive">
          Failed to load data
        </div>
      </div>
    );
  }

  const statusVolume = statusVolumeQuery.data.map((item) => ({
    ...item,
    name: t(`shipments.statuses.${item.name}` as Parameters<typeof t>[0]),
  }));
  const onTimeTrend = onTimeTrendQuery.data;
  const revenueCost = revenueCostQuery.data;
  const dailyVolume = dailyVolumeQuery.data;
  const countryVolume = countryVolumeQuery.data;
  const delaysByHub = delaysByHubQuery.data;
  const regionalShare = regionalShareQuery.data.map((item) => ({
    ...item,
    name: t(`shipments.regions.${item.name}` as Parameters<typeof t>[0]),
  }));
  const recentTrend = recentTrendQuery.data;
  const topRoutes = topRoutesQuery.data;

  const totalShipments = statusVolumeQuery.data.reduce(
    (sum, item) => sum + item.value,
    0,
  );
  const latestOnTime = onTimeTrend.at(-1) ?? 0;
  const hubDelayTotal = delaysByHub.reduce((sum, item) => sum + item.value, 0);
  const topCorridor = topRoutes[0]?.name ?? "—";

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <PageHeader
        title={t("analytics.title")}
        subtitle={t("analytics.subtitle")}
        breadcrumbLabel={t("analytics.title")}
        breadcrumbHref="/analytics"
      />
      <GridContainer
        className="auto-rows-auto grid-rows-none items-stretch"
        aria-label={t("analytics.title")}
      >
        <KpiCard
          label={t("analytics.summary.totalShipments")}
          description={t("analytics.summary.totalShipmentsDescription")}
          value={String(totalShipments)}
          icon={<Package className="size-5" />}
        />
        <KpiCard
          label={t("analytics.summary.latestOnTime")}
          description={t("analytics.summary.latestOnTimeDescription")}
          value={`${latestOnTime}%`}
          icon={<TrendingUp className="size-5" />}
        />
        <KpiCard
          label={t("analytics.summary.hubDelayTotal")}
          description={t("analytics.summary.hubDelayTotalDescription")}
          value={String(hubDelayTotal)}
          icon={<AlertTriangle className="size-5" />}
        />
        <KpiCard
          label={t("analytics.summary.topCorridor")}
          description={t("analytics.summary.topCorridorDescription")}
          value={topCorridor}
          icon={<Route className="size-5" />}
        />

        <ChartCard
          className="col-span-12 @lg:col-span-4"
          icon={<BarChart3 className="size-5" />}
          title={t("analytics.charts.statusVolume")}
          description={t("analytics.charts.descriptions.statusVolume")}
        >
          <Chart.Pie
            data={statusVolume}
            donut
            showLegend
            showLabel={false}
            centerSummaryLabel={t("analytics.charts.total")}
          />
        </ChartCard>

        <ChartCard
          className="col-span-12 @lg:col-span-8"
          icon={<LineChartIcon className="size-5" />}
          title={t("analytics.charts.onTimeTrend")}
          description={t("analytics.charts.descriptions.onTimeTrend")}
        >
          <LineChart
            xAxis={[...MONTH_LABELS]}
            series={[{ name: "On-time %", data: [...onTimeTrend] }]}
            type="smooth"
          />
        </ChartCard>

        <ChartCard
          className="col-span-12 @xl:col-span-8"
          icon={<ChartArea className="size-5" />}
          title={t("analytics.charts.revenueCost")}
          description={t("analytics.charts.descriptions.revenueCost")}
        >
          <AreaChart
            showLegend
            xAxis={[...revenueCost.labels]}
            series={[
              { name: "Revenue (k€)", data: [...revenueCost.primary] },
              { name: "Cost (k€)", data: [...revenueCost.secondary] },
            ]}
          />
        </ChartCard>

        <ChartCard
          className="col-span-12 @xl:col-span-4"
          icon={<Package className="size-5" />}
          title={t("analytics.charts.dailyVolume")}
          description={t("analytics.charts.descriptions.dailyVolume")}
        >
          <LineChart
            xAxis={dailyVolume.map((_, i) => `D${i + 1}`)}
            series={[{ name: "Shipments", data: [...dailyVolume] }]}
          />
        </ChartCard>

        <ChartCard
          className="col-span-12 @xl:col-span-8"
          icon={<Globe2 className="size-5" />}
          title={t("analytics.charts.countryVolume")}
          description={t("analytics.charts.descriptions.countryVolume")}
        >
          <LogisticsGeoMap
            data={countryVolume}
            rangeText={[
              t("overview.geoMap.rangeLow"),
              t("overview.geoMap.rangeHigh"),
            ]}
          />
        </ChartCard>

        <ChartCard
          className="col-span-12 @xl:col-span-4"
          icon={<PieChart className="size-5" />}
          title={t("analytics.charts.regionalShare")}
          description={t("analytics.charts.descriptions.regionalShare")}
        >
          <Chart.Pie
            data={regionalShare}
            donut
            showLegend
            showLabel={false}
            centerSummaryLabel={t("analytics.charts.total")}
          />
        </ChartCard>

        <ChartCard
          className="col-span-12 @lg:col-span-6"
          icon={<AlertTriangle className="size-5" />}
          title={t("analytics.charts.delaysByHub")}
          description={t("analytics.charts.descriptions.delaysByHub")}
        >
          <BarChart
            xAxis={delaysByHub.map((item) => item.name)}
            series={[
              { name: "Delays", data: delaysByHub.map((item) => item.value) },
            ]}
            horizontal
          />
        </ChartCard>

        <ChartCard
          className="col-span-12 @lg:col-span-6"
          icon={<TrendingUp className="size-5" />}
          title={t("analytics.charts.recentTrend")}
          description={t("analytics.charts.descriptions.recentTrend")}
        >
          <LineChart
            xAxis={recentTrend.map((_, i) => `D${i + 1}`)}
            series={[{ name: "Shipments", data: [...recentTrend] }]}
            type="smooth"
          />
        </ChartCard>

        <ChartCard
          className="col-span-12 @xl:col-span-8"
          icon={<Route className="size-5" />}
          title={t("analytics.charts.topRoutes")}
          description={t("analytics.charts.descriptions.topRoutes")}
        >
          <BarChart
            xAxis={topRoutes.map((route) => route.name)}
            series={[
              {
                name: "Shipments",
                data: topRoutes.map((route) => route.value),
              },
            ]}
            horizontal
          />
        </ChartCard>

        <PanelCard
          className="col-span-12 @xl:col-span-4"
          icon={<Route className="size-5" />}
          title={t("analytics.lists.topRoutes.title")}
          description={t("analytics.lists.topRoutes.description")}
        >
          {topRoutes.map((route) => (
            <ListRow
              key={route.name}
              primary={route.name}
              meta={String(route.value)}
            />
          ))}
        </PanelCard>
      </GridContainer>
    </div>
  );
}
