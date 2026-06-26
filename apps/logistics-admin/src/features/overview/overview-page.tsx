import type { ReactNode } from "react";
import { useQueries } from "@tanstack/react-query";
import {
  Activity,
  Clock,
  Package,
  Percent,
  TrendingUp,
  Truck,
  Wallet,
} from "lucide-react";
import Loading from "@/components/common/loading";
import { GridCard, GridContainer, GridHeader } from "@/components/common/grid";
import LineChart from "@/components/common/charts/line";
import AreaChart from "@/components/common/charts/area";
import { queryKeys } from "@/core/query-keys";
import {
  analyticsRepository,
  overviewRepository,
} from "@/infrastructure/http/repositories";
import { useLogisticsT } from "@/i18n/provider";
import { PageHeader } from "@/shared/page-header";
import { formatEur, MONTH_LABELS } from "@/shared/formatters";

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

  const [kpisQuery, revenueCostQuery, onTimeTrendQuery, dailyVolumeQuery] =
    useQueries({
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
      ],
    });

  const isLoading =
    kpisQuery.isLoading ||
    revenueCostQuery.isLoading ||
    onTimeTrendQuery.isLoading ||
    dailyVolumeQuery.isLoading;

  const isError =
    kpisQuery.isError ||
    revenueCostQuery.isError ||
    onTimeTrendQuery.isError ||
    dailyVolumeQuery.isError;

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
    !dailyVolumeQuery.data
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
