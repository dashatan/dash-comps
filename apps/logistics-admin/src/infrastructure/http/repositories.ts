import { apiClient, listParamsToQuery } from "@/core/api-client";
import type {
  AnalyticsRepository,
  FleetRepository,
  OverviewRepository,
  ReportsRepository,
  ShipmentsRepository,
  TrackerRepository,
} from "@/domain/ports";
import type { ListParams } from "@dash/logistics-contracts";

export const overviewRepository: OverviewRepository = {
  getKpis: () => apiClient.get("/v1/overview/kpis"),
};

export const analyticsRepository: AnalyticsRepository = {
  getShipmentVolume: () => apiClient.get("/v1/analytics/shipment-volume"),
  getOnTimeTrend: () => apiClient.get("/v1/analytics/on-time-trend"),
  getRevenueCost: () => apiClient.get("/v1/analytics/revenue-cost"),
  getDailyVolume: () => apiClient.get("/v1/analytics/daily-volume"),
  getDelaysByHub: () => apiClient.get("/v1/analytics/delays-by-hub"),
  getRegionalShare: () => apiClient.get("/v1/analytics/regional-share"),
  getTopRoutes: (limit = 6) =>
    apiClient.get("/v1/analytics/top-routes", { limit }),
  getRecentTrend: () => apiClient.get("/v1/analytics/recent-trend"),
};

export const reportsRepository: ReportsRepository = {
  getDeliveryPerformance: () =>
    apiClient.get("/v1/reports/delivery-performance"),
  getRevenueByRoute: () => apiClient.get("/v1/reports/revenue-by-route"),
  getFleetUtilization: () => apiClient.get("/v1/reports/fleet-utilization"),
};

export const shipmentsRepository: ShipmentsRepository = {
  list: (params) => apiClient.get("/v1/shipments", listParamsToQuery(params)),
};

export const fleetRepository: FleetRepository = {
  listVehicles: (params) =>
    apiClient.get("/v1/fleet/vehicles", listParamsToQuery(params)),
  listDrivers: (params) =>
    apiClient.get("/v1/fleet/drivers", listParamsToQuery(params)),
  listAssignments: (params) =>
    apiClient.get("/v1/fleet/assignments", listParamsToQuery(params)),
  getSummary: () => apiClient.get("/v1/fleet/summary"),
};

export const trackerRepository: TrackerRepository = {
  getLiveEvents: () => apiClient.get("/v1/tracker/live"),
  getPlaybackEvents: (vehicleId, from, to) =>
    apiClient.get("/v1/tracker/playback", {
      vehicleId,
      from,
      to,
    }),
};

export function tableStateToListParams(
  state: import("@/components/compound/table/types").TableData,
): ListParams {
  return {
    page: state.page ?? 0,
    pageSize: state.rows ?? 15,
    sortField: state.sortField,
    sortOrder:
      state.sortOrder === 1 || state.sortOrder === -1
        ? state.sortOrder
        : undefined,
    filters: state.filters as Record<string, unknown> | undefined,
  };
}
