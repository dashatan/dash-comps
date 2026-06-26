import { useCallback, useMemo, useState, type ReactNode } from "react";
import { Button } from "@/components/common/buttons";
import {
  createDestinationIcon,
  createDeviceIcon,
  createOriginIcon,
  LeafletMap,
  MapClickPlacement,
  MapDeviceCluster,
  MapFitBounds,
  MapGeoSearch,
  MapGeomanControls,
  MapPolyline,
  MapZoomControls,
  Markers,
  type GeomanCreateEvent,
} from "@/components/common/map";
import {
  COUNTRY_PRESETS,
  GLOBAL_CITY_MARKERS,
  MAP_TILE_DARK,
  MAP_TILE_LIGHT,
  NOMINATIM_URL,
  ROUTE_DESTINATION,
  ROUTE_ORIGIN,
  ROUTE_POLYLINE,
  TEHRAN_DEVICES,
  type CountryPreset,
  type ShowcaseCityMarker,
} from "@/features/catalog/data/map-samples";
import { useShowcasePage } from "@/features/catalog/i18n";
import { CatalogPageShell } from "@/features/catalog/ui/catalog-page-shell";
import { ShowcaseSection } from "@/features/catalog/ui/showcase-section";
import { cn } from "@/lib";

function ShowcaseRow({
  label,
  description,
  children,
  className,
}: {
  label: string;
  description?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex min-w-0 flex-col gap-2", className)}>
      <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
        {label}
      </p>
      {description ? (
        <p className="text-xs text-muted-foreground/80">{description}</p>
      ) : null}
      {children}
    </div>
  );
}

function MapFrame({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "w-full overflow-hidden rounded-xl border border-border bg-muted/10",
        className,
      )}
    >
      {children}
    </div>
  );
}

function CountryMap({
  preset,
  label,
}: {
  preset: CountryPreset;
  label: string;
}) {
  return (
    <ShowcaseRow label={label}>
      <MapFrame className="h-64">
        <LeafletMap
          tileUrl={MAP_TILE_LIGHT}
          center={preset.center}
          zoom={preset.zoom}
          className="size-full"
        />
      </MapFrame>
    </ShowcaseRow>
  );
}

function MarkersDemo({
  cluster,
  label,
  selectedKey,
  onSelect,
  selectHint,
}: {
  cluster: boolean;
  label: string;
  selectedKey: string | null;
  onSelect: (id: string) => void;
  selectHint: string;
}) {
  const deviceIcon = useMemo(() => createDeviceIcon(), []);

  return (
    <ShowcaseRow label={label} description={selectHint}>
      <MapFrame className="h-80">
        <LeafletMap
          tileUrl={MAP_TILE_LIGHT}
          center={[30, 10]}
          zoom={2}
          minZoom={2}
          zoomControl={false}
          className="size-full p-4"
        >
          <MapZoomControls />
          <Markers<ShowcaseCityMarker>
            data={GLOBAL_CITY_MARKERS}
            icon={deviceIcon}
            cluster={cluster}
            selectedKey={selectedKey}
            getItemKey={(item) => item.id}
            selectionMinZoom={5}
            tooltipTitle={(item) => item.name}
            tooltipItems={(item) => [
              { icon: "map-pin", name: "Country", value: item.country },
              {
                icon: "users",
                name: "Population",
                value: item.population.toLocaleString(),
              },
            ]}
            popupTitle={(item) => item.name}
            popupItems={(item) => [
              {
                icon: "map-pin",
                name: "Coordinates",
                value: `${item.lat}, ${item.long}`,
              },
            ]}
            onMarkerClick={(item) => onSelect(item.id)}
          />
        </LeafletMap>
      </MapFrame>
    </ShowcaseRow>
  );
}

