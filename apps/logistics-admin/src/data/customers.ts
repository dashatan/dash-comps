import {
  COMPANY_SUFFIXES,
  EU_COUNTRY_CODES,
  EU_HUBS,
  PHONE_PREFIXES,
  buildVatNumber,
  type EuCountryCode,
  type EuRegion,
} from "@/data/european-context";
import { CUSTOMER_COUNT } from "@/data/entity-counts";

export type Customer = {
  id: number;
  name: string;
  suffix: (typeof COMPANY_SUFFIXES)[number];
  city: string;
  countryCode: EuCountryCode;
  region: EuRegion;
  vatNumber: string;
  phone: string;
  accountTier: "standard" | "premium" | "enterprise";
};

const CUSTOMER_NAMES = [
  "NordTrans",
  "EuroFreight",
  "RheinLogistik",
  "Benelux Cargo",
  "Alpine Supply",
  "Iberia Express",
  "Baltic Routes",
  "Danube Freight",
  "MedHub Logistics",
  "Continental Parts",
  "Vistula Trade",
  "Seine Distribution",
  "Rhine Valley GmbH",
  "Lowlands Retail",
  "Pyrenees Fresh",
] as const;

export { CUSTOMER_COUNT } from "@/data/entity-counts";

function buildCustomer(id: number): Customer {
  const hub = EU_HUBS[id % EU_HUBS.length];
  const name = CUSTOMER_NAMES[id % CUSTOMER_NAMES.length];
  const suffix = COMPANY_SUFFIXES[id % COMPANY_SUFFIXES.length];
  const countryCode = EU_COUNTRY_CODES[id % EU_COUNTRY_CODES.length];
  const prefix = PHONE_PREFIXES[id % PHONE_PREFIXES.length];

  return {
    id,
    name,
    suffix,
    city: hub.city,
    countryCode,
    region: hub.region,
    vatNumber: buildVatNumber(countryCode, id * 17 + 3),
    phone: `${prefix} ${100 + (id % 900)} ${1000000 + (id % 8999999)}`,
    accountTier: id % 7 === 0 ? "enterprise" : id % 3 === 0 ? "premium" : "standard",
  };
}

export const CUSTOMERS: Customer[] = Array.from(
  { length: CUSTOMER_COUNT },
  (_, i) => buildCustomer(i + 1),
);

export function getCustomerById(id: number): Customer | undefined {
  return CUSTOMERS.find((c) => c.id === id);
}

export function getCustomerDisplayName(customer: Customer): string {
  return `${customer.name} ${customer.suffix}`;
}
