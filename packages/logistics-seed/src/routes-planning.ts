import type { AssignmentDto, RoutePlanDto } from "@dash/logistics-contracts";
import { daysFromNow, EU_CORRIDORS } from "./european-context";

const PLAN_STATUSES = [
  "scheduled",
  "in_progress",
  "completed",
  "cancelled",
] as const;

function getCorridorIdForLabel(label: string): string {
  return (
    EU_CORRIDORS.find((corridor) => corridor.label === label)?.id ??
    EU_CORRIDORS[0].id
  );
}

export function buildRoutePlans(assignments: AssignmentDto[]): RoutePlanDto[] {
  return assignments.map((assignment, index) => ({
    id: index + 1,
    corridorId: getCorridorIdForLabel(assignment.corridorLabel),
    corridorLabel: assignment.corridorLabel,
    vehicleId: assignment.vehicleId,
    driverId: assignment.driverId,
    departureWindow: daysFromNow(index % 14) + (index % 8) * 3600000,
    status: PLAN_STATUSES[index % PLAN_STATUSES.length],
  }));
}
