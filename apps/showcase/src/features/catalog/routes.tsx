import type { ReactElement } from "react";
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
import { ErrorsPage } from "@/features/catalog/pages/errors.page";
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
import { PaginatorPage } from "@/features/catalog/pages/paginator.page";
import { PersianDatePickerPage } from "@/features/catalog/pages/persian-date-picker.page";
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

type CatalogRoute = {
  path: string;
  element: ReactElement;
};

export const catalogRoutes: CatalogRoute[] = [
  { path: "/components/accordion", element: <AccordionPage /> },
  { path: "/components/alerts", element: <AlertsPage /> },
  { path: "/components/auth", element: <AuthPage /> },
  { path: "/components/avatar", element: <AvatarPage /> },
  { path: "/components/badges", element: <BadgesPage /> },
  { path: "/components/banner", element: <BannerPage /> },
  { path: "/components/buttons", element: <ButtonsPage /> },
  { path: "/components/cards", element: <CardsPage /> },
  { path: "/components/carousel", element: <CarouselPage /> },
  { path: "/components/charts", element: <ChartsPage /> },
  { path: "/components/chips", element: <ChipsPage /> },
  { path: "/components/collapsible", element: <CollapsiblePage /> },
  { path: "/components/context-menu", element: <ContextMenuPage /> },
  { path: "/components/dashboard", element: <DashboardPage /> },
  { path: "/components/divider", element: <DividerPage /> },
  { path: "/components/errors", element: <ErrorsPage /> },
  { path: "/components/fadeable", element: <FadeablePage /> },
  { path: "/components/file-uploader", element: <FileUploaderPage /> },
  { path: "/components/flex", element: <FlexPage /> },
  { path: "/components/form", element: <FormPage /> },
  { path: "/components/grid", element: <GridPage /> },
  { path: "/components/hover-card", element: <HoverCardPage /> },
  { path: "/components/inputs", element: <InputsPage /> },
  { path: "/components/license-plate", element: <LicensePlatePage /> },
  { path: "/components/list", element: <ListPage /> },
  { path: "/components/loading", element: <LoadingPage /> },
  { path: "/components/location-picker", element: <LocationPickerPage /> },
  { path: "/components/map", element: <MapPage /> },
  { path: "/components/overlay", element: <OverlayPage /> },
  { path: "/components/pagination", element: <PaginationPage /> },
  { path: "/components/paginator", element: <PaginatorPage /> },
  { path: "/components/persian-date-picker", element: <PersianDatePickerPage /> },
  { path: "/components/shapes", element: <ShapesPage /> },
  { path: "/components/skeleton", element: <SkeletonPage /> },
  { path: "/components/slider", element: <SliderPage /> },
  { path: "/components/sonner", element: <SonnerPage /> },
  { path: "/components/steps", element: <StepsPage /> },
  { path: "/components/table", element: <TablePage /> },
  { path: "/components/tabs", element: <TabsPage /> },
  { path: "/components/timeline", element: <TimelinePage /> },
  { path: "/components/tracker", element: <TrackerPage /> },
  { path: "/components/typography", element: <TypographyPage /> },
];
