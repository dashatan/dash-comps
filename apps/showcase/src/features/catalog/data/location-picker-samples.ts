import type {
  LocationPickerCommitPayload,
  LocationPickerDateHint,
  LocationPickerFilters,
  LocationPickerRoutingState,
} from "@/components/compound/location-picker/types";

const base = "/location-picker";

export const showcaseLocationPickerImages = {
  triggerEmpty: `${base}/trigger-empty.jpg`,
  triggerDevices: `${base}/trigger-devices.jpg`,
  triggerProvinces: `${base}/trigger-provinces.jpg`,
  filterMap: `${base}/filter-map.jpg`,
  filterSelected: `${base}/filter-selected.jpg`,
  dateHint: `${base}/date-hint.jpg`,
  routingOrigin: `${base}/routing-origin.jpg`,
  routingRoutes: `${base}/routing-routes.jpg`,
  routingLoading: `${base}/routing-loading.jpg`,
} as const;

export type ShowcaseLocationPickerImageKey =
  keyof typeof showcaseLocationPickerImages;

export const EMPTY_FILTERS: LocationPickerFilters = {};

export const SOURCES_FILTERS: LocationPickerFilters = {
  sources: [1, 2],
};

export const PROVINCES_FILTERS: LocationPickerFilters = {
  provinces: [8, 4],
};

export const ROADS_FILTERS: LocationPickerFilters = {
  roads: [101, 102],
};

export const DEVICES_FILTERS: LocationPickerFilters = {
  devices: [1001, 1002, 1003],
};

export const FILTER_SELECTED: LocationPickerFilters = {
  sources: [1],
  provinces: [8],
  roads: [101],
  devices: [1001, 1006],
};

export const DATE_HINT_SAMPLE: LocationPickerDateHint = {
  date: [1_735_689_600_000, 1_736_475_600_000],
  deviceDateRange: "custom",
};

export const ROUTING_ORIGIN_STATE: LocationPickerRoutingState = {
  addingOrigin: true,
  originLatLng: [35.7442, 51.3754],
};

export const ROUTING_DESTINATION_STATE: LocationPickerRoutingState = {
  originLatLng: [35.7442, 51.3754],
  destinationLatLng: [35.6997, 51.3381],
  addingDestination: true,
};

export const ROUTING_WITH_ROUTES: LocationPickerRoutingState = {
  originLatLng: [35.7442, 51.3754],
  destinationLatLng: [35.6997, 51.3381],
  selectedRoute: 0,
  routes: [
    {
      index: 0,
      title: "Route 1",
      distance: 12400,
      duration: 1080,
      originName: "Hemmat — westbound lane 2",
      destinationName: "Azadi tower approach",
      devices: [1001, 1002, 1006],
      summary: "Via expressway",
    },
    {
      index: 1,
      title: "Route 2",
      distance: 9800,
      duration: 840,
      originName: "Hemmat — westbound lane 2",
      destinationName: "Azadi tower approach",
      devices: [1001, 1003, 1006],
      summary: "Via surface streets",
    },
  ],
};

export const ROUTING_LOADING_STATE: LocationPickerRoutingState = {
  originLatLng: [35.7442, 51.3754],
  destinationLatLng: [35.6997, 51.3381],
  isLoading: true,
};

export const COMMITTED_SAMPLE: LocationPickerCommitPayload = {
  filters: FILTER_SELECTED,
  routing: {
    originLatLng: [35.7442, 51.3754],
    destinationLatLng: [35.6997, 51.3381],
    selectedRoute: 0,
    routes: ROUTING_WITH_ROUTES.routes,
    isLoading: false,
  },
};

export type DialogPreviewKey =
  | "filterEmpty"
  | "filterSelected"
  | "dateHint"
  | "routingOrigin"
  | "routingDestination"
  | "routingRoutes"
  | "routingLoading";

export type DialogPreviewConfig = {
  key: DialogPreviewKey;
  initialFilters: LocationPickerFilters;
  initialRouting?: LocationPickerRoutingState;
  dateHint?: LocationPickerDateHint;
  defaultTab?: 0 | 1;
};

export const DIALOG_PREVIEW_CONFIGS: DialogPreviewConfig[] = [
  {
    key: "filterEmpty",
    initialFilters: EMPTY_FILTERS,
    defaultTab: 0,
  },
  {
    key: "filterSelected",
    initialFilters: FILTER_SELECTED,
    defaultTab: 0,
  },
  {
    key: "dateHint",
    initialFilters: FILTER_SELECTED,
    dateHint: DATE_HINT_SAMPLE,
    defaultTab: 0,
  },
  {
    key: "routingOrigin",
    initialFilters: EMPTY_FILTERS,
    initialRouting: ROUTING_ORIGIN_STATE,
    defaultTab: 1,
  },
  {
    key: "routingDestination",
    initialFilters: EMPTY_FILTERS,
    initialRouting: ROUTING_DESTINATION_STATE,
    defaultTab: 1,
  },
  {
    key: "routingRoutes",
    initialFilters: DEVICES_FILTERS,
    initialRouting: ROUTING_WITH_ROUTES,
    defaultTab: 1,
  },
  {
    key: "routingLoading",
    initialFilters: EMPTY_FILTERS,
    initialRouting: ROUTING_LOADING_STATE,
    defaultTab: 1,
  },
];
