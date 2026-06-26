import type { ShipmentDto } from "@dash/logistics-contracts";
import {
  EU_CORRIDORS,
  SHIPMENT_STATUSES,
  daysAgo,
  getCorridorById,
  getHubById,
} from "./european-context";
import {
  CUSTOMER_COUNT,
  DRIVER_COUNT,
  SHIPMENT_COUNT,
  VEHICLE_COUNT,
} from "./entity-counts";

export { SHIPMENT_COUNT } from "./entity-counts";

function buildShipment(id: number): ShipmentDto {
  const corridor = EU_CORRIDORS[id % EU_CORRIDORS.length];
  const origin = getHubById(corridor.originHubId);
  const destination = getHubById(corridor.destinationHubId);
  const status = SHIPMENT_STATUSES[id % SHIPMENT_STATUSES.length];
  const crossBorder = origin.countryCode !== destination.countryCode;
  const weightKg = 120 + (id % 180) * 25;
  const distanceKm = corridor.distanceKm + (id % 40);
  const costEur = Math.round(180 + distanceKm * 0.85 + weightKg * 0.12);
  const revenueEur = Math.round(costEur * (1.12 + (id % 8) * 0.02));
  const scheduledAt = daysAgo(45 - (id % 45));
  const isDelivered = status === "delivered";
  const isDelayed = status === "delayed";
  const deliveredAt =
    isDelivered || isDelayed
      ? scheduledAt + (isDelayed ? 36 : 22) * 3_600_000
      : status === "in_transit"
        ? null
        : status === "pending"
          ? null
          : null;
  const onTime = isDelivered
    ? id % 9 !== 0
    : isDelayed
      ? false
      : status === "cancelled"
        ? false
        : true;

  return {
    id,
    trackingNumber: `EU-${2026}-${String(id).padStart(6, "0")}`,
    status,
    corridorId: corridor.id,
    originHubId: origin.id,
    destinationHubId: destination.id,
    originCity: origin.city,
    destinationCity: destination.city,
    countryCode: origin.countryCode,
    region: origin.region,
    customerId: 1 + (id % CUSTOMER_COUNT),
    vehicleId: 1 + (id % VEHICLE_COUNT),
    driverId: 1 + (id % DRIVER_COUNT),
    weightKg,
    costEur,
    revenueEur,
    distanceKm,
    crossBorder,
    scheduledAt,
    deliveredAt,
    onTime,
  };
}

export function buildShipments(): ShipmentDto[] {
  return Array.from({ length: SHIPMENT_COUNT }, (_, i) => buildShipment(i + 1));
}

export function getActiveShipments(shipments: ShipmentDto[]): ShipmentDto[] {
  return shipments.filter(
    (s) => s.status === "in_transit" || s.status === "pending",
  );
}

export function getDelayedShipments(shipments: ShipmentDto[]): ShipmentDto[] {
  return shipments.filter((s) => s.status === "delayed");
}

export function getShipmentsInDateRange(
  shipments: ShipmentDto[],
  startMs: number,
  endMs: number,
): ShipmentDto[] {
  return shipments.filter(
    (s) => s.scheduledAt >= startMs && s.scheduledAt <= endMs,
  );
}

export function getMonthToDateRange(): { start: number; end: number } {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
  return { start, end: Date.now() };
}

export { EU_CORRIDORS, getCorridorById };
