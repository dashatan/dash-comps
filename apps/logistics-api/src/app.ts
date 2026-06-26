import { Hono } from "hono";
import { cors } from "hono/cors";
import { trackerPlaybackQuerySchema } from "@dash/logistics-contracts";
import { getStore } from "./store";
import { parseListParams } from "./parse-list-params";

const app = new Hono();

app.use(
  "/api/*",
  cors({
    origin: "*",
    allowMethods: ["GET", "OPTIONS"],
  }),
);

app.get("/api/health", (c) => c.json({ status: "ok" }));

app.get("/api/v1/overview/kpis", (c) => {
  return c.json(getStore().getOverviewKpis());
});

app.get("/api/v1/analytics/shipment-volume", (c) => {
  return c.json(getStore().getShipmentVolumeByStatus());
});

app.get("/api/v1/analytics/on-time-trend", (c) => {
  return c.json(getStore().getOnTimeTrendSeries());
});

app.get("/api/v1/analytics/revenue-cost", (c) => {
  return c.json(getStore().getRevenueCostSeries());
});

app.get("/api/v1/analytics/daily-volume", (c) => {
  return c.json(getStore().getDailyShipmentVolume());
});

app.get("/api/v1/analytics/delays-by-hub", (c) => {
  return c.json(getStore().getDelaysByHub());
});

app.get("/api/v1/analytics/regional-share", (c) => {
  return c.json(getStore().getRegionalShipmentShare());
});

app.get("/api/v1/analytics/country-volume", (c) => {
  return c.json(getStore().getCountryShipmentVolume());
});

app.get("/api/v1/analytics/top-routes", (c) => {
  const limit = Number(c.req.query("limit") ?? 6);
  return c.json(getStore().getTopRoutesByVolume(limit));
});

app.get("/api/v1/analytics/recent-trend", (c) => {
  return c.json(getStore().getRecentShipmentTrend());
});

app.get("/api/v1/reports/:slug", (c) => {
  const slug = c.req.param("slug");
  const store = getStore();
  switch (slug) {
    case "delivery-performance":
      return c.json(store.getDeliveryPerformanceReport());
    case "revenue-by-route":
      return c.json(store.getRevenueByRouteReport());
    case "fleet-utilization":
      return c.json(store.getFleetUtilizationReport());
    default:
      return c.json({ error: "Report not found" }, 404);
  }
});

app.get("/api/v1/shipments", (c) => {
  const params = parseListParams(c.req.query());
  return c.json(getStore().listShipments(params));
});

app.get("/api/v1/fleet/vehicles", (c) => {
  const params = parseListParams(c.req.query());
  return c.json(getStore().listVehicles(params));
});

app.get("/api/v1/fleet/drivers", (c) => {
  const params = parseListParams(c.req.query());
  return c.json(getStore().listDrivers(params));
});

app.get("/api/v1/fleet/assignments", (c) => {
  const params = parseListParams(c.req.query());
  return c.json(getStore().listAssignments(params));
});

app.get("/api/v1/fleet/summary", (c) => {
  return c.json(getStore().getFleetSummary());
});

app.get("/api/v1/reference/hubs", (c) => {
  const params = parseListParams(c.req.query());
  return c.json(getStore().listHubs(params));
});

app.get("/api/v1/reference/corridors", (c) => {
  const params = parseListParams(c.req.query());
  return c.json(getStore().listCorridors(params));
});

app.get("/api/v1/customers", (c) => {
  const params = parseListParams(c.req.query());
  return c.json(getStore().listCustomers(params));
});

app.get("/api/v1/customers/contracts", (c) => {
  const params = parseListParams(c.req.query());
  return c.json(getStore().listServiceContracts(params));
});

app.get("/api/v1/finance/invoices", (c) => {
  const params = parseListParams(c.req.query());
  return c.json(getStore().listInvoices(params));
});

app.get("/api/v1/finance/invoices/summary", (c) => {
  return c.json(getStore().getFinanceSummary());
});

app.get("/api/v1/finance/payments", (c) => {
  const params = parseListParams(c.req.query());
  return c.json(getStore().listPayments(params));
});

app.get("/api/v1/warehouses/capacity", (c) => {
  const params = parseListParams(c.req.query());
  return c.json(getStore().listHubCapacities(params));
});

app.get("/api/v1/warehouses/capacity/summary", (c) => {
  return c.json(getStore().getHubCapacitySummary());
});

app.get("/api/v1/routes/plans", (c) => {
  const params = parseListParams(c.req.query());
  return c.json(getStore().listRoutePlans(params));
});

app.get("/api/v1/settings/organisation", (c) => {
  return c.json(getStore().getOrganisationSettings());
});

app.get("/api/v1/settings/integrations", (c) => {
  return c.json(getStore().getIntegrations());
});

app.get("/api/v1/tracker/live", (c) => {
  return c.json(getStore().getLiveTrackerEvents());
});

app.get("/api/v1/tracker/playback", (c) => {
  const parsed = trackerPlaybackQuerySchema.safeParse(c.req.query());
  if (!parsed.success) {
    return c.json({ error: parsed.error.flatten() }, 400);
  }
  const { vehicleId, from, to } = parsed.data;
  return c.json(getStore().getPlaybackTrackerEvents(vehicleId, from, to));
});

export { app };
