import type {
  DualSeriesDto,
  NamedValueDto,
  OverviewKpisDto,
  RevenueRouteDto,
} from "@dash/logistics-contracts";
import {
  EU_HUBS,
  MONTH_LABELS,
  daysAgo,
  type EuRegion,
} from "./european-context";
import { getFleetUtilizationPercent } from "./fleet";
import type { ShipmentDto } from "@dash/logistics-contracts";
import { getMonthToDateRange, getShipmentsInDateRange } from "./shipments";
import type { VehicleDto } from "@dash/logistics-contracts";

const DELIVERED_HOURS = [18, 20, 22, 19, 21, 23, 20, 18, 17, 19, 21, 20];

export function getOverviewKpis(
  shipments: ShipmentDto[],
  vehicles: VehicleDto[],
): OverviewKpisDto {
  const mtd = getMonthToDateRange();
  const mtdShipments = getShipmentsInDateRange(shipments, mtd.start, mtd.end);
  const delivered = mtdShipments.filter(
    (s) => s.status === "delivered" || s.status === "delayed",
  );
  const onTimeCount = delivered.filter((s) => s.onTime).length;
  const onTimePercent = delivered.length
    ? Math.round((onTimeCount / delivered.length) * 1000) / 10
    : 0;

  const revenueMtdEur = mtdShipments.reduce((sum, s) => sum + s.revenueEur, 0);
  const costMtdEur = mtdShipments.reduce((sum, s) => sum + s.costEur, 0);
  const marginPercent = revenueMtdEur
    ? Math.round(((revenueMtdEur - costMtdEur) / revenueMtdEur) * 1000) / 10
    : 0;

  const activeShipments = shipments.filter(
    (s) => s.status === "in_transit" || s.status === "pending",
  ).length;

  return {
    activeShipments,
    onTimePercent,
    avgDeliveryHours: 21.4,
    delayedCount: shipments.filter((s) => s.status === "delayed").length,
    fleetUtilizationPercent: getFleetUtilizationPercent(vehicles),
    revenueMtdEur,
    costMtdEur,
    marginPercent,
  };
}

export function getShipmentVolumeByStatus(
  shipments: ShipmentDto[],
): NamedValueDto[] {
  const counts = new Map<string, number>();
  for (const s of shipments) {
    counts.set(s.status, (counts.get(s.status) ?? 0) + 1);
  }
  return Array.from(counts.entries()).map(([name, value]) => ({ name, value }));
}

export function getOnTimeTrendSeries(): readonly number[] {
  return [
    91.2, 92.1, 91.8, 93.4, 92.9, 94.1, 93.6, 94.8, 95.2, 94.5, 95.1, 95.8,
  ];
}

export function getRevenueCostSeries(): DualSeriesDto {
  return {
    labels: [...MONTH_LABELS],
    primary: [842, 891, 915, 878, 934, 968, 1002, 1045, 1018, 1089, 1124, 1168],
    secondary: [612, 648, 671, 655, 698, 721, 745, 768, 752, 789, 812, 834],
  };
}

export function getDailyShipmentVolume(): readonly number[] {
  return [42, 48, 45, 52, 49, 55, 51, 58, 54, 61, 57, 63];
}

export function getDelaysByHub(): NamedValueDto[] {
  return EU_HUBS.slice(0, 8).map((hub, i) => ({
    name: hub.city,
    value: 3 + ((i * 7) % 18),
  }));
}

export function getRegionalShipmentShare(): NamedValueDto[] {
  const regions: EuRegion[] = [
    "benelux",
    "dach",
    "iberia",
    "nordics",
    "central_europe",
    "western_europe",
  ];
  return regions.map((region, i) => ({
    name: region,
    value: 85 + i * 22 + (i % 3) * 11,
  }));
}

export function getTopRoutesByVolume(
  shipments: ShipmentDto[],
  limit = 6,
): NamedValueDto[] {
  const counts = new Map<string, number>();
  for (const s of shipments) {
    const label = `${s.originCity} → ${s.destinationCity}`;
    counts.set(label, (counts.get(label) ?? 0) + 1);
  }
  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([name, value]) => ({ name, value }));
}

export function getDeliveryPerformanceByHub(): DualSeriesDto {
  const hubs = EU_HUBS.slice(0, 6);
  return {
    labels: hubs.map((h) => h.city),
    primary: hubs.map((_, i) => 88 + (i % 4) * 2.5),
    secondary: DELIVERED_HOURS.slice(0, hubs.length),
  };
}

export function getRevenueByRouteTopN(
  shipments: ShipmentDto[],
  n = 8,
): RevenueRouteDto[] {
  const totals = new Map<string, { revenue: number; cost: number }>();
  for (const s of shipments) {
    const label = `${s.originCity} → ${s.destinationCity}`;
    const current = totals.get(label) ?? { revenue: 0, cost: 0 };
    totals.set(label, {
      revenue: current.revenue + s.revenueEur,
      cost: current.cost + s.costEur,
    });
  }
  return Array.from(totals.entries())
    .map(([name, data]) => ({ name, ...data }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, n);
}

export function getFleetUtilizationByRegion(): NamedValueDto[] {
  return [
    { name: "benelux", value: 78 },
    { name: "dach", value: 84 },
    { name: "iberia", value: 71 },
    { name: "nordics", value: 69 },
    { name: "central_europe", value: 76 },
    { name: "western_europe", value: 81 },
  ];
}

export function getRecentShipmentTrend(): readonly number[] {
  return Array.from({ length: 30 }, (_, i) => 38 + ((i * 13) % 24));
}

export function getAnalyticsDateRangeStart(): number {
  return daysAgo(90);
}
