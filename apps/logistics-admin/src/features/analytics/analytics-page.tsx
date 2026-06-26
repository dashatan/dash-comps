import {
  GridCard,
  GridContainer,
  GridHeader,
} from "@/components/common/grid";
import BarChart from "@/components/common/charts/bar";
import LineChart from "@/components/common/charts/line";
import AreaChart from "@/components/common/charts/area";
import DoughnutChart from "@/components/common/charts/doughnut";
import {
  getDelaysByHub,
  getOnTimeTrendSeries,
  getRegionalShipmentShare,
  getRevenueCostSeries,
  getShipmentVolumeByStatus,
  getTopRoutesByVolume,
} from "@/data/analytics";
import { MONTH_LABELS } from "@/data/european-context";
import { useLogisticsT } from "@/i18n/provider";
import { PageHeader } from "@/shared/page-header";

export function AnalyticsPage() {
  const t = useLogisticsT();
  const statusVolume = getShipmentVolumeByStatus().map((item) => ({
    ...item,
    name: t(`shipments.statuses.${item.name}` as Parameters<typeof t>[0]),
  }));
  const onTimeTrend = getOnTimeTrendSeries();
  const revenueCost = getRevenueCostSeries();
  const delaysByHub = getDelaysByHub();
  const regionalShare = getRegionalShipmentShare().map((item) => ({
    ...item,
    name: t(`shipments.regions.${item.name}` as Parameters<typeof t>[0]),
  }));
  const topRoutes = getTopRoutesByVolume();

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
              series={[{ name: "Delays", data: delaysByHub.map((d) => d.value) }]}
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
              series={[{ name: "Shipments", data: topRoutes.map((r) => r.value) }]}
              horizontal
            />
          </div>
        </GridCard>
      </GridContainer>
    </div>
  );
}
