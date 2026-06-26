import type {
  AssignmentDto,
  CustomerDto,
  DriverDto,
  EuCorridorDto,
  EuHubDto,
  HubCapacityDto,
  InvoiceDto,
  ListParams,
  Paginated,
  PaymentDto,
  RoutePlanDto,
  ServiceContractDto,
  ShipmentDto,
  VehicleDto,
} from "@dash/logistics-contracts";
import { paginate } from "@dash/logistics-contracts";
import { getDriverDisplayName } from "./fleet";

type NumberRangeFilterValue = [number | undefined, number | undefined];

function asStringArray(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(String);
  if (typeof value === "string") return [value];
  return [];
}

function asNumberRange(value: unknown): NumberRangeFilterValue | undefined {
  if (!Array.isArray(value)) return undefined;
  const [min, max] = value;
  return [
    typeof min === "number" ? min : undefined,
    typeof max === "number" ? max : undefined,
  ];
}

function getFilterString(
  filters: ListParams["filters"],
  key: string,
): string | undefined {
  const value = filters?.[key];
  return typeof value === "string" ? value : undefined;
}

function sortRowsByField<T>(
  rows: T[],
  params: ListParams,
  comparators: Record<string, (a: T, b: T) => number>,
): T[] {
  const { sortField, sortOrder } = params;
  if (!sortField || !sortOrder) return rows;

  const compare = comparators[sortField];
  if (!compare) return rows;

  const dir = sortOrder === 1 ? 1 : -1;
  return [...rows].sort((a, b) => compare(a, b) * dir);
}

function sortRows<T extends { id: number }>(
  rows: T[],
  params: ListParams,
  options?: { nameField?: keyof T & string },
): T[] {
  const { sortField, sortOrder } = params;
  if (!sortField || !sortOrder) return rows;

  const dir = sortOrder === 1 ? 1 : -1;
  return [...rows].sort((a, b) => {
    const aRec = a as Record<string, unknown>;
    const bRec = b as Record<string, unknown>;
    const aVal = aRec[sortField];
    const bVal = bRec[sortField];

    if (
      sortField === options?.nameField &&
      typeof aVal === "string" &&
      typeof bVal === "string"
    ) {
      return aVal.localeCompare(bVal) * dir;
    }
    if (typeof aVal === "number" && typeof bVal === "number") {
      return (aVal - bVal) * dir;
    }
    if (typeof aVal === "string" && typeof bVal === "string") {
      return aVal.localeCompare(bVal) * dir;
    }
    return 0;
  });
}

export function filterShipments(
  rows: ShipmentDto[],
  params: ListParams,
): ShipmentDto[] {
  let result = [...rows];
  const filters = params.filters;

  const tracking = getFilterString(filters, "trackingNumber");
  if (tracking?.trim()) {
    const q = tracking.trim().toLowerCase();
    result = result.filter((r) => r.trackingNumber.toLowerCase().includes(q));
  }

  const status = getFilterString(filters, "status");
  if (status) {
    result = result.filter((r) => r.status === status);
  }

  const regions = asStringArray(filters?.region);
  if (regions.length) {
    result = result.filter((r) => regions.includes(r.region));
  }

  const country = getFilterString(filters, "countryCode");
  if (country) {
    result = result.filter((r) => r.countryCode === country);
  }

  const corridor = getFilterString(filters, "corridorId");
  if (corridor) {
    result = result.filter((r) => r.corridorId === corridor);
  }

  const revenueRange = asNumberRange(filters?.revenueEur);
  if (revenueRange) {
    const [min, max] = revenueRange;
    if (min !== undefined) result = result.filter((r) => r.revenueEur >= min);
    if (max !== undefined) result = result.filter((r) => r.revenueEur <= max);
  }

  const scheduledAfter = filters?.scheduledAt;
  if (scheduledAfter !== undefined) {
    const ts = Array.isArray(scheduledAfter)
      ? scheduledAfter[0]
      : scheduledAfter;
    if (typeof ts === "number") {
      result = result.filter((r) => r.scheduledAt >= ts);
    }
  }

  const { sortField, sortOrder } = params;
  if (sortField && sortOrder) {
    const dir = sortOrder === 1 ? 1 : -1;
    result.sort((a, b) => {
      switch (sortField) {
        case "id":
          return (a.id - b.id) * dir;
        case "trackingNumber":
          return a.trackingNumber.localeCompare(b.trackingNumber) * dir;
        case "status":
          return a.status.localeCompare(b.status) * dir;
        case "originCity":
          return a.originCity.localeCompare(b.originCity) * dir;
        case "destinationCity":
          return a.destinationCity.localeCompare(b.destinationCity) * dir;
        case "weightKg":
          return (a.weightKg - b.weightKg) * dir;
        case "revenueEur":
          return (a.revenueEur - b.revenueEur) * dir;
        case "costEur":
          return (a.costEur - b.costEur) * dir;
        case "scheduledAt":
          return (a.scheduledAt - b.scheduledAt) * dir;
        default:
          return 0;
      }
    });
  }

  return result;
}

