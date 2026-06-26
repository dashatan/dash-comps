import type { TreeSelectItem } from "@/components/common/inputs/select/types";
import type {
  Device,
  Province,
  Road,
  Source,
} from "@/features/resources/types";

export const showcaseSources: Source[] = [
  { id: 1, name: "National traffic network" },
  { id: 2, name: "Tehran metro cameras" },
  { id: 3, name: "Highway enforcement" },
];

export const showcaseProvinces: Province[] = [
  { id: 8, name: "Tehran", source: [1, 2] },
  { id: 4, name: "Isfahan", source: [1, 3] },
  { id: 13, name: "Mazandaran", source: [1] },
];

export const showcaseRoads: Road[] = [
  { id: 101, name: "Hemmat Expressway", province: 8, source: 1 },
  { id: 102, name: "Modares Highway", province: 8, source: 2 },
  { id: 201, name: "Chaharbagh Boulevard", province: 4, source: 1 },
  { id: 301, name: "Haraz Road", province: 13, source: 1 },
];

export const showcaseDevices: Device[] = [
  {
    id: 1001,
    name: "Hemmat — westbound lane 2",
    lat: "35.7442",
    long: "51.3754",
    province: 8,
    road: 101,
    source: 1,
    device_type: 1,
  },
  {
    id: 1002,
    name: "Modares — north exit",
    lat: "35.7578",
    long: "51.4103",
    province: 8,
    road: 102,
    source: 2,
    device_type: 1,
  },
  {
    id: 1003,
    name: "Vanak square junction",
    lat: "35.7575",
    long: "51.4086",
    province: 8,
    road: 102,
    source: 2,
    device_type: 2,
  },
  {
    id: 1004,
    name: "Chaharbagh — historic gate",
    lat: "32.6546",
    long: "51.6680",
    province: 4,
    road: 201,
    source: 1,
    device_type: 1,
  },
  {
    id: 1005,
    name: "Haraz — mountain checkpoint",
    lat: "35.8012",
    long: "52.5025",
    province: 13,
    road: 301,
    source: 1,
    device_type: 1,
  },
  {
    id: 1006,
    name: "Azadi tower approach",
    lat: "35.6997",
    long: "51.3381",
    province: 8,
    road: 101,
    source: 1,
    device_type: 2,
  },
];

export const showcaseSourcesNested: TreeSelectItem[] = [
  {
    label: "National traffic network",
    value: 1,
    children: [
      { label: "Tehran region", value: 11 },
      { label: "Isfahan region", value: 12 },
    ],
  },
  {
    label: "Tehran metro cameras",
    value: 2,
    children: [{ label: "Inner city ring", value: 21 }],
  },
  {
    label: "Highway enforcement",
    value: 3,
    children: [{ label: "North corridor", value: 31 }],
  },
];
