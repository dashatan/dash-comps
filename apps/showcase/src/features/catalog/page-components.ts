import type { ComponentType } from "react";
import { AccordionPage } from "@/features/catalog/pages/accordion.page";
import { AlertsPage } from "@/features/catalog/pages/alerts.page";
import { AuthPage } from "@/features/catalog/pages/auth.page";
import { AvatarPage } from "@/features/catalog/pages/avatar.page";
import { BadgesPage } from "@/features/catalog/pages/badges.page";
import { BannerPage } from "@/features/catalog/pages/banner.page";
import { ButtonsPage } from "@/features/catalog/pages/buttons.page";
import { CardsPage } from "@/features/catalog/pages/cards.page";
import { CarouselPage } from "@/features/catalog/pages/carousel.page";
import { ChartsPage } from "@/features/catalog/pages/charts.page";
import { ChipsPage } from "@/features/catalog/pages/chips.page";
import { CollapsiblePage } from "@/features/catalog/pages/collapsible.page";
import { ContextMenuPage } from "@/features/catalog/pages/context-menu.page";
import { DashboardPage } from "@/features/catalog/pages/dashboard.page";
import { DividerPage } from "@/features/catalog/pages/divider.page";
import { FadeablePage } from "@/features/catalog/pages/fadeable.page";
import { FileUploaderPage } from "@/features/catalog/pages/file-uploader.page";
import { FlexPage } from "@/features/catalog/pages/flex.page";
import { FormPage } from "@/features/catalog/pages/form.page";
import { GridPage } from "@/features/catalog/pages/grid.page";
import { HoverCardPage } from "@/features/catalog/pages/hover-card.page";
import { InputsPage } from "@/features/catalog/pages/inputs.page";
import { LicensePlatePage } from "@/features/catalog/pages/license-plate.page";
import { ListPage } from "@/features/catalog/pages/list.page";
import { LoadingPage } from "@/features/catalog/pages/loading.page";
import { LocationPickerPage } from "@/features/catalog/pages/location-picker.page";
import { MapPage } from "@/features/catalog/pages/map.page";
import { OverlayPage } from "@/features/catalog/pages/overlay.page";
import { PaginationPage } from "@/features/catalog/pages/pagination.page";
import { ShapesPage } from "@/features/catalog/pages/shapes.page";
import { SkeletonPage } from "@/features/catalog/pages/skeleton.page";
import { SliderPage } from "@/features/catalog/pages/slider.page";
import { SonnerPage } from "@/features/catalog/pages/sonner.page";
import { StepsPage } from "@/features/catalog/pages/steps.page";
import { TablePage } from "@/features/catalog/pages/table.page";
import { TabsPage } from "@/features/catalog/pages/tabs.page";
import { TimelinePage } from "@/features/catalog/pages/timeline.page";
import { TrackerPage } from "@/features/catalog/pages/tracker.page";
import { TypographyPage } from "@/features/catalog/pages/typography.page";

export const catalogPageComponents = {
  accordion: AccordionPage,
  alerts: AlertsPage,
  auth: AuthPage,
  avatar: AvatarPage,
  badges: BadgesPage,
  banner: BannerPage,
  buttons: ButtonsPage,
  cards: CardsPage,
  carousel: CarouselPage,
  charts: ChartsPage,
  chips: ChipsPage,
  collapsible: CollapsiblePage,
  "context-menu": ContextMenuPage,
  dashboard: DashboardPage,
  divider: DividerPage,
  fadeable: FadeablePage,
  "file-uploader": FileUploaderPage,
  flex: FlexPage,
  form: FormPage,
  grid: GridPage,
  "hover-card": HoverCardPage,
  inputs: InputsPage,
  "license-plate": LicensePlatePage,
  list: ListPage,
  loading: LoadingPage,
  "location-picker": LocationPickerPage,
  map: MapPage,
  overlay: OverlayPage,
  pagination: PaginationPage,
  shapes: ShapesPage,
  skeleton: SkeletonPage,
  slider: SliderPage,
  sonner: SonnerPage,
  steps: StepsPage,
  table: TablePage,
  tabs: TabsPage,
  timeline: TimelinePage,
  tracker: TrackerPage,
  typography: TypographyPage,
} as const satisfies Record<string, ComponentType>;

export type CatalogPageSlug = keyof typeof catalogPageComponents;

export function isCatalogPageSlug(slug: string): slug is CatalogPageSlug {
  return slug in catalogPageComponents;
}
