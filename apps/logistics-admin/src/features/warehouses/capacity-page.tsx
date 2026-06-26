import { useQuery } from "@tanstack/react-query";
import { BarChart3, Building2, ListOrdered, Package } from "lucide-react";
import BarChart from "@/components/common/charts/bar";
import { GridContainer } from "@/components/common/grid";
import { queryKeys } from "@/core/query-keys";
import {
  ChartCard,
  KpiCard,
  ListRow,
  PanelCard,
} from "@/features/overview/overview-components";
import { warehousesRepository } from "@/infrastructure/http/repositories";
import { useAppLanguage } from "@/i18n/use-app-language";
import Loading from "@/components/common/loading";
import { PageHeader } from "@/shared/page-header";

function utilizationPercent(used: number, total: number): number {
  if (total <= 0) return 0;
  return Math.round((used / total) * 1000) / 10;
}

export function CapacityPage() {
  const { t } = useAppLanguage();

  const summaryQuery = useQuery({
    queryKey: queryKeys.warehouses.capacitySummary,
    queryFn: () => warehousesRepository.getCapacitySummary(),
  });

  const capacityQuery = useQuery({
    queryKey: queryKeys.warehouses.capacity({
      page: 0,
      pageSize: 100,
    }),
    queryFn: () =>
      warehousesRepository.listCapacity({ page: 0, pageSize: 100 }),
  });

  const isLoading = summaryQuery.isLoading || capacityQuery.isLoading;
  const isError = summaryQuery.isError || capacityQuery.isError;

  if (isLoading) {
    return (
      <div className="flex min-h-0 flex-1 flex-col">
        <PageHeader
          title={t("warehouses.capacity.title")}
          subtitle={t("warehouses.capacity.subtitle")}
          breadcrumbLabel={t("warehouses.title")}
          breadcrumbHref="/warehouses/hubs"
        />
        <div className="flex flex-1 items-center justify-center p-12">
          <Loading label={t("common.loading")} />
        </div>
      </div>
    );
  }

  if (isError || !summaryQuery.data || !capacityQuery.data) {
    return (
      <div className="flex min-h-0 flex-1 flex-col">
        <PageHeader
          title={t("warehouses.capacity.title")}
          subtitle={t("warehouses.capacity.subtitle")}
          breadcrumbLabel={t("warehouses.title")}
          breadcrumbHref="/warehouses/hubs"
        />
        <div className="flex flex-1 items-center justify-center p-12 text-sm text-destructive">
          Failed to load data
        </div>
      </div>
    );
  }

  const summary = summaryQuery.data;
  const capacities = capacityQuery.data.items;

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <PageHeader
        title={t("warehouses.capacity.title")}
        subtitle={t("warehouses.capacity.subtitle")}
        breadcrumbLabel={t("warehouses.title")}
        breadcrumbHref="/warehouses/hubs"
      />
      <GridContainer
        className="auto-rows-auto grid-rows-none items-stretch"
        aria-label={t("warehouses.capacity.title")}
      >
        <KpiCard
          label={t("warehouses.summary.totalSlots")}
          description={t("warehouses.summary.totalSlotsDescription")}
          value={String(summary.totalSlots)}
          icon={<Package className="size-5" />}
        />
        <KpiCard
          label={t("warehouses.summary.usedSlots")}
          description={t("warehouses.summary.usedSlotsDescription")}
          value={String(summary.usedSlots)}
          icon={<Building2 className="size-5" />}
        />
        <KpiCard
          label={t("warehouses.summary.avgUtilization")}
          description={t("warehouses.summary.avgUtilizationDescription")}
          value={`${summary.avgUtilizationPercent}%`}
          icon={<BarChart3 className="size-5" />}
        />
        <KpiCard
          label={t("warehouses.summary.hubCount")}
          description={t("warehouses.summary.hubCountDescription")}
          value={String(summary.hubCount)}
          icon={<Building2 className="size-5" />}
        />

        <ChartCard
          className="col-span-12 @xl:col-span-8"
          icon={<BarChart3 className="size-5" />}
          title={t("warehouses.charts.utilizationByHub")}
          description={t("warehouses.charts.utilizationByHubDescription")}
        >
          <BarChart
            xAxis={capacities.map((row) => row.city)}
            series={[
              {
                name: "Utilisation %",
                data: capacities.map((row) =>
                  utilizationPercent(row.usedSlots, row.storageSlots),
                ),
              },
            ]}
          />
        </ChartCard>

        <PanelCard
          className="col-span-12 @xl:col-span-4"
          icon={<ListOrdered className="size-5" />}
          title={t("warehouses.lists.capacityRankings.title")}
          description={t("warehouses.lists.capacityRankings.description")}
        >
          {[...capacities]
            .sort(
              (a, b) =>
                utilizationPercent(b.usedSlots, b.storageSlots) -
                utilizationPercent(a.usedSlots, a.storageSlots),
            )
            .map((row) => (
              <ListRow
                key={row.hubId}
                primary={row.city}
                secondary={`${row.usedSlots}/${row.storageSlots} slots`}
                meta={`${utilizationPercent(row.usedSlots, row.storageSlots)}%`}
              />
            ))}
        </PanelCard>
      </GridContainer>
    </div>
  );
}