export function filterVehicles(
  rows: VehicleDto[],
  params: ListParams,
): VehicleDto[] {
  let result = [...rows];
  const filters = params.filters;

  const plate = getFilterString(filters, "plate");
  if (plate?.trim()) {
    const q = plate.trim().toLowerCase();
    result = result.filter((r) => r.plate.toLowerCase().includes(q));
  }

  const status = getFilterString(filters, "status");
  if (status) result = result.filter((r) => r.status === status);

  const type = getFilterString(filters, "type");
  if (type) result = result.filter((r) => r.type === type);

  const regions = asStringArray(filters?.region);
  if (regions.length) result = result.filter((r) => regions.includes(r.region));

  const country = getFilterString(filters, "countryCode");
  if (country) result = result.filter((r) => r.countryCode === country);

  return sortRows(result, params);
}

export function filterDrivers(
  rows: DriverDto[],
  params: ListParams,
): DriverDto[] {
  let result = [...rows];
  const filters = params.filters;

  const name = getFilterString(filters, "name");
  if (name?.trim()) {
    const q = name.trim().toLowerCase();
    result = result.filter((r) =>
      getDriverDisplayName(r).toLowerCase().includes(q),
    );
  }

  const country = getFilterString(filters, "licenseCountry");
  if (country) result = result.filter((r) => r.licenseCountry === country);

  return sortRows(result, params, { nameField: "firstName" });
}

export function filterAssignments(
  rows: AssignmentDto[],
  params: ListParams,
): AssignmentDto[] {
  let result = [...rows];
  const filters = params.filters;

  const status = getFilterString(filters, "status");
  if (status) result = result.filter((r) => r.status === status);

  const regions = asStringArray(filters?.region);
  if (regions.length) result = result.filter((r) => regions.includes(r.region));

  const corridor = getFilterString(filters, "corridorLabel");
  if (corridor?.trim()) {
    const q = corridor.trim().toLowerCase();
    result = result.filter((r) => r.corridorLabel.toLowerCase().includes(q));
  }

  return sortRows(result, params);
}

export function listShipments(
  rows: ShipmentDto[],
  params: ListParams,
): Paginated<ShipmentDto> {
  return paginate(filterShipments(rows, params), params);
}

export function listVehicles(
  rows: VehicleDto[],
  params: ListParams,
): Paginated<VehicleDto> {
  return paginate(filterVehicles(rows, params), params);
}

export function listDrivers(
  rows: DriverDto[],
  params: ListParams,
): Paginated<DriverDto> {
  return paginate(filterDrivers(rows, params), params);
}

export function listAssignments(
  rows: AssignmentDto[],
  params: ListParams,
): Paginated<AssignmentDto> {
  return paginate(filterAssignments(rows, params), params);
}

export function filterHubs(rows: EuHubDto[], params: ListParams): EuHubDto[] {
  let result = [...rows];
  const filters = params.filters;

  const city = getFilterString(filters, "city");
  if (city?.trim()) {
    const q = city.trim().toLowerCase();
    result = result.filter((row) => row.city.toLowerCase().includes(q));
  }

  const country = getFilterString(filters, "countryCode");
  if (country) result = result.filter((row) => row.countryCode === country);

  const regions = asStringArray(filters?.region);
  if (regions.length)
    result = result.filter((row) => regions.includes(row.region));

  return sortRowsByField(result, params, {
    city: (a, b) => a.city.localeCompare(b.city),
    countryCode: (a, b) => a.countryCode.localeCompare(b.countryCode),
    region: (a, b) => a.region.localeCompare(b.region),
    id: (a, b) => a.id.localeCompare(b.id),
  });
}

export function filterCorridors(
  rows: EuCorridorDto[],
  params: ListParams,
): EuCorridorDto[] {
  let result = [...rows];
  const label = getFilterString(params.filters, "label");
  if (label?.trim()) {
    const q = label.trim().toLowerCase();
    result = result.filter((row) => row.label.toLowerCase().includes(q));
  }

  return sortRowsByField(result, params, {
    label: (a, b) => a.label.localeCompare(b.label),
    distanceKm: (a, b) => a.distanceKm - b.distanceKm,
    id: (a, b) => a.id.localeCompare(b.id),
  });
}

