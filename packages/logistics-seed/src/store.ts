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
  ListParams,
  NamedValueDto,
  OrganisationSettingsDto,
  OverviewKpisDto,
  Paginated,
  PaymentDto,
  RevenueByRouteReportDto,
  RevenueRouteDto,
  RoutePlanDto,
  ServiceContractDto,
  ShipmentDto,
  TrackerEventDto,
  VehicleDto,
} from "@dash/logistics-contracts";
import {
  getDeliveryPerformanceByHub,
  getDelaysByHub,
  getDailyShipmentVolume,
  getFleetUtilizationByRegion,
  getOnTimeTrendSeries,
  getOverviewKpis,
  getRecentShipmentTrend,
  getRegionalShipmentShare,
  getCountryShipmentVolume,
  getRevenueByRouteTopN,
  getRevenueCostSeries,
  getShipmentVolumeByStatus,
  getTopRoutesByVolume,
} from "./analytics";
import { buildCustomers, type Customer } from "./customers";
import { buildServiceContracts } from "./contracts";
import {
  buildHubCapacities,
  getHubCapacitySummary,
} from "./warehouse-capacity";
import {
  buildInvoices,
  buildPayments,
  getFinanceSummary,
  toCustomerDto,
} from "./finance";
import { buildRoutePlans } from "./routes-planning";
import { buildIntegrations, buildOrganisationSettings } from "./settings";
import {
  EU_CORRIDORS,
  EU_HUBS,
  type EuCorridor,
  type EuHub,
} from "./european-context";
import { ASSIGNMENT_COUNT, DRIVER_COUNT, VEHICLE_COUNT } from "./entity-counts";
import {
  buildAssignments,
  buildDrivers,
  buildVehicles,
  getActiveAssignmentsCount,
  getDriversOnDutyCount,
  getFleetUtilizationPercent,
} from "./fleet";
import {
  listAssignments,
  listCorridors,
  listCustomers,
  listDrivers,
  listHubCapacities,
  listHubs,
  listInvoices,
  listPayments,
  listRoutePlans,
  listServiceContracts,
  listShipments,
  listVehicles,
} from "./list-utils";
import {
  getDeliveryPerformanceReport,
  getFleetUtilizationReport,
  getRevenueByRouteReport,
} from "./reports";
import { buildShipments } from "./shipments";
import { getLiveTrackerEvents, getPlaybackTrackerEvents } from "./tracker";

export class LogisticsDataStore {
  readonly customers: Customer[];
  readonly customerDtos: CustomerDto[];
  readonly shipments: ShipmentDto[];
  readonly vehicles: VehicleDto[];
  readonly drivers: DriverDto[];
  readonly assignments: AssignmentDto[];
  readonly invoices: InvoiceDto[];
  readonly payments: PaymentDto[];
  readonly serviceContracts: ServiceContractDto[];
  readonly hubCapacities: HubCapacityDto[];
  readonly routePlans: RoutePlanDto[];
  readonly organisationSettings: OrganisationSettingsDto;
  readonly integrations: IntegrationDto[];

  constructor() {
    this.customers = buildCustomers();
    this.shipments = buildShipments();
    this.vehicles = buildVehicles();
    this.drivers = buildDrivers();
    this.assignments = buildAssignments();
    this.customerDtos = this.customers.map((customer) =>
      toCustomerDto(
        customer,
        this.shipments.filter((shipment) => shipment.customerId === customer.id)
          .length,
      ),
    );
    this.invoices = buildInvoices(this.shipments, this.customers);
    this.payments = buildPayments(this.invoices);
    this.serviceContracts = buildServiceContracts(this.customers);
    this.hubCapacities = buildHubCapacities();
    this.routePlans = buildRoutePlans(this.assignments);
    this.organisationSettings = buildOrganisationSettings();
    this.integrations = buildIntegrations();
  }

  listShipments(params: ListParams): Paginated<ShipmentDto> {
    return listShipments(this.shipments, params);
  }

  listVehicles(params: ListParams): Paginated<VehicleDto> {
    return listVehicles(this.vehicles, params);
  }

  listDrivers(params: ListParams): Paginated<DriverDto> {
    return listDrivers(this.drivers, params);
  }

  listAssignments(params: ListParams): Paginated<AssignmentDto> {
    return listAssignments(this.assignments, params);
  }

  listHubs(params: ListParams): Paginated<EuHubDto> {
    return listHubs(
      EU_HUBS.map((hub) => ({ ...hub })),
      params,
    );
  }

  listCorridors(params: ListParams): Paginated<EuCorridorDto> {
    return listCorridors(
      EU_CORRIDORS.map((corridor) => ({ ...corridor })),
      params,
    );
  }

