import { apiClient, listParamsToQuery } from "@/core/api-client";
import type {
  AnalyticsRepository,
  CustomersRepository,
  FinanceRepository,
  FleetRepository,
  OverviewRepository,
  ReferenceRepository,
  ReportsRepository,
  RoutesRepository,
  SettingsRepository,
  ShipmentsRepository,
  TrackerRepository,
  WarehousesRepository,
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
  getCountryVolume: () => apiClient.get("/v1/analytics/country-volume"),
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

export const referenceRepository: ReferenceRepository = {
  listHubs: (params) =>
    apiClient.get("/v1/reference/hubs", listParamsToQuery(params)),
  listCorridors: (params) =>
    apiClient.get("/v1/reference/corridors", listParamsToQuery(params)),
};

export const customersRepository: CustomersRepository = {
  list: (params) => apiClient.get("/v1/customers", listParamsToQuery(params)),
  listContracts: (params) =>
    apiClient.get("/v1/customers/contracts", listParamsToQuery(params)),
};

export const financeRepository: FinanceRepository = {
  listInvoices: (params) =>
    apiClient.get("/v1/finance/invoices", listParamsToQuery(params)),
  listPayments: (params) =>
    apiClient.get("/v1/finance/payments", listParamsToQuery(params)),
  getSummary: () => apiClient.get("/v1/finance/invoices/summary"),
};

export const warehousesRepository: WarehousesRepository = {
  listCapacity: (params) =>
    apiClient.get("/v1/warehouses/capacity", listParamsToQuery(params)),
  getCapacitySummary: () => apiClient.get("/v1/warehouses/capacity/summary"),
};

export const routesRepository: RoutesRepository = {
  listPlans: (params) =>
    apiClient.get("/v1/routes/plans", listParamsToQuery(params)),
};

export const settingsRepository: SettingsRepository = {
  getOrganisation: () => apiClient.get("/v1/settings/organisation"),
  getIntegrations: () => apiClient.get("/v1/settings/integrations"),
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