export function filterCustomers(
  rows: CustomerDto[],
  params: ListParams,
): CustomerDto[] {
  let result = [...rows];
  const filters = params.filters;

  const name = getFilterString(filters, "name");
  if (name?.trim()) {
    const q = name.trim().toLowerCase();
    result = result.filter(
      (row) =>
        row.name.toLowerCase().includes(q) ||
        `${row.name} ${row.suffix}`.toLowerCase().includes(q),
    );
  }

  const tier = getFilterString(filters, "accountTier");
  if (tier) result = result.filter((row) => row.accountTier === tier);

  const country = getFilterString(filters, "countryCode");
  if (country) result = result.filter((row) => row.countryCode === country);

  const regions = asStringArray(filters?.region);
  if (regions.length)
    result = result.filter((row) => regions.includes(row.region));

  return sortRows(result, params, { nameField: "name" });
}

export function filterInvoices(
  rows: InvoiceDto[],
  params: ListParams,
): InvoiceDto[] {
  let result = [...rows];
  const filters = params.filters;

  const status = getFilterString(filters, "status");
  if (status) result = result.filter((row) => row.status === status);

  const customer = getFilterString(filters, "customerName");
  if (customer?.trim()) {
    const q = customer.trim().toLowerCase();
    result = result.filter((row) => row.customerName.toLowerCase().includes(q));
  }

  return sortRows(result, params);
}

export function filterPayments(
  rows: PaymentDto[],
  params: ListParams,
): PaymentDto[] {
  let result = [...rows];
  const filters = params.filters;

  const method = getFilterString(filters, "method");
  if (method) result = result.filter((row) => row.method === method);

  const customer = getFilterString(filters, "customerName");
  if (customer?.trim()) {
    const q = customer.trim().toLowerCase();
    result = result.filter((row) => row.customerName.toLowerCase().includes(q));
  }

  return sortRows(result, params);
}

export function filterServiceContracts(
  rows: ServiceContractDto[],
  params: ListParams,
): ServiceContractDto[] {
  let result = [...rows];
  const filters = params.filters;

  const tier = getFilterString(filters, "tier");
  if (tier) result = result.filter((row) => row.tier === tier);

  const customer = getFilterString(filters, "customerName");
  if (customer?.trim()) {
    const q = customer.trim().toLowerCase();
    result = result.filter((row) => row.customerName.toLowerCase().includes(q));
  }

  return sortRows(result, params);
}

export function filterHubCapacities(
  rows: HubCapacityDto[],
  params: ListParams,
): HubCapacityDto[] {
  let result = [...rows];
  const city = getFilterString(params.filters, "city");
  if (city?.trim()) {
    const q = city.trim().toLowerCase();
    result = result.filter((row) => row.city.toLowerCase().includes(q));
  }

  return sortRowsByField(result, params, {
    city: (a, b) => a.city.localeCompare(b.city),
    storageSlots: (a, b) => a.storageSlots - b.storageSlots,
    usedSlots: (a, b) => a.usedSlots - b.usedSlots,
    throughputPerDay: (a, b) => a.throughputPerDay - b.throughputPerDay,
  });
}

export function filterRoutePlans(
  rows: RoutePlanDto[],
  params: ListParams,
): RoutePlanDto[] {
  let result = [...rows];
  const filters = params.filters;

  const status = getFilterString(filters, "status");
  if (status) result = result.filter((row) => row.status === status);

  const corridor = getFilterString(filters, "corridorLabel");
  if (corridor?.trim()) {
    const q = corridor.trim().toLowerCase();
    result = result.filter((row) =>
      row.corridorLabel.toLowerCase().includes(q),
    );
  }

  return sortRows(result, params);
}

export function listHubs(
  rows: EuHubDto[],
  params: ListParams,
): Paginated<EuHubDto> {
  return paginate(filterHubs(rows, params), params);
}

export function listCorridors(
  rows: EuCorridorDto[],
  params: ListParams,
): Paginated<EuCorridorDto> {
  return paginate(filterCorridors(rows, params), params);
}

export function listCustomers(
  rows: CustomerDto[],
  params: ListParams,
): Paginated<CustomerDto> {
  return paginate(filterCustomers(rows, params), params);
}

export function listInvoices(
  rows: InvoiceDto[],
  params: ListParams,
): Paginated<InvoiceDto> {
  return paginate(filterInvoices(rows, params), params);
}

export function listPayments(
  rows: PaymentDto[],
  params: ListParams,
): Paginated<PaymentDto> {
  return paginate(filterPayments(rows, params), params);
}

export function listServiceContracts(
  rows: ServiceContractDto[],
  params: ListParams,
): Paginated<ServiceContractDto> {
  return paginate(filterServiceContracts(rows, params), params);
}

export function listHubCapacities(
  rows: HubCapacityDto[],
  params: ListParams,
): Paginated<HubCapacityDto> {
  return paginate(filterHubCapacities(rows, params), params);
}

export function listRoutePlans(
  rows: RoutePlanDto[],
  params: ListParams,
): Paginated<RoutePlanDto> {
  return paginate(filterRoutePlans(rows, params), params);
}
