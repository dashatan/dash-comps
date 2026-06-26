import type {
  AssignmentDto,
  DeliveryPerformanceReportDto,
  DriverDto,
  DualSeriesDto,
  EuCorridorDto,
  EuHubDto,
  FleetSummaryDto,
  FleetUtilizationReportDto,
  ListParams,
  NamedValueDto,
  OverviewKpisDto,
  Paginated,
  RevenueByRouteReportDto,
  RevenueRouteDto,
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
  listDrivers,
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
  readonly shipments: ShipmentDto[];
  readonly vehicles: VehicleDto[];
  readonly drivers: DriverDto[];
  readonly assignments: AssignmentDto[];

  constructor() {
    this.customers = buildCustomers();
    this.shipments = buildShipments();
    this.vehicles = buildVehicles();
    this.drivers = buildDrivers();
    this.assignments = buildAssignments();
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