  listCustomers(params: ListParams): Paginated<CustomerDto> {
    return listCustomers(this.customerDtos, params);
  }

  listInvoices(params: ListParams): Paginated<InvoiceDto> {
    return listInvoices(this.invoices, params);
  }

  listPayments(params: ListParams): Paginated<PaymentDto> {
    return listPayments(this.payments, params);
  }

  listServiceContracts(params: ListParams): Paginated<ServiceContractDto> {
    return listServiceContracts(this.serviceContracts, params);
  }

  listHubCapacities(params: ListParams): Paginated<HubCapacityDto> {
    return listHubCapacities(this.hubCapacities, params);
  }

  listRoutePlans(params: ListParams): Paginated<RoutePlanDto> {
    return listRoutePlans(this.routePlans, params);
  }

  getFinanceSummary(): FinanceSummaryDto {
    return getFinanceSummary(this.invoices);
  }

  getHubCapacitySummary(): HubCapacitySummaryDto {
    return getHubCapacitySummary(this.hubCapacities);
  }

  getOrganisationSettings(): OrganisationSettingsDto {
    return { ...this.organisationSettings };
  }

  getIntegrations(): IntegrationDto[] {
    return this.integrations.map((integration) => ({ ...integration }));
  }

  getOverviewKpis(): OverviewKpisDto {
    return getOverviewKpis(this.shipments, this.vehicles);
  }

  getShipmentVolumeByStatus(): NamedValueDto[] {
    return getShipmentVolumeByStatus(this.shipments);
  }

  getOnTimeTrendSeries(): readonly number[] {
    return getOnTimeTrendSeries();
  }

  getRevenueCostSeries(): DualSeriesDto {
    return getRevenueCostSeries();
  }

  getDailyShipmentVolume(): readonly number[] {
    return getDailyShipmentVolume();
  }

  getDelaysByHub(): NamedValueDto[] {
    return getDelaysByHub();
  }

  getRegionalShipmentShare(): NamedValueDto[] {
    return getRegionalShipmentShare();
  }

  getCountryShipmentVolume(): NamedValueDto[] {
    return getCountryShipmentVolume(this.shipments);
  }

  getTopRoutesByVolume(limit = 6): NamedValueDto[] {
    return getTopRoutesByVolume(this.shipments, limit);
  }

  getDeliveryPerformanceByHub(): DualSeriesDto {
    return getDeliveryPerformanceByHub();
  }

  getRevenueByRouteTopN(n = 8): RevenueRouteDto[] {
    return getRevenueByRouteTopN(this.shipments, n);
  }

  getFleetUtilizationByRegion(): NamedValueDto[] {
    return getFleetUtilizationByRegion();
  }

  getRecentShipmentTrend(): readonly number[] {
    return getRecentShipmentTrend();
  }

  getDeliveryPerformanceReport(): DeliveryPerformanceReportDto {
    return getDeliveryPerformanceReport();
  }

  getRevenueByRouteReport(): RevenueByRouteReportDto {
    return getRevenueByRouteReport(this.shipments);
  }

  getFleetUtilizationReport(): FleetUtilizationReportDto {
    return getFleetUtilizationReport();
  }

  getFleetSummary(): FleetSummaryDto {
    const activeVehicles = this.vehicles.filter(
      (v) => v.status === "active",
    ).length;
    const maintenanceCount = this.vehicles.filter(
      (v) => v.status === "maintenance",
    ).length;

    return {
      vehicleCount: VEHICLE_COUNT,
      driverCount: DRIVER_COUNT,
      assignmentCount: ASSIGNMENT_COUNT,
      utilizationPercent: getFleetUtilizationPercent(this.vehicles),
      activeAssignments: getActiveAssignmentsCount(this.assignments),
      driversOnDuty: getDriversOnDutyCount(this.assignments),
      activeVehicles,
      maintenanceCount,
    };
  }

  getHubs(): EuHubDto[] {
    return EU_HUBS.map((hub) => ({ ...hub }));
  }

  getCorridors(): EuCorridorDto[] {
    return EU_CORRIDORS.map((corridor) => ({ ...corridor }));
  }

  getLiveTrackerEvents(): TrackerEventDto[] {
    return getLiveTrackerEvents(this.vehicles);
  }

  getPlaybackTrackerEvents(
    vehicleId: number,
    from?: number,
    to?: number,
  ): TrackerEventDto[] {
    return getPlaybackTrackerEvents(this.vehicles, vehicleId, from, to);
  }
}

export function createLogisticsDataStore(): LogisticsDataStore {
  return new LogisticsDataStore();
}

export type { EuCorridor, EuHub };