function GeomanDemo({ lastShapeLabel }: { lastShapeLabel: string }) {
  const [lastShape, setLastShape] = useState<GeomanCreateEvent | null>(null);

  const handleCreate = useCallback((event: GeomanCreateEvent) => {
    setLastShape(event);
  }, []);

  return (
    <div className="flex min-w-0 flex-col gap-3">
      <MapFrame className="h-96">
        <LeafletMap
          tileUrl={MAP_TILE_LIGHT}
          center={[35.6892, 51.389]}
          zoom={11}
          pmIgnore={false}
          zoomControl={false}
          className="size-full p-4"
        >
          <MapZoomControls />
          <MapGeomanControls
            shapes={["Polygon", "Rectangle"]}
            drawPathOptions={{ color: "var(--color-primary)" }}
            onCreate={handleCreate}
          />
        </LeafletMap>
      </MapFrame>
      <ShowcaseRow label={lastShapeLabel}>
        <pre className="w-full overflow-x-auto rounded-lg border border-border bg-muted/50 p-3 text-xs">
          {lastShape
            ? JSON.stringify(
                {
                  shape: lastShape.shape,
                  pointCount: lastShape.polygon.length,
                  polygon: lastShape.polygon,
                },
                null,
                2,
              )
            : "—"}
        </pre>
      </ShowcaseRow>
    </div>
  );
}

function ClickPlacementDemo({
  activateLabel,
  placedLabel,
  idleLabel,
}: {
  activateLabel: string;
  placedLabel: (coords: string) => string;
  idleLabel: string;
}) {
  const [active, setActive] = useState(false);
  const [placed, setPlaced] = useState<Point | null>(null);
  const originIcon = useMemo(() => createOriginIcon(), []);

  const handlePlace = useCallback((position: Point) => {
    setPlaced(position);
    setActive(false);
  }, []);

  return (
    <div className="flex min-w-0 flex-col gap-3">
      <div className="flex flex-wrap items-center gap-3">
        <Button
          variant={active ? "contained" : "outlined"}
          size="sm"
          onClick={() => setActive((value) => !value)}
        >
          {activateLabel}
        </Button>
        <p className="text-sm text-muted-foreground">
          {placed
            ? placedLabel(`${placed[0].toFixed(4)}, ${placed[1].toFixed(4)}`)
            : idleLabel}
        </p>
      </div>
      <MapFrame className="h-80">
        <LeafletMap
          tileUrl={MAP_TILE_LIGHT}
          center={[48.8566, 2.3522]}
          zoom={12}
          zoomControl={false}
          className="size-full p-4"
        >
          <MapZoomControls />
          <MapClickPlacement
            active={active}
            icon={originIcon}
            onPlace={handlePlace}
          />
        </LeafletMap>
      </MapFrame>
    </div>
  );
}

function CenterTrackingDemo({
  coordsLabel,
}: {
  coordsLabel: (coords: string) => string;
}) {
  const [center, setCenter] = useState<Point>([35.6892, 51.389]);

  return (
    <div className="flex min-w-0 flex-col gap-3">
      <p className="text-sm text-muted-foreground">
        {coordsLabel(`${center[0].toFixed(4)}, ${center[1].toFixed(4)}`)}
      </p>
      <MapFrame className="h-80">
        <LeafletMap
          tileUrl={MAP_TILE_LIGHT}
          center={center}
          zoom={11}
          className="size-full"
          onCenterChange={setCenter}
        />
      </MapFrame>
    </div>
  );
}

