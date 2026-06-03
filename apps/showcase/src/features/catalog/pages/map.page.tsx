import { LeafletMap } from "@/components/common/map/leaflet-map";
import { CatalogPageShell } from "@/features/catalog/ui/catalog-page-shell";
import { ShowcaseSection } from "@/features/catalog/ui/showcase-section";

export function MapPage() {
  return (
    <CatalogPageShell slug="map">
      <ShowcaseSection title="Leaflet map" className="w-full">
        <div className="h-80 w-full overflow-hidden rounded-xl border">
          <LeafletMap
            tileUrl="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            className="size-full"
          />
        </div>
      </ShowcaseSection>
      <ShowcaseSection title="Taller viewport" delay={0.05} className="w-full">
        <div className="h-96 w-full overflow-hidden rounded-xl border">
          <LeafletMap
            tileUrl="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            className="size-full"
            zoom={10}
          />
        </div>
      </ShowcaseSection>
    </CatalogPageShell>
  );
}
