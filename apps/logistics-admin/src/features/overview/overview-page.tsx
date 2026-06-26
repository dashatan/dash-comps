import type { ReactNode } from "react";
import {
  Activity,
  Clock,
  Package,
  Percent,
  TrendingUp,
  Truck,
  Wallet,
} from "lucide-react";
import { GridCard, GridContainer, GridHeader } from "@/components/common/grid";
import LineChart from "@/components/common/charts/line";
import AreaChart from "@/components/common/charts/area";
import { formatEur, MONTH_LABELS } from "@/data/european-context";
import {
  getDailyShipmentVolume,
  getOnTimeTrendSeries,
  getOverviewKpis,
  getRevenueCostSeries,
} from "@/data/analytics";
import { useLogisticsT } from "@/i18n/provider";
import { PageHeader } from "@/shared/page-header";

function KpiCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: ReactNode;
}) {
  return (
    <GridCard className="col-span-12 @lg:col-span-6 @2xl:col-span-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <span className="text-xs text-muted-foreground">{label}</span>
          <span className="text-2xl font-semibold tabular-nums">{value}</span>
        </div>
        <div className="flex size-10 items-center justify-center rounded-lg bg-muted text-muted-foreground">
          {icon}
        </div>
      </div>
    </GridCard>
  );
}

export function OverviewPage() {
  const t = useLogisticsT();
  const kpis = getOverviewKpis();
  const revenueCost = getRevenueCostSeries();
  const onTimeTrend = getOnTimeTrendSeries();
  const dailyVolume = getDailyShipmentVolume();

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <PageHeader
        title={t("overview.title")}
        subtitle={t("overview.subtitle")}
        breadcrumbLabel={t("overview.title")}
      />
      <GridContainer aria-label={t("overview.title")}>
        <KpiCard
          label={t("overview.kpis.activeShipments")}
          value={String(kpis.activeShipments)}
          icon={<Package className="size-5" />}
        />
        <KpiCard
          label={t("overview.kpis.onTimePercent")}
          value={`${kpis.onTimePercent}%`}
          icon={<Percent className="size-5" />}
        />
        <KpiCard
          label={t("overview.kpis.avgDeliveryHours")}
          value={`${kpis.avgDeliveryHours} h`}
          icon={<Clock className="size-5" />}
        />
        <KpiCard
          label={t("overview.kpis.delayedCount")}
          value={String(kpis.delayedCount)}
          icon={<Activity className="size-5" />}
        />
        <KpiCard
          label={t("overview.kpis.fleetUtilization")}
          value={`${kpis.fleetUtilizationPercent}%`}
          icon={<Truck className="size-5" />}
        />
        <KpiCard
          label={t("overview.kpis.revenueMtd")}
          value={formatEur(kpis.revenueMtdEur)}
          icon={<TrendingUp className="size-5" />}
        />
        <KpiCard
          label={t("overview.kpis.costMtd")}
          value={formatEur(kpis.costMtdEur)}
          icon={<Wallet className="size-5" />}
        />
        <KpiCard
          label={t("overview.kpis.marginPercent")}
          value={`${kpis.marginPercent}%`}
          icon={<Percent className="size-5" />}
        />

        <GridCard className="col-span-12 @xl:col-span-8">
          <GridHeader title={t("overview.charts.revenueCost")} />
          <div className="min-h-64">
            <AreaChart
              xAxis={[...revenueCost.labels]}
              series={[
                { name: "Revenue", data: [...revenueCost.primary] },
                { name: "Cost", data: [...revenueCost.secondary] },
              ]}
              showLegend
            />
          </div>
        </GridCard>

        <GridCard className="col-span-12 @xl:col-span-4">
          <GridHeader title={t("overview.charts.dailyVolume")} />
          <div className="min-h-64">
            <LineChart
              xAxis={dailyVolume.map((_, i) => `D${i + 1}`)}
              series={[{ name: "Shipments", data: [...dailyVolume] }]}
              showLegend={false}
            />
          </div>
        </GridCard>

        <GridCard className="col-span-12">
          <GridHeader title={t("overview.charts.onTimeTrend")} />
          <div className="min-h-72">
            <LineChart
              xAxis={[...MONTH_LABELS]}
              series={[{ name: "On-time %", data: [...onTimeTrend] }]}
              showLegend={false}
              type="smooth"
            />
          </div>
        </GridCard>
      </GridContainer>
    </div>
  );
}
