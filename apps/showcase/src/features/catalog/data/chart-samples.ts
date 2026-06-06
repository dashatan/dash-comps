import type { PieDataItem } from "@/components/common/charts/pie";
import type { TreeMapDataItem } from "@/components/common/charts/tree-map";
import type { GeoMapDataItem } from "@/components/common/charts/map/geo-map";
import type { MapData } from "@/components/common/charts/map/types";

export const showcaseGeoPaths = {
  usa: "/charts/geo/usa.json",
  world: "/charts/geo/world.json",
} as const;

export const showcaseMonthKeys = [
  "jan", "feb", "mar", "apr", "may", "jun",
  "jul", "aug", "sep", "oct", "nov", "dec",
] as const;

export type ShowcaseMonthKey = (typeof showcaseMonthKeys)[number];

export const showcaseQuarterKeys = ["q1", "q2", "q3", "q4"] as const;

/** SaaS MRR & churn (USD thousands). */
export const showcaseSaasMrr = {
  mrr: [820, 845, 878, 910, 948, 985, 1020, 1065, 1102, 1148, 1190, 1245],
  churn: [42, 38, 41, 36, 34, 33, 31, 29, 28, 27, 26, 24],
  newLogos: [18, 22, 19, 24, 26, 28, 31, 29, 33, 35, 38, 41],
} as const;

/** Monthly revenue vs operating costs (USD thousands). */
export const showcaseRevenueSeries = {
  revenue: [142, 158, 171, 165, 189, 203, 218, 224, 210, 235, 248, 262],
  expenses: [98, 104, 112, 108, 121, 128, 134, 131, 125, 138, 144, 151],
  profit: [44, 54, 59, 57, 68, 75, 84, 93, 85, 97, 104, 111],
} as const;

/** E-commerce orders by category (weekly). */
export const showcaseEcommerceOrders = {
  electronics: [420, 380, 510, 465, 530, 490, 560],
  fashion: [310, 340, 290, 360, 380, 410, 395],
  home: [180, 195, 210, 205, 220, 240, 230],
} as const;

/** Product units sold — horizontal bar. */
export const showcaseProductSales = {
  labels: ["Laptops", "Monitors", "Keyboards", "Headsets", "Webcams", "Docks", "Tablets", "Printers"],
  units: [1240, 980, 1560, 870, 640, 420, 730, 390],
} as const;

/** Marketing channel contribution (stacked). */
export const showcaseChannelSeries = {
  organic: [320, 340, 360, 380, 410, 430],
  paid: [180, 195, 210, 225, 240, 255],
  referral: [90, 95, 100, 108, 112, 118],
  email: [65, 72, 78, 84, 88, 95],
} as const;

/** Profit / loss by region. */
export const showcaseProfitLoss = {
  labels: ["North America", "EMEA", "APAC", "LATAM", "Middle East"],
  values: [42, -18, 31, -8, 24],
} as const;

