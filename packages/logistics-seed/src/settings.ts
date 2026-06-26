import type {
  IntegrationDto,
  OrganisationSettingsDto,
} from "@dash/logistics-contracts";
import { daysAgo, EU_HUBS } from "./european-context";

export function buildOrganisationSettings(): OrganisationSettingsDto {
  return {
    companyName: "Continental Logistics EU",
    defaultCurrency: "EUR",
    defaultRegion: "western_europe",
    depotHubIds: EU_HUBS.slice(0, 5).map((hub) => hub.id),
    locale: "en-EU",
  };
}

export function buildIntegrations(): IntegrationDto[] {
  return [
    {
      id: "sap-erp",
      provider: "SAP S/4HANA",
      type: "erp",
      status: "connected",
      lastSyncAt: daysAgo(0) + 3600000 * 2,
    },
    {
      id: "oracle-finance",
      provider: "Oracle NetSuite",
      type: "erp",
      status: "connected",
      lastSyncAt: daysAgo(1),
    },
    {
      id: "tomtom-telematics",
      provider: "TomTom Telematics",
      type: "telematics",
      status: "connected",
      lastSyncAt: daysAgo(0) + 900000,
    },
    {
      id: "geotab",
      provider: "Geotab",
      type: "telematics",
      status: "error",
      lastSyncAt: daysAgo(3),
    },
    {
      id: "dhl-carrier",
      provider: "DHL Freight API",
      type: "carrier",
      status: "connected",
      lastSyncAt: daysAgo(0) + 1800000,
    },
    {
      id: "db-schenker",
      provider: "DB Schenker Connect",
      type: "carrier",
      status: "pending",
      lastSyncAt: null,
    },
  ];
}
