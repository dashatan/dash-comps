import type { ListParams } from "@dash/logistics-contracts";

export const queryKeys = {
  overview: {
    kpis: ["overview", "kpis"] as const,
  },
  analytics: {
    shipmentVolume: ["analytics", "shipment-volume"] as const,
    onTimeTrend: ["analytics", "on-time-trend"] as const,
    revenueCost: ["analytics", "revenue-cost"] as const,
    dailyVolume: ["analytics", "daily-volume"] as const,
    delaysByHub: ["analytics", "delays-by-hub"] as const,
    regionalShare: ["analytics", "regional-share"] as const,
    countryVolume: ["analytics", "country-volume"] as const,
    topRoutes: (limit: number) => ["analytics", "top-routes", limit] as const,
    recentTrend: ["analytics", "recent-trend"] as const,
  },
  reports: {
    bySlug: (slug: string) => ["reports", slug] as const,
  },
  shipments: {
    list: (params: ListParams) => ["shipments", "list", params] as const,
  },
  fleet: {
    vehicles: (params: ListParams) => ["fleet", "vehicles", params] as const,
    drivers: (params: ListParams) => ["fleet", "drivers", params] as const,
    assignments: (params: ListParams) =>
      ["fleet", "assignments", params] as const,
    summary: ["fleet", "summary"] as const,
  },
  reference: {
    hubs: (params: ListParams) => ["reference", "hubs", params] as const,
    corridors: (params: ListParams) =>
      ["reference", "corridors", params] as const,
  },
  customers: {
    list: (params: ListParams) => ["customers", "list", params] as const,
    contracts: (params: ListParams) =>
      ["customers", "contracts", params] as const,
  },
  finance: {
    invoices: (params: ListParams) => ["finance", "invoices", params] as const,
    payments: (params: ListParams) => ["finance", "payments", params] as const,
    summary: ["finance", "summary"] as const,
  },
  warehouses: {
    capacity: (params: ListParams) =>
      ["warehouses", "capacity", params] as const,
    capacitySummary: ["warehouses", "capacity-summary"] as const,
  },
  routes: {
    plans: (params: ListParams) => ["routes", "plans", params] as const,
  },
  settings: {
    organisation: ["settings", "organisation"] as const,
    integrations: ["settings", "integrations"] as const,
  },
  tracker: {
    live: ["tracker", "live"] as const,
    playback: (vehicleId: number, from?: number, to?: number) =>
      ["tracker", "playback", vehicleId, from, to] as const,
  },
} as const;