/** Hourly server response time (ms) — 24h ops dashboard. */
export const showcaseServerLatency = {
  labels: Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, "0")}:00`),
  api: [42, 38, 35, 33, 31, 30, 32, 45, 58, 62, 55, 48, 44, 46, 50, 53, 57, 61, 54, 47, 43, 40, 38, 36],
  db: [18, 16, 15, 14, 13, 14, 16, 22, 28, 30, 26, 22, 20, 21, 23, 25, 27, 29, 25, 21, 19, 17, 16, 15],
} as const;

/** Daily active users — 14-day trend. */
export const showcaseActiveUsers = {
  mobile: [8200, 8450, 8700, 9100, 9350, 9600, 9900, 10200, 10450, 10700, 10950, 11200, 11400, 11650],
  desktop: [5400, 5320, 5480, 5510, 5600, 5550, 5620, 5700, 5680, 5750, 5810, 5880, 5920, 5980],
  tablet: [2100, 2050, 2180, 2240, 2310, 2280, 2350, 2420, 2380, 2450, 2510, 2480, 2550, 2610],
} as const;

export const showcaseDayLabels = Array.from({ length: 14 }, (_, i) => `D${i + 1}`);

/** Conversion funnel. */
export const showcaseFunnelSteps = {
  visits: [100, 92, 78, 64, 51, 42, 38, 35],
  signups: [100, 88, 72, 58, 46, 38, 34, 31],
  trials: [100, 76, 58, 44, 32, 24, 20, 18],
} as const;

/** Website traffic sources (stacked area). */
export const showcaseTrafficSources = {
  direct: [1200, 1320, 1010, 1340, 900, 1230, 1410],
  search: [820, 932, 901, 934, 1290, 1330, 1320],
  social: [320, 332, 301, 334, 390, 330, 320],
  email: [220, 182, 191, 234, 290, 330, 310],
  paid: [410, 380, 420, 460, 510, 490, 530],
} as const;

export const showcaseWeekLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

/** Energy mix over months (GWh). */
export const showcaseEnergyMix = {
  solar: [120, 135, 158, 172, 190, 205, 218, 210, 185, 160, 130, 115],
  wind: [95, 102, 110, 118, 125, 130, 128, 122, 115, 108, 98, 92],
  hydro: [80, 82, 85, 88, 90, 92, 94, 93, 91, 89, 86, 84],
  gas: [140, 135, 128, 120, 115, 110, 108, 112, 118, 125, 132, 138],
} as const;

/** Browser / OS drill-down hierarchy. */
export const showcasePieDrillDown: PieDataItem[] = [
  {
    name: "Browsers",
    value: 1048,
    children: [
      { name: "Chrome", value: 580 },
      { name: "Edge", value: 200 },
      { name: "Firefox", value: 150 },
      { name: "Safari", value: 118 },
    ],
  },
  {
    name: "Operating Systems",
    value: 735,
    children: [
      { name: "Windows", value: 380 },
      { name: "macOS", value: 190 },
      { name: "Linux", value: 165 },
    ],
  },
  { name: "Mobile Apps", value: 580 },
  { name: "Other", value: 210 },
];

/** Retail category share. */
export const showcaseCategoryShare = [
  { name: "Electronics", value: 335 },
  { name: "Apparel", value: 274 },
  { name: "Home & Garden", value: 210 },
  { name: "Sports", value: 148 },
  { name: "Books", value: 102 },
  { name: "Beauty", value: 88 },
] as const;

/** Payment method split. */
export const showcasePaymentMethods = [
  { name: "Credit Card", value: 4520 },
  { name: "PayPal", value: 2180 },
  { name: "Apple Pay", value: 1640 },
  { name: "Bank Transfer", value: 980 },
  { name: "Cash on Delivery", value: 620 },
] as const;

/** Campaign rose chart. */
export const showcaseCampaignRose = [
  { name: "Email", value: 38 },
  { name: "Social", value: 52 },
  { name: "Search", value: 61 },
  { name: "Display", value: 28 },
  { name: "Affiliate", value: 44 },
  { name: "Direct", value: 55 },
  { name: "Referral", value: 33 },
  { name: "Video", value: 47 },
] as const;

/** Sprint task breakdown. */
export const showcaseTaskCompletion = [
  { name: "Completed", value: 847 },
  { name: "In Progress", value: 213 },
  { name: "Blocked", value: 64 },
  { name: "Not Started", value: 176 },
] as const;

/** Project portfolio status. */
export const showcaseProjectStatus = [
  { name: "On Track", value: 12 },
  { name: "At Risk", value: 5 },
  { name: "Delayed", value: 3 },
  { name: "Done", value: 28 },
  { name: "Planning", value: 7 },
] as const;

/** Budget allocation doughnut. */
export const showcaseBudgetAllocation = [
  { name: "Engineering", value: 420 },
  { name: "Marketing", value: 280 },
  { name: "Sales", value: 190 },
  { name: "Operations", value: 150 },
  { name: "Support", value: 95 },
] as const;

/** Global market cap treemap. */
export const showcaseMarketShare: TreeMapDataItem[] = [
  {
    name: "Technology",
    value: 0,
    children: [
      { name: "Cloud Services", value: 420 },
      { name: "Hardware", value: 280 },
      { name: "Software", value: 350 },
      { name: "Semiconductors", value: 190 },
    ],
  },
  {
    name: "Consumer",
    value: 0,
    children: [
      { name: "Retail", value: 310 },
      { name: "Food & Beverage", value: 240 },
      { name: "Automotive", value: 180 },
    ],
  },
  {
    name: "Finance",
    value: 0,
    children: [
      { name: "Banking", value: 260 },
      { name: "Insurance", value: 150 },
      { name: "Fintech", value: 120 },
    ],
  },
  {
    name: "Healthcare",
    value: 0,
    children: [
      { name: "Pharma", value: 200 },
      { name: "Medical Devices", value: 130 },
      { name: "Hospitals", value: 95 },
    ],
  },
];

/** Website traffic treemap by page section. */
export const showcaseWebsiteSections: TreeMapDataItem[] = [
  {
    name: "Marketing Site",
    value: 0,
    children: [
      { name: "Homepage", value: 12400 },
      { name: "Pricing", value: 8200 },
      { name: "Blog", value: 5600 },
      { name: "Docs", value: 9100 },
    ],
  },
  {
    name: "Product App",
    value: 0,
    children: [
      { name: "Dashboard", value: 18200 },
      { name: "Settings", value: 4300 },
      { name: "Reports", value: 6700 },
      { name: "Integrations", value: 2900 },
    ],
  },
  {
    name: "Support",
    value: 0,
    children: [
      { name: "Help Center", value: 3800 },
      { name: "Contact", value: 1200 },
      { name: "Status Page", value: 900 },
    ],
  },
];

/** Iran province sales (thousands of units). */
export const showcaseProvinceSales: MapData[] = [
  { name: "Tehran", value: 4820 },
  { name: "Esfahan", value: 2140 },
  { name: "Fars", value: 1980 },
  { name: "Razavi Khorasan", value: 1760 },
  { name: "East Azarbaijan", value: 1540 },
  { name: "Khuzestan", value: 1420 },
  { name: "Mazandaran", value: 1280 },
  { name: "Kerman", value: 980 },
  { name: "Gilan", value: 920 },
  { name: "Alborz", value: 860 },
  { name: "West Azarbaijan", value: 740 },
  { name: "Hormozgan", value: 680 },
  { name: "Qom", value: 620 },
  { name: "Markazi", value: 580 },
  { name: "Kermanshah", value: 520 },
  { name: "Yazd", value: 480 },
  { name: "Golestan", value: 440 },
  { name: "Hamadan", value: 410 },
  { name: "Ardebil", value: 380 },
  { name: "Lorestan", value: 350 },
  { name: "Semnan", value: 320 },
  { name: "Zanjan", value: 290 },
  { name: "Qazvin", value: 270 },
  { name: "Chahar Mahall and Bakhtiari", value: 250 },
  { name: "Kordestan", value: 230 },
  { name: "Ilam", value: 210 },
  { name: "Bushehr", value: 190 },
  { name: "Kohgiluyeh and Buyer Ahmad", value: 170 },
  { name: "North Khorasan", value: 150 },
  { name: "South Khorasan", value: 130 },
  { name: "Sistan and Baluchestan", value: 110 },
];

/** US state tech employment (thousands, 2024 est.). */
export const showcaseUsStateTechJobs: GeoMapDataItem[] = [
  { name: "California", value: 1420 },
  { name: "Texas", value: 680 },
  { name: "New York", value: 590 },
  { name: "Washington", value: 420 },
  { name: "Massachusetts", value: 380 },
  { name: "Virginia", value: 340 },
  { name: "Florida", value: 310 },
  { name: "Illinois", value: 280 },
  { name: "Colorado", value: 260 },
  { name: "Georgia", value: 240 },
  { name: "North Carolina", value: 220 },
  { name: "Pennsylvania", value: 210 },
  { name: "Ohio", value: 190 },
  { name: "Arizona", value: 175 },
  { name: "Maryland", value: 168 },
  { name: "New Jersey", value: 162 },
  { name: "Michigan", value: 155 },
  { name: "Minnesota", value: 148 },
  { name: "Oregon", value: 142 },
  { name: "Utah", value: 135 },
];

/** Global GDP by country (USD billions, sample). */
export const showcaseWorldGdp: GeoMapDataItem[] = [
  { name: "United States", value: 26854 },
  { name: "China", value: 19373 },
  { name: "Japan", value: 4417 },
  { name: "Germany", value: 4309 },
  { name: "India", value: 3730 },
  { name: "United Kingdom", value: 3159 },
  { name: "France", value: 2938 },
  { name: "Italy", value: 2107 },
  { name: "Brazil", value: 2055 },
  { name: "Canada", value: 2089 },
  { name: "Russia", value: 1862 },
  { name: "Mexico", value: 1575 },
  { name: "Australia", value: 1682 },
  { name: "Korea", value: 1712 },
  { name: "Spain", value: 1460 },
  { name: "Indonesia", value: 1396 },
  { name: "Turkey", value: 1029 },
  { name: "Netherlands", value: 1010 },
  { name: "Saudi Arabia", value: 1011 },
  { name: "Iran", value: 388 },
  { name: "Switzerland", value: 894 },
  { name: "Poland", value: 748 },
  { name: "Sweden", value: 599 },
  { name: "Belgium", value: 589 },
  { name: "Argentina", value: 641 },
  { name: "Norway", value: 579 },
  { name: "Austria", value: 481 },
  { name: "Israel", value: 522 },
  { name: "Ireland", value: 529 },
  { name: "Singapore", value: 497 },
];

/** Hospital admissions by department (weekly). */
export const showcaseHospitalAdmissions = {
  emergency: [82, 78, 85, 91, 88, 76, 72],
  surgery: [34, 38, 36, 40, 42, 38, 35],
  pediatrics: [28, 30, 32, 29, 31, 33, 30],
  oncology: [18, 19, 20, 21, 20, 19, 18],
} as const;

/** Long category labels for rotated x-axis demo. */
export const showcaseLongCategoryLabels = [
  "Enterprise Plan",
  "Professional Plan",
  "Starter Plan",
  "Add-on Analytics",
  "Add-on Support",
  "Training Package",
  "Custom Integration",
  "Legacy Migration",
] as const;

export const showcaseLongCategoryValues = [420, 680, 890, 210, 185, 95, 145, 62] as const;
