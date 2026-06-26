import {
  getDeliveryPerformanceByHub,
  getFleetUtilizationByRegion,
  getOnTimeTrendSeries,
  getRevenueByRouteTopN,
  getRevenueCostSeries,
} from "@/data/analytics";
import { MONTH_LABELS } from "@/data/european-context";

export const REPORT_IDS = [
  "delivery-performance",
  "revenue-by-route",
  "fleet-utilization",
] as const;

export type ReportId = (typeof REPORT_IDS)[number];

export function getDeliveryPerformanceReport() {
  const byHub = getDeliveryPerformanceByHub();
  const onTimeTrend = getOnTimeTrendSeries();
  return {
    onTimeTrend: {
      labels: MONTH_LABELS,
      values: onTimeTrend,
    },
    byHub,
    summary: {
      avgOnTimePercent: 94.2,
      avgDeliveryHours: 20.8,
      delayedShipments: 47,
      hubsMonitored: byHub.labels.length,
    },
  };
}

export function getRevenueByRouteReport() {
  const routes = getRevenueByRouteTopN(10);
  const series = getRevenueCostSeries();
  return {
    topRoutes: routes,
    monthlyTrend: series,
    summary: {
      totalRevenueEur: routes.reduce((s, r) => s + r.revenue, 0),
      totalCostEur: routes.reduce((s, r) => s + r.cost, 0),
      topRoute: routes[0]?.name ?? "—",
      routeCount: routes.length,
    },
  };
}

export function getFleetUtilizationReport() {
  const byRegion = getFleetUtilizationByRegion();
  return {
    byRegion,
    weeklyUtilization: [72, 74, 76, 78, 77, 79, 81, 80, 82, 83, 81, 84],
    summary: {
      fleetSize: 86,
      activeVehicles: 68,
      avgUtilizationPercent: 78.6,
      maintenanceCount: 8,
    },
  };
}
