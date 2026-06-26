import { useQueries } from "@tanstack/react-query";
import type { ShipmentDto } from "@dash/logistics-contracts";
import {
  Activity,
  AlertTriangle,
  BarChart3,
  ChartArea,
  Clock,
  Globe2,
  LineChart as LineChartIcon,
  ListOrdered,
  MapPin,
  Package,
  Percent,
  PieChart,
  Radio,
  Route,
  TrendingUp,
  Truck,
  Wallet,
} from "lucide-react";
import Loading from "@/components/common/loading";
import { GridContainer } from "@/components/common/grid";
import { Chart } from "@/components/common/charts";
import AreaChart from "@/components/common/charts/area";
import BarChart from "@/components/common/charts/bar";
import LineChart from "@/components/common/charts/line";
import { StatusBox } from "@/components/compound/table";
import { queryKeys } from "@/core/query-keys";
import {
  ChartCard,
  KpiCard,
  ListRow,
  PanelCard,
} from "@/features/overview/overview-components";
import { FleetSnapshotWidget } from "@/features/overview/fleet-snapshot-widget";
import {
  analyticsRepository,
  fleetRepository,
  overviewRepository,
  shipmentsRepository,
  trackerRepository,
} from "@/infrastructure/http/repositories";
import { useLogisticsT } from "@/i18n/provider";
import { LogisticsGeoMap } from "@/shared/components/logistics-geo-map";
import { PageHeader } from "@/shared/page-header";
import {
  formatEur,
  formatEuropeanDateTime,
  MONTH_LABELS,
} from "@/shared/formatters";

const RECENT_SHIPMENTS_PARAMS = {
  page: 0,
  pageSize: 6,
  sortField: "scheduledAt",
  sortOrder: -1 as const,
};

const STATUS_COLORS = {
  pending: "warning",
  in_transit: "info",
  delivered: "success",
  delayed: "error",
  cancelled: "secondary",
} as const;