export function MapPage() {
  const p = useShowcasePage("map");
  const [selectedMarkerId, setSelectedMarkerId] = useState<string | null>(
    "tehran",
  );
  const deviceIcon = useMemo(() => createDeviceIcon(), []);
  const originIcon = useMemo(() => createOriginIcon(), []);
  const destinationIcon = useMemo(() => createDestinationIcon(), []);

  return (
    <CatalogPageShell slug="map">
      <ShowcaseSection
        title={p("countries.title")}
        description={p("countries.description")}
        layout="stack"
      >
        <div className="grid w-full gap-4 md:grid-cols-2 xl:grid-cols-3">
          {COUNTRY_PRESETS.map((preset) => (
            <CountryMap
              key={preset.id}
              preset={preset}
              label={p(`countries.${preset.id}`)}
            />
          ))}
        </div>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("zoomLevels.title")}
        description={p("zoomLevels.description")}
        layout="stack"
      >
        <div className="grid w-full gap-4 md:grid-cols-3">
          <ShowcaseRow label={p("zoomLevels.continent")}>
            <MapFrame className="h-64">
              <LeafletMap
                tileUrl={MAP_TILE_LIGHT}
                center={[35.6892, 51.389]}
                zoom={4}
                className="size-full"
              />
            </MapFrame>
          </ShowcaseRow>
          <ShowcaseRow label={p("zoomLevels.country")}>
            <MapFrame className="h-64">
              <LeafletMap
                tileUrl={MAP_TILE_LIGHT}
                center={[35.6892, 51.389]}
                zoom={6}
                className="size-full"
              />
            </MapFrame>
          </ShowcaseRow>
          <ShowcaseRow label={p("zoomLevels.city")}>
            <MapFrame className="h-64">
              <LeafletMap
                tileUrl={MAP_TILE_LIGHT}
                center={[35.6892, 51.389]}
                zoom={12}
                className="size-full"
              />
            </MapFrame>
          </ShowcaseRow>
        </div>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("tileThemes.title")}
        description={p("tileThemes.description")}
        layout="stack"
      >
        <div className="grid w-full gap-4 md:grid-cols-2">
          <ShowcaseRow label={p("tileThemes.light")}>
            <MapFrame className="h-72">
              <LeafletMap
                tileUrl={MAP_TILE_LIGHT}
                center={[40.7128, -74.006]}
                zoom={11}
                className="size-full"
              />
            </MapFrame>
          </ShowcaseRow>
          <ShowcaseRow label={p("tileThemes.dark")}>
            <MapFrame className="h-72">
              <LeafletMap
                tileUrl={MAP_TILE_DARK}
                center={[40.7128, -74.006]}
                zoom={11}
                className="size-full"
              />
            </MapFrame>
          </ShowcaseRow>
        </div>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("zoomControls.title")}
        description={p("zoomControls.description")}
        layout="stack"
      >
        <div className="grid w-full gap-4 md:grid-cols-2">
          <ShowcaseRow label={p("zoomControls.leaflet")}>
            <MapFrame className="h-72">
              <LeafletMap
                tileUrl={MAP_TILE_LIGHT}
                center={[51.5074, -0.1278]}
                zoom={11}
                zoomControl
                className="size-full"
              />
            </MapFrame>
          </ShowcaseRow>
          <ShowcaseRow label={p("zoomControls.custom")}>
            <MapFrame className="h-72">
              <LeafletMap
                tileUrl={MAP_TILE_LIGHT}
                center={[51.5074, -0.1278]}
                zoom={11}
                zoomControl={false}
                className="size-full p-4"
              >
                <MapZoomControls />
              </LeafletMap>
            </MapFrame>
          </ShowcaseRow>
        </div>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("geoSearch.title")}
        description={p("geoSearch.description")}
        layout="stack"
      >
        <MapFrame className="h-96">
          <LeafletMap
            tileUrl={MAP_TILE_LIGHT}
            center={[35.6762, 139.6503]}
            zoom={10}
            zoomControl={false}
            className="size-full p-4"
          >
            <MapZoomControls />
            <MapGeoSearch
              nominatimUrl={NOMINATIM_URL}
              searchLabel={p("geoSearch.searchLabel")}
              acceptLanguage="en"
            />
          </LeafletMap>
        </MapFrame>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("markers.title")}
        description={p("markers.description")}
        layout="stack"
      >
        <div className="grid w-full gap-4 lg:grid-cols-2">
          <MarkersDemo
            cluster
            label={p("markers.clustered")}
            selectedKey={selectedMarkerId}
            onSelect={setSelectedMarkerId}
            selectHint={p("markers.selectHint")}
          />
          <MarkersDemo
            cluster={false}
            label={p("markers.flat")}
            selectedKey={selectedMarkerId}
            onSelect={setSelectedMarkerId}
            selectHint={p("markers.selectHint")}
          />
        </div>
        <p className="text-sm text-muted-foreground">
          {p("markers.selected")}: {selectedMarkerId ?? "—"}
        </p>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("deviceCluster.title")}
        description={p("deviceCluster.description")}
        layout="stack"
      >
        <MapFrame className="h-96">
          <LeafletMap
            tileUrl={MAP_TILE_LIGHT}
            center={[35.72, 51.41]}
            zoom={11}
            zoomControl={false}
            className="size-full p-4"
          >
            <MapZoomControls />
            <MapDeviceCluster devices={[...TEHRAN_DEVICES]} icon={deviceIcon} />
          </LeafletMap>
        </MapFrame>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("geoman.title")}
        description={p("geoman.description")}
        layout="stack"
      >
        <GeomanDemo lastShapeLabel={p("geoman.lastShape")} />
      </ShowcaseSection>

      <ShowcaseSection
        title={p("clickPlacement.title")}
        description={p("clickPlacement.description")}
        layout="stack"
      >
        <ClickPlacementDemo
          activateLabel={p("clickPlacement.activate")}
          placedLabel={(coords) => p("clickPlacement.placed", { coords })}
          idleLabel={p("clickPlacement.idle")}
        />
      </ShowcaseSection>

      <ShowcaseSection
        title={p("route.title")}
        description={p("route.description")}
        layout="stack"
      >
        <MapFrame className="h-96">
          <LeafletMap
            tileUrl={MAP_TILE_LIGHT}
            center={ROUTE_ORIGIN}
            zoom={12}
            maxZoom={19}
            zoomControl={false}
            className="size-full p-4"
          >
            <MapZoomControls />
            <MapPolyline points={ROUTE_POLYLINE} className="stroke-primary" />
            <Markers
              data={[
                {
                  id: "origin",
                  lat: String(ROUTE_ORIGIN[0]),
                  long: String(ROUTE_ORIGIN[1]),
                },
                {
                  id: "destination",
                  lat: String(ROUTE_DESTINATION[0]),
                  long: String(ROUTE_DESTINATION[1]),
                },
              ]}
              icon={(item) =>
                item.id === "origin" ? originIcon : destinationIcon
              }
              cluster={false}
              getItemKey={(item) => item.id}
            />
            <MapFitBounds bounds={[ROUTE_ORIGIN, ROUTE_DESTINATION]} enabled />
          </LeafletMap>
        </MapFrame>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("centerTracking.title")}
        description={p("centerTracking.description")}
        layout="stack"
      >
        <CenterTrackingDemo
          coordsLabel={(coords) => p("centerTracking.coords", { coords })}
        />
      </ShowcaseSection>

      <ShowcaseSection
        title={p("viewports.title")}
        description={p("viewports.description")}
        layout="stack"
      >
        <div className="grid w-full gap-4">
          <ShowcaseRow label={p("viewports.short")}>
            <MapFrame className="h-64">
              <LeafletMap
                tileUrl={MAP_TILE_LIGHT}
                center={[25.2048, 55.2708]}
                zoom={11}
                className="size-full"
              />
            </MapFrame>
          </ShowcaseRow>
          <ShowcaseRow label={p("viewports.medium")}>
            <MapFrame className="h-80">
              <LeafletMap
                tileUrl={MAP_TILE_LIGHT}
                center={[25.2048, 55.2708]}
                zoom={11}
                className="size-full"
              />
            </MapFrame>
          </ShowcaseRow>
          <ShowcaseRow label={p("viewports.tall")}>
            <MapFrame className="h-96">
              <LeafletMap
                tileUrl={MAP_TILE_LIGHT}
                center={[25.2048, 55.2708]}
                zoom={11}
                className="size-full"
              />
            </MapFrame>
          </ShowcaseRow>
        </div>
      </ShowcaseSection>
    </CatalogPageShell>
  );
}
