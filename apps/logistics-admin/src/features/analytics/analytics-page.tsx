import { useQueries } from "@tanstack/react-query";
import Loading from "@/components/common/loading";
import { GridCard, GridContainer, GridHeader } from "@/components/common/grid";
import BarChart from "@/components/common/charts/bar";
import LineChart from "@/components/common/charts/line";
import AreaChart from "@/components/common/charts/area";
import DoughnutChart from "@/components/common/charts/doughnut";
import { queryKeys } from "@/core/query-keys";
import { analyticsRepository } from "@/infrastructure/http/repositories";
import { useLogisticsT } from "@/i18n/provider";
import { PageHeader } from "@/shared/page-header";
import { MONTH_LABELS } from "@/shared/formatters";

export function AnalyticsPage() {
  const t = useLogisticsT();

  const [
    statusVolumeQuery,
    onTimeTrendQuery,
    revenueCostQuery,
    delaysByHubQuery,
    regionalShareQuery,
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
        queryKey: queryKeys.analytics.delaysByHub,
        queryFn: () => analyticsRepository.getDelaysByHub(),
      },
      {
        queryKey: queryKeys.analytics.regionalShare,
        queryFn: () => analyticsRepository.getRegionalShare(),
      },
      {
        queryKey: queryKeys.analytics.topRoutes(6),
        queryFn: () => analyticsRepository.getTopRoutes(6),
      },
    ],
  });

  const isLoading = [
    statusVolumeQuery,
    onTimeTrendQuery,
    revenueCostQuery,
    delaysByHubQuery,
    regionalShareQuery,
    topRoutesQuery,
  ].some((q) => q.isLoading);

  const isError = [
    statusVolumeQuery,
    onTimeTrendQuery,
    revenueCostQuery,
    delaysByHubQuery,
    regionalShareQuery,
    topRoutesQuery,
  ].some((q) => q.isError);

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
    !delaysByHubQuery.data ||
    !regionalShareQuery.data ||
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
  const delaysByHub = delaysByHubQuery.data;
  const regionalShare = regionalShareQuery.data.map((item) => ({
    ...item,
    name: t(`shipments.regions.${item.name}` as Parameters<typeof t>[0]),
  }));
  const topRoutes = topRoutesQuery.data;

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <PageHeader
        title={t("analytics.title")}
        subtitle={t("analytics.subtitle")}
        breadcrumbLabel={t("analytics.title")}
        breadcrumbHref="/analytics"
      />
      <GridContainer aria-label={t("analytics.title")}>
        <GridCard className="col-span-12 @lg:col-span-4">
          <GridHeader title={t("analytics.charts.statusVolume")} />
          <div className="min-h-72">
            <DoughnutChart data={statusVolume} showLegend />
          </div>
        </GridCard>

        <GridCard className="col-span-12 @lg:col-span-8">
          <GridHeader title={t("analytics.charts.onTimeTrend")} />
          <div className="min-h-72">
            <LineChart
              xAxis={[...MONTH_LABELS]}
              series={[{ name: "On-time %", data: [...onTimeTrend] }]}
              type="smooth"
            />
          </div>
        </GridCard>

        <GridCard className="col-span-12">
          <GridHeader title={t("analytics.charts.revenueCost")} />
          <div className="min-h-80">
            <AreaChart
              xAxis={[...revenueCost.labels]}
              series={[
                { name: "Revenue (k€)", data: [...revenueCost.primary] },
                { name: "Cost (k€)", data: [...revenueCost.secondary] },
              ]}
            />
          </div>
        </GridCard>

        <GridCard className="col-span-12 @lg:col-span-6">
          <GridHeader title={t("analytics.charts.delaysByHub")} />
          <div className="min-h-72">
            <BarChart
              xAxis={delaysByHub.map((d) => d.name)}
              series={[
                { name: "Delays", data: delaysByHub.map((d) => d.value) },
              ]}
              horizontal
            />
          </div>
        </GridCard>

        <GridCard className="col-span-12 @lg:col-span-6">
          <GridHeader title={t("analytics.charts.regionalShare")} />
          <div className="min-h-72">
            <DoughnutChart data={regionalShare} showLegend />
          </div>
        </GridCard>

        <GridCard className="col-span-12">
          <GridHeader title={t("analytics.charts.topRoutes")} />
          <div className="min-h-80">
            <BarChart
              xAxis={topRoutes.map((r) => r.name)}
              series={[
                { name: "Shipments", data: topRoutes.map((r) => r.value) },
              ]}
              horizontal
            />
          </div>
        </GridCard>
      </GridContainer>
    </div>
  );
}
