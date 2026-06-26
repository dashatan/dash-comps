import { z } from "zod";

export const overviewKpisSchema = z.object({
  activeShipments: z.number().int(),
  onTimePercent: z.number(),
  avgDeliveryHours: z.number(),
  delayedCount: z.number().int(),
  fleetUtilizationPercent: z.number(),
  revenueMtdEur: z.number(),
  costMtdEur: z.number(),
  marginPercent: z.number(),
});

export const namedValueSchema = z.object({
  name: z.string(),
  value: z.number(),
});

export const dualSeriesSchema = z.object({
  labels: z.array(z.string()),
  primary: z.array(z.number()),
  secondary: z.array(z.number()),
});

export const revenueRouteSchema = z.object({
  name: z.string(),
  revenue: z.number(),
  cost: z.number(),
});

export type OverviewKpisDto = z.infer<typeof overviewKpisSchema>;
export type NamedValueDto = z.infer<typeof namedValueSchema>;
export type DualSeriesDto = z.infer<typeof dualSeriesSchema>;
export type RevenueRouteDto = z.infer<typeof revenueRouteSchema>;

export const deliveryPerformanceReportSchema = z.object({
  onTimeTrend: z.object({
    labels: z.array(z.string()),
    values: z.array(z.number()),
  }),
  byHub: dualSeriesSchema,
  summary: z.object({
    avgOnTimePercent: z.number(),
    avgDeliveryHours: z.number(),
    delayedShipments: z.number().int(),
    hubsMonitored: z.number().int(),
  }),
});

export const revenueByRouteReportSchema = z.object({
  topRoutes: z.array(revenueRouteSchema),
  monthlyTrend: dualSeriesSchema,
  summary: z.object({
    totalRevenueEur: z.number(),
    totalCostEur: z.number(),
    topRoute: z.string(),
    routeCount: z.number().int(),
  }),
});

export const fleetUtilizationReportSchema = z.object({
  byRegion: z.array(namedValueSchema),
  weeklyUtilization: z.array(z.number()),
  summary: z.object({
    fleetSize: z.number().int(),
    activeVehicles: z.number().int(),
    avgUtilizationPercent: z.number(),
    maintenanceCount: z.number().int(),
  }),
});

export type DeliveryPerformanceReportDto = z.infer<
  typeof deliveryPerformanceReportSchema
>;
export type RevenueByRouteReportDto = z.infer<
  typeof revenueByRouteReportSchema
>;
export type FleetUtilizationReportDto = z.infer<
  typeof fleetUtilizationReportSchema
>;