export function OverviewPage() {
  const t = useLogisticsT();

  const [
    kpisQuery,
    revenueCostQuery,
    onTimeTrendQuery,
    dailyVolumeQuery,
    countryVolumeQuery,
    regionalShareQuery,
    statusVolumeQuery,
    delaysByHubQuery,
    topRoutesQuery,
    recentTrendQuery,
    recentShipmentsQuery,
    fleetSummaryQuery,
    liveTrackerQuery,
  ] = useQueries({
    queries: [
      {
        queryKey: queryKeys.overview.kpis,
        queryFn: () => overviewRepository.getKpis(),
      },
      {
        queryKey: queryKeys.analytics.revenueCost,
        queryFn: () => analyticsRepository.getRevenueCost(),
      },
      {
        queryKey: queryKeys.analytics.onTimeTrend,
        queryFn: () => analyticsRepository.getOnTimeTrend(),
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
        queryKey: queryKeys.analytics.regionalShare,
        queryFn: () => analyticsRepository.getRegionalShare(),
      },
      {
        queryKey: queryKeys.analytics.shipmentVolume,
        queryFn: () => analyticsRepository.getShipmentVolume(),
      },
      {
        queryKey: queryKeys.analytics.delaysByHub,
        queryFn: () => analyticsRepository.getDelaysByHub(),
      },
      {
        queryKey: queryKeys.analytics.topRoutes(5),
        queryFn: () => analyticsRepository.getTopRoutes(5),
      },
      {
        queryKey: queryKeys.analytics.recentTrend,
        queryFn: () => analyticsRepository.getRecentTrend(),
      },
      {
        queryKey: queryKeys.shipments.list(RECENT_SHIPMENTS_PARAMS),
        queryFn: () => shipmentsRepository.list(RECENT_SHIPMENTS_PARAMS),
      },
      {
        queryKey: queryKeys.fleet.summary,
        queryFn: () => fleetRepository.getSummary(),
      },
      {
        queryKey: queryKeys.tracker.live,
        queryFn: () => trackerRepository.getLiveEvents(),
      },
    ],
  });

  const queries = [
    kpisQuery,
    revenueCostQuery,
    onTimeTrendQuery,
    dailyVolumeQuery,
    countryVolumeQuery,
    regionalShareQuery,
    statusVolumeQuery,
    delaysByHubQuery,
    topRoutesQuery,
    recentTrendQuery,
    recentShipmentsQuery,
    fleetSummaryQuery,
    liveTrackerQuery,
  ];

  const isLoading = queries.some((query) => query.isLoading);
  const isError = queries.some((query) => query.isError);

  if (isLoading) {
    return (
      <div className="flex min-h-0 flex-1 flex-col">
        <PageHeader
          title={t("overview.title")}
          subtitle={t("overview.subtitle")}
          breadcrumbLabel={t("overview.title")}
        />
        <div className="flex flex-1 items-center justify-center p-12">
          <Loading label="Loading…" />
        </div>
      </div>
    );
  }

  if (
    isError ||
    !kpisQuery.data ||
    !revenueCostQuery.data ||
    !onTimeTrendQuery.data ||
    !dailyVolumeQuery.data ||
    !countryVolumeQuery.data ||
    !regionalShareQuery.data ||
    !statusVolumeQuery.data ||
    !delaysByHubQuery.data ||
    !topRoutesQuery.data ||
    !recentTrendQuery.data ||
    !recentShipmentsQuery.data ||
    !fleetSummaryQuery.data ||
    !liveTrackerQuery.data
  ) {
    return (
      <div className="flex min-h-0 flex-1 flex-col">
        <PageHeader
          title={t("overview.title")}
          subtitle={t("overview.subtitle")}
          breadcrumbLabel={t("overview.title")}
        />
        <div className="flex flex-1 items-center justify-center p-12 text-sm text-destructive">
          Failed to load data
        </div>
      </div>
    );
  }

  const kpis = kpisQuery.data;
  const revenueCost = revenueCostQuery.data;
  const onTimeTrend = onTimeTrendQuery.data;
  const dailyVolume = dailyVolumeQuery.data;
  const countryVolume = countryVolumeQuery.data;
  const regionalShare = regionalShareQuery.data.map((item) => ({
    ...item,
    name: t(`shipments.regions.${item.name}` as Parameters<typeof t>[0]),
  }));
  const statusVolume = statusVolumeQuery.data.map((item) => ({
    ...item,
    name: t(`shipments.statuses.${item.name}` as Parameters<typeof t>[0]),
  }));
  const delaysByHub = delaysByHubQuery.data;
  const topRoutes = topRoutesQuery.data;
  const recentTrend = recentTrendQuery.data;
  const recentShipments = recentShipmentsQuery.data.items;
  const fleetSummary = fleetSummaryQuery.data;
  const liveEvents = liveTrackerQuery.data.slice(0, 6);

  const renderShipmentStatus = (shipment: ShipmentDto) => (
    <StatusBox
      text={t(`shipments.statuses.${shipment.status}`)}
      color={STATUS_COLORS[shipment.status]}
    />
  );

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <PageHeader
        title={t("overview.title")}
        subtitle={t("overview.subtitle")}
        breadcrumbLabel={t("overview.title")}
      />
      <GridContainer
        className="auto-rows-auto grid-rows-none items-stretch"
        aria-label={t("overview.title")}
      >
        <KpiCard
          label={t("overview.kpis.activeShipments")}
          description={t("overview.kpis.descriptions.activeShipments")}
          value={String(kpis.activeShipments)}
          icon={<Package className="size-5" />}
        />
        <KpiCard
          label={t("overview.kpis.onTimePercent")}
          description={t("overview.kpis.descriptions.onTimePercent")}
          value={`${kpis.onTimePercent}%`}
          icon={<Percent className="size-5" />}
        />
        <KpiCard
          label={t("overview.kpis.avgDeliveryHours")}
          description={t("overview.kpis.descriptions.avgDeliveryHours")}
          value={`${kpis.avgDeliveryHours} h`}
          icon={<Clock className="size-5" />}
        />
        <KpiCard
          label={t("overview.kpis.delayedCount")}
          description={t("overview.kpis.descriptions.delayedCount")}
          value={String(kpis.delayedCount)}
          icon={<Activity className="size-5" />}
        />
        <KpiCard
          label={t("overview.kpis.fleetUtilization")}
          description={t("overview.kpis.descriptions.fleetUtilization")}
          value={`${kpis.fleetUtilizationPercent}%`}
          icon={<Truck className="size-5" />}
        />
        <KpiCard
          label={t("overview.kpis.revenueMtd")}
          description={t("overview.kpis.descriptions.revenueMtd")}
          value={formatEur(kpis.revenueMtdEur)}
          icon={<TrendingUp className="size-5" />}
        />
        <KpiCard
          label={t("overview.kpis.costMtd")}
          description={t("overview.kpis.descriptions.costMtd")}
          value={formatEur(kpis.costMtdEur)}
          icon={<Wallet className="size-5" />}
        />
        <KpiCard
          label={t("overview.kpis.marginPercent")}
          description={t("overview.kpis.descriptions.marginPercent")}
          value={`${kpis.marginPercent}%`}
          icon={<PieChart className="size-5" />}
        />

        <ChartCard
          className="col-span-12 @xl:col-span-8"
          icon={<Globe2 className="size-5" />}
          title={t("overview.geoMap.title")}
          description={t("overview.geoMap.description")}
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
          description={t("overview.charts.descriptions.regionalShare")}
        >
          <Chart.Pie
            data={regionalShare}
            donut
            showLegend
            showLabel={false}
            centerSummaryLabel={t("overview.charts.total")}
          />
        </ChartCard>

        <ChartCard
          className="col-span-12 @lg:col-span-4"
          icon={<ChartArea className="size-5" />}
          title={t("overview.charts.revenueCost")}
          description={t("overview.charts.descriptions.revenueCost")}
        >
          <AreaChart
            showLegend
            xAxis={[...revenueCost.labels]}
            series={[
              { name: "Revenue", data: [...revenueCost.primary] },
              { name: "Cost", data: [...revenueCost.secondary] },
            ]}
          />
        </ChartCard>

        <ChartCard
          className="col-span-12 @lg:col-span-4"
          icon={<Package className="size-5" />}
          title={t("overview.charts.dailyVolume")}
          description={t("overview.charts.descriptions.dailyVolume")}
        >
          <LineChart
            xAxis={dailyVolume.map((_, i) => `D${i + 1}`)}
            series={[{ name: "Shipments", data: [...dailyVolume] }]}
          />
        </ChartCard>

        <ChartCard
          className="col-span-12 @lg:col-span-4"
          icon={<BarChart3 className="size-5" />}
          title={t("analytics.charts.statusVolume")}
          description={t("overview.charts.descriptions.statusVolume")}
        >
          <Chart.Pie
            data={statusVolume}
            donut
            showLegend
            showLabel={false}
            centerSummaryLabel={t("overview.charts.total")}
          />
        </ChartCard>

        <ChartCard
          className="col-span-12 @lg:col-span-6"
          icon={<LineChartIcon className="size-5" />}
          title={t("overview.charts.onTimeTrend")}
          description={t("overview.charts.descriptions.onTimeTrend")}
        >
          <LineChart
            xAxis={[...MONTH_LABELS]}
            series={[{ name: "On-time %", data: [...onTimeTrend] }]}
            type="smooth"
          />
        </ChartCard>

        <ChartCard
          className="col-span-12 @lg:col-span-6"
          icon={<AlertTriangle className="size-5" />}
          title={t("analytics.charts.delaysByHub")}
          description={t("overview.charts.descriptions.delaysByHub")}
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
          className="col-span-12 @xl:col-span-8"
          icon={<TrendingUp className="size-5" />}
          title={t("overview.charts.recentTrend")}
          description={t("overview.charts.descriptions.recentTrend")}
        >
          <LineChart
            xAxis={recentTrend.map((_, i) => `D${i + 1}`)}
            series={[{ name: "Shipments", data: [...recentTrend] }]}
            type="smooth"
          />
        </ChartCard>

        <PanelCard
          className="col-span-12 @xl:col-span-4"
          icon={<Truck className="size-5" />}
          title={t("overview.widgets.fleet.title")}
          description={t("overview.widgets.fleet.description")}
        >
          <FleetSnapshotWidget summary={fleetSummary} t={t} />
        </PanelCard>

        <PanelCard
          className="col-span-12 @lg:col-span-4"
          icon={<Route className="size-5" />}
          title={t("overview.lists.topRoutes.title")}
          description={t("overview.lists.topRoutes.description")}
        >
          {topRoutes.map((route) => (
            <ListRow
              key={route.name}
              primary={route.name}
              meta={String(route.value)}
            />
          ))}
        </PanelCard>

        <PanelCard
          className="col-span-12 @lg:col-span-4"
          icon={<ListOrdered className="size-5" />}
          title={t("overview.lists.recentShipments.title")}
          description={t("overview.lists.recentShipments.description")}
        >
          {recentShipments.map((shipment) => (
            <ListRow
              key={shipment.id}
              primary={shipment.trackingNumber}
              secondary={`${shipment.originCity} → ${shipment.destinationCity}`}
              trailing={renderShipmentStatus(shipment)}
            />
          ))}
        </PanelCard>

        <PanelCard
          className="col-span-12 @lg:col-span-4"
          icon={<MapPin className="size-5" />}
          title={t("overview.lists.hubDelays.title")}
          description={t("overview.lists.hubDelays.description")}
        >
          {delaysByHub.slice(0, 6).map((hub) => (
            <ListRow
              key={hub.name}
              primary={hub.name}
              secondary={t("overview.lists.hubDelays.delayCount")}
              meta={String(hub.value)}
            />
          ))}
        </PanelCard>

        <PanelCard
          className="col-span-12"
          icon={<Radio className="size-5" />}
          title={t("overview.widgets.liveTracker.title")}
          description={t("overview.widgets.liveTracker.description")}
        >
          {liveEvents.map((event) => (
            <ListRow
              key={event.id}
              primary={event.name}
              secondary={event.road}
              meta={formatEuropeanDateTime(event.time)}
              trailing={
                event.error ? (
                  <span className="size-2 shrink-0 rounded-full bg-destructive" />
                ) : (
                  <span className="size-2 shrink-0 rounded-full bg-emerald-500" />
                )
              }
            />
          ))}
        </PanelCard>
      </GridContainer>
    </div>
  );
}
