import type { LucideIcon } from "lucide-react";
import {
  MousePointerClick,
  BadgeCheck,
  Bell,
  CreditCard,
  TextCursorInput,
  Layers,
  ToggleLeft,
  Sparkles,
  UserCircle,
  Flag,
  GalleryHorizontal,
  BarChart3,
  ChevronsUpDown,
  Menu,
  SeparatorHorizontal,
  AlertCircle,
  Eye,
  LayoutGrid,
  Grid3x3,
  SquareMousePointer,
  List,
  Loader2,
  Map,
  PanelTop,
  ChevronsLeftRight,
  Hash,
  Shapes,
  Bone,
  SlidersHorizontal,
  BellRing,
  ListOrdered,
  GitBranch,
  Type,
  Upload,
  FileInput,
  Car,
  Calendar,
  Table2,
  MapPin,
  Route,
  LogIn,
  LayoutDashboard,
} from "lucide-react";

export const CATALOG_SLUGS = [
  "accordion",
  "alerts",
  "avatar",
  "badges",
  "banner",
  "buttons",
  "cards",
  "carousel",
  "charts",
  "chips",
  "collapsible",
  "context-menu",
  "divider",
  "errors",
  "fadeable",
  "flex",
  "grid",
  "hover-card",
  "inputs",
  "list",
  "loading",
  "map",
  "overlay",
  "pagination",
  "paginator",
  "shapes",
  "skeleton",
  "slider",
  "sonner",
  "steps",
  "tabs",
  "timeline",
  "typography",
  "auth",
  "dashboard",
  "file-uploader",
  "form",
  "license-plate",
  "location-picker",
  "persian-date-picker",
  "table",
  "tracker",
] as const;

export type CatalogSlug = (typeof CATALOG_SLUGS)[number];

export type CatalogGroup = "common" | "compound";

export type CatalogCategory = {
  slug: CatalogSlug;
  icon: LucideIcon;
  count: number;
};

export type CatalogCategoryGroup = {
  group: CatalogGroup;
  items: CatalogCategory[];
};

const commonCatalogCategories: CatalogCategory[] = [
  { slug: "accordion", icon: ToggleLeft, count: 3 },
  { slug: "alerts", icon: Bell, count: 5 },
  { slug: "avatar", icon: UserCircle, count: 3 },
  { slug: "badges", icon: BadgeCheck, count: 6 },
  { slug: "banner", icon: Flag, count: 14 },
  { slug: "buttons", icon: MousePointerClick, count: 8 },
  { slug: "cards", icon: CreditCard, count: 7 },
  { slug: "carousel", icon: GalleryHorizontal, count: 2 },
  { slug: "charts", icon: BarChart3, count: 4 },
  { slug: "chips", icon: Sparkles, count: 4 },
  { slug: "collapsible", icon: ChevronsUpDown, count: 2 },
  { slug: "context-menu", icon: Menu, count: 2 },
  { slug: "divider", icon: SeparatorHorizontal, count: 3 },
  { slug: "errors", icon: AlertCircle, count: 2 },
  { slug: "fadeable", icon: Eye, count: 2 },
  { slug: "flex", icon: LayoutGrid, count: 2 },
  { slug: "grid", icon: Grid3x3, count: 2 },
  { slug: "hover-card", icon: SquareMousePointer, count: 2 },
  { slug: "inputs", icon: TextCursorInput, count: 22 },
  { slug: "list", icon: List, count: 3 },
  { slug: "loading", icon: Loader2, count: 2 },
  { slug: "map", icon: Map, count: 1 },
  { slug: "overlay", icon: PanelTop, count: 3 },
  { slug: "pagination", icon: ChevronsLeftRight, count: 2 },
  { slug: "paginator", icon: Hash, count: 2 },
  { slug: "shapes", icon: Shapes, count: 2 },
  { slug: "skeleton", icon: Bone, count: 2 },
  { slug: "slider", icon: SlidersHorizontal, count: 2 },
  { slug: "sonner", icon: BellRing, count: 4 },
  { slug: "steps", icon: ListOrdered, count: 2 },
  { slug: "tabs", icon: Layers, count: 3 },
  { slug: "timeline", icon: GitBranch, count: 2 },
  { slug: "typography", icon: Type, count: 2 },
];

const compoundCatalogCategories: CatalogCategory[] = [
  { slug: "auth", icon: LogIn, count: 1 },
  { slug: "dashboard", icon: LayoutDashboard, count: 1 },
  { slug: "file-uploader", icon: Upload, count: 2 },
  { slug: "form", icon: FileInput, count: 2 },
  { slug: "license-plate", icon: Car, count: 3 },
  { slug: "location-picker", icon: MapPin, count: 1 },
  { slug: "persian-date-picker", icon: Calendar, count: 2 },
  { slug: "table", icon: Table2, count: 1 },
  { slug: "tracker", icon: Route, count: 1 },
];

export const catalogCategoryGroups: CatalogCategoryGroup[] = [
  { group: "common", items: commonCatalogCategories },
  { group: "compound", items: compoundCatalogCategories },
];

export const catalogCategories: CatalogCategory[] = catalogCategoryGroups.flatMap(
  ({ items }) => items,
);
