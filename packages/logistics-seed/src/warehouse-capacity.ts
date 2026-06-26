import type {
  HubCapacityDto,
  HubCapacitySummaryDto,
} from "@dash/logistics-contracts";
import { EU_HUBS } from "./european-context";

export function buildHubCapacities(): HubCapacityDto[] {
  return EU_HUBS.map((hub, index) => {
    const storageSlots = 120 + (index % 5) * 40;
    const usedSlots = Math.round(storageSlots * (0.55 + (index % 4) * 0.1));

    return {
      hubId: hub.id,
      city: hub.city,
      storageSlots,
      usedSlots,
      throughputPerDay: 80 + (index % 6) * 25,
    };
  });
}

export function getHubCapacitySummary(
  capacities: HubCapacityDto[],
): HubCapacitySummaryDto {
  const totalSlots = capacities.reduce((sum, row) => sum + row.storageSlots, 0);
  const usedSlots = capacities.reduce((sum, row) => sum + row.usedSlots, 0);

  return {
    totalSlots,
    usedSlots,
    avgUtilizationPercent:
      totalSlots > 0 ? Math.round((usedSlots / totalSlots) * 1000) / 10 : 0,
    hubCount: capacities.length,
  };
}

export function getHubUtilizationPercent(capacity: HubCapacityDto): number {
  if (capacity.storageSlots <= 0) {
    return 0;
  }
  return Math.round((capacity.usedSlots / capacity.storageSlots) * 1000) / 10;
}
