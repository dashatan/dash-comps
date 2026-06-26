export const EU_CURRENCY = "EUR" as const;

export const EU_COUNTRY_CODES = [
  "DE",
  "NL",
  "FR",
  "BE",
  "PL",
  "IT",
  "ES",
  "AT",
  "CZ",
  "SE",
  "DK",
] as const;

export type EuCountryCode = (typeof EU_COUNTRY_CODES)[number];

export const EU_REGIONS = [
  "benelux",
  "dach",
  "iberia",
  "nordics",
  "central_europe",
  "western_europe",
] as const;

export type EuRegion = (typeof EU_REGIONS)[number];

export type EuHub = {
  id: string;
  city: string;
  countryCode: EuCountryCode;
  region: EuRegion;
  lat: number;
  lng: number;
};

export const EU_HUBS: readonly EuHub[] = [
  {
    id: "rotterdam",
    city: "Rotterdam",
    countryCode: "NL",
    region: "benelux",
    lat: 51.9225,
    lng: 4.4792,
  },
  {
    id: "antwerp",
    city: "Antwerp",
    countryCode: "BE",
    region: "benelux",
    lat: 51.2194,
    lng: 4.4025,
  },
  {
    id: "hamburg",
    city: "Hamburg",
    countryCode: "DE",
    region: "dach",
    lat: 53.5511,
    lng: 9.9937,
  },
  {
    id: "berlin",
    city: "Berlin",
    countryCode: "DE",
    region: "dach",
    lat: 52.52,
    lng: 13.405,
  },
  {
    id: "munich",
    city: "Munich",
    countryCode: "DE",
    region: "dach",
    lat: 48.1351,
    lng: 11.582,
  },
  {
    id: "paris",
    city: "Paris",
    countryCode: "FR",
    region: "western_europe",
    lat: 48.8566,
    lng: 2.3522,
  },
  {
    id: "lyon",
    city: "Lyon",
    countryCode: "FR",
    region: "western_europe",
    lat: 45.764,
    lng: 4.8357,
  },
  {
    id: "milan",
    city: "Milan",
    countryCode: "IT",
    region: "western_europe",
    lat: 45.4642,
    lng: 9.19,
  },
  {
    id: "barcelona",
    city: "Barcelona",
    countryCode: "ES",
    region: "iberia",
    lat: 41.3874,
    lng: 2.1686,
  },
  {
    id: "warsaw",
    city: "Warsaw",
    countryCode: "PL",
    region: "central_europe",
    lat: 52.2297,
    lng: 21.0122,
  },
  {
    id: "prague",
    city: "Prague",
    countryCode: "CZ",
    region: "central_europe",
    lat: 50.0755,
    lng: 14.4378,
  },
  {
    id: "vienna",
    city: "Vienna",
    countryCode: "AT",
    region: "dach",
    lat: 48.2082,
    lng: 16.3738,
  },
  {
    id: "brussels",
    city: "Brussels",
    countryCode: "BE",
    region: "benelux",
    lat: 50.8503,
    lng: 4.3517,
  },
] as const;

export type EuCorridor = {
  id: string;
  originHubId: EuHub["id"];
  destinationHubId: EuHub["id"];
  label: string;
  distanceKm: number;
};

export const EU_CORRIDORS: readonly EuCorridor[] = [
  {
    id: "rotterdam-hamburg",
    originHubId: "rotterdam",
    destinationHubId: "hamburg",
    label: "Rotterdam → Hamburg",
    distanceKm: 468,
  },
  {
    id: "paris-milan",
    originHubId: "paris",
    destinationHubId: "milan",
    label: "Paris → Milan",
    distanceKm: 851,
  },
  {
    id: "antwerp-berlin",
    originHubId: "antwerp",
    destinationHubId: "berlin",
    label: "Antwerp → Berlin",
    distanceKm: 785,
  },
  {
    id: "barcelona-lyon",
    originHubId: "barcelona",
    destinationHubId: "lyon",
    label: "Barcelona → Lyon",
    distanceKm: 643,
  },
  {
    id: "hamburg-warsaw",
    originHubId: "hamburg",
    destinationHubId: "warsaw",
    label: "Hamburg → Warsaw",
    distanceKm: 683,
  },
  {
    id: "rotterdam-paris",
    originHubId: "rotterdam",
    destinationHubId: "paris",
    label: "Rotterdam → Paris",
    distanceKm: 438,
  },
  {
    id: "munich-vienna",
    originHubId: "munich",
    destinationHubId: "vienna",
    label: "Munich → Vienna",
    distanceKm: 403,
  },
  {
    id: "milan-barcelona",
    originHubId: "milan",
    destinationHubId: "barcelona",
    label: "Milan → Barcelona",
    distanceKm: 978,
  },
  {
    id: "prague-berlin",
    originHubId: "prague",
    destinationHubId: "berlin",
    label: "Prague → Berlin",
    distanceKm: 350,
  },
  {
    id: "brussels-rotterdam",
    originHubId: "brussels",
    destinationHubId: "rotterdam",
    label: "Brussels → Rotterdam",
    distanceKm: 148,
  },
] as const;

