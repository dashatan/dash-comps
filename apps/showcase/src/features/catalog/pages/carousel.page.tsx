import { Carousel } from "@/components/common/carousel/carousel";
import { CatalogPageShell } from "@/features/catalog/ui/catalog-page-shell";
import { ShowcaseSection } from "@/features/catalog/ui/showcase-section";

export function CarouselPage() {
  return (
    <CatalogPageShell slug="carousel">
      <ShowcaseSection title="Slides" className="w-full">
        <Carousel
          className="max-w-lg"
          slides={[1, 2, 3].map((n) => (
            <div
              key={n}
              className="bg-muted flex h-36 items-center justify-center rounded-xl text-lg font-medium"
            >
              Slide {n}
            </div>
          ))}
        />
      </ShowcaseSection>
    </CatalogPageShell>
  );
}
