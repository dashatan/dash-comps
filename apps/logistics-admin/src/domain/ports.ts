import type { ListParams, Paginated } from "@dash/logistics-contracts";
import type {
  AssignmentDto,
  CustomerDto,
  DeliveryPerformanceReportDto,
  DriverDto,
  DualSeriesDto,
  EuCorridorDto,
  EuHubDto,
  FinanceSummaryDto,
  FleetSummaryDto,
  FleetUtilizationReportDto,
  HubCapacityDto,
  HubCapacitySummaryDto,
  IntegrationDto,
  InvoiceDto,
  NamedValueDto,
  OrganisationSettingsDto,
  OverviewKpisDto,
  PaymentDto,
  RevenueByRouteReportDto,
  RoutePlanDto,
  ServiceContractDto,
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
  getCountryVolume(): Promise<NamedValueDto[]>;
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

export interface ReferenceRepository {
  listHubs(params: ListParams): Promise<Paginated<EuHubDto>>;
  listCorridors(params: ListParams): Promise<Paginated<EuCorridorDto>>;
}

export interface CustomersRepository {
  list(params: ListParams): Promise<Paginated<CustomerDto>>;
  listContracts(params: ListParams): Promise<Paginated<ServiceContractDto>>;
}

export interface FinanceRepository {
  listInvoices(params: ListParams): Promise<Paginated<InvoiceDto>>;
  listPayments(params: ListParams): Promise<Paginated<PaymentDto>>;
  getSummary(): Promise<FinanceSummaryDto>;
}

export interface WarehousesRepository {
  listCapacity(params: ListParams): Promise<Paginated<HubCapacityDto>>;
  getCapacitySummary(): Promise<HubCapacitySummaryDto>;
}

export interface RoutesRepository {
  listPlans(params: ListParams): Promise<Paginated<RoutePlanDto>>;
}

export interface SettingsRepository {
  getOrganisation(): Promise<OrganisationSettingsDto>;
  getIntegrations(): Promise<IntegrationDto[]>;
}

export interface TrackerRepository {
  getLiveEvents(): Promise<TrackerEventDto[]>;
  getPlaybackEvents(
    vehicleId: number,
    from?: number,
    to?: number,
  ): Promise<TrackerEventDto[]>;
}