export const COMPANY_SUFFIXES = [
  "GmbH",
  "BV",
  "SARL",
  "SpA",
  "SA",
  "AB",
  "s.r.o.",
] as const;

export const PHONE_PREFIXES = [
  "+31",
  "+49",
  "+33",
  "+32",
  "+48",
  "+39",
  "+34",
  "+43",
  "+420",
] as const;

export const SHIPMENT_STATUSES = [
  "pending",
  "in_transit",
  "delivered",
  "delayed",
  "cancelled",
] as const;

export type ShipmentStatus = (typeof SHIPMENT_STATUSES)[number];

export const MONTH_LABELS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

const eurFormatter = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

const eurPreciseFormatter = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "EUR",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const kgFormatter = new Intl.NumberFormat("en-GB", {
  maximumFractionDigits: 0,
});

const kmFormatter = new Intl.NumberFormat("en-GB", {
  maximumFractionDigits: 0,
});

export function formatEur(amount: number, precise = false): string {
  return precise
    ? eurPreciseFormatter.format(amount)
    : eurFormatter.format(amount);
}

export function formatKg(weight: number): string {
  return `${kgFormatter.format(weight)} kg`;
}

export function formatKm(distance: number): string {
  return `${kmFormatter.format(distance)} km`;
}

export function formatEuropeanDate(timestamp: number): string {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(timestamp));
}

export function formatEuropeanDateTime(timestamp: number): string {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(timestamp));
}

export function getHubById(id: EuHub["id"]): EuHub {
  const hub = EU_HUBS.find((h) => h.id === id);
  if (!hub) throw new Error(`Unknown hub: ${id}`);
  return hub;
}

export function getCorridorById(id: EuCorridor["id"]): EuCorridor {
  const corridor = EU_CORRIDORS.find((c) => c.id === id);
  if (!corridor) throw new Error(`Unknown corridor: ${id}`);
  return corridor;
}

export function daysAgo(days: number): number {
  return Date.now() - days * 86_400_000;
}

export function daysFromNow(days: number): number {
  return Date.now() + days * 86_400_000;
}

export function buildEuPlate(countryCode: EuCountryCode, seed: number): string {
  switch (countryCode) {
    case "DE":
      return `DE-${String.fromCharCode(65 + (seed % 26))}${String.fromCharCode(65 + ((seed + 3) % 26))} ${1000 + (seed % 9000)}`;
    case "NL":
      return `NL-${10 + (seed % 89)}-${String.fromCharCode(65 + (seed % 26))}${String.fromCharCode(65 + ((seed + 5) % 26))}${String.fromCharCode(65 + ((seed + 11) % 26))}-${1 + (seed % 9)}`;
    case "FR":
      return `FR-${String.fromCharCode(65 + (seed % 26))}${String.fromCharCode(65 + ((seed + 2) % 26))}-${100 + (seed % 900)}-${String.fromCharCode(65 + ((seed + 7) % 26))}${String.fromCharCode(65 + ((seed + 13) % 26))}`;
    case "BE":
      return `BE-1-${String.fromCharCode(65 + (seed % 26))}${String.fromCharCode(65 + ((seed + 4) % 26))}${String.fromCharCode(65 + ((seed + 9) % 26))}-${100 + (seed % 900)}`;
    case "PL":
      return `PL-${String.fromCharCode(65 + (seed % 26))}${String.fromCharCode(65 + ((seed + 6) % 26))} ${10000 + (seed % 90000)}`;
    case "IT":
      return `IT-${String.fromCharCode(65 + (seed % 26))}${String.fromCharCode(65 + ((seed + 8) % 26))} ${100 + (seed % 900)} ${String.fromCharCode(65 + ((seed + 12) % 26))}${String.fromCharCode(65 + ((seed + 15) % 26))}`;
    case "ES":
      return `ES-${1000 + (seed % 9000)} ${String.fromCharCode(65 + (seed % 26))}${String.fromCharCode(65 + ((seed + 10) % 26))}`;
    case "AT":
      return `AT-${String.fromCharCode(65 + (seed % 26))} ${10 + (seed % 89)}${100 + (seed % 900)}`;
    case "CZ":
      return `CZ-${1 + (seed % 9)}${String.fromCharCode(65 + (seed % 26))}${String.fromCharCode(65 + ((seed + 14) % 26))} ${1000 + (seed % 9000)}`;
    case "SE":
      return `SE-${String.fromCharCode(65 + (seed % 26))}${String.fromCharCode(65 + ((seed + 16) % 26))} ${100 + (seed % 900)}`;
    case "DK":
      return `DK-${10 + (seed % 89)} ${100 + (seed % 900)} ${10 + (seed % 89)}`;
    default:
      return `EU-${countryCode}-${1000 + (seed % 9000)}`;
  }
}

export function buildVatNumber(
  countryCode: EuCountryCode,
  seed: number,
): string {
  const base = 100000000 + (seed % 899999999);
  if (countryCode === "NL") return `NL${base}B01`;
  if (countryCode === "DE") return `DE${base}`;
  if (countryCode === "FR") return `FR${base}`;
  return `${countryCode}${base}`;
}
