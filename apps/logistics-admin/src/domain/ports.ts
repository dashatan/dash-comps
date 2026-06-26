import type { ListParams, Paginated } from "@dash/logistics-contracts";
import type {
  AssignmentDto,
  DeliveryPerformanceReportDto,
  DriverDto,
  DualSeriesDto,
  FleetSummaryDto,
  FleetUtilizationReportDto,
  NamedValueDto,
  OverviewKpisDto,
  RevenueByRouteReportDto,
  ShipmentDto,
  TrackerEventDto,
  VehicleDto,
} from "@dash/logistics-contracts";

export interface OverviewRepository {
  getKpis(): Promise<OverviewKpisDto>;
}

export interface AnalyticsRepository {
  getShipmentVolume(): Promise<NamedValueDto[]>;
  getOnTimeTrend(): Promise<number[]>;
  getRevenueCost(): Promise<DualSeriesDto>;
  getDailyVolume(): Promise<number[]>;
  getDelaysByHub(): Promise<NamedValueDto[]>;
  getRegionalShare(): Promise<NamedValueDto[]>;
  getTopRoutes(limit?: number): Promise<NamedValueDto[]>;
  getRecentTrend(): Promise<number[]>;
}

export interface ReportsRepository {
  getDeliveryPerformance(): Promise<DeliveryPerformanceReportDto>;
  getRevenueByRoute(): Promise<RevenueByRouteReportDto>;
  getFleetUtilization(): Promise<FleetUtilizationReportDto>;
}

export interface ShipmentsRepository {
  list(params: ListParams): Promise<Paginated<ShipmentDto>>;
}

export interface FleetRepository {
  listVehicles(params: ListParams): Promise<Paginated<VehicleDto>>;
  listDrivers(params: ListParams): Promise<Paginated<DriverDto>>;
  listAssignments(params: ListParams): Promise<Paginated<AssignmentDto>>;
  getSummary(): Promise<FleetSummaryDto>;
}

export interface TrackerRepository {
  getLiveEvents(): Promise<TrackerEventDto[]>;
  getPlaybackEvents(
    vehicleId: number,
    from?: number,
    to?: number,
  ): Promise<TrackerEventDto[]>;
}
