import { Carousel } from "@/components/common/carousel/carousel";
import { CatalogPageShell } from "@/features/catalog/ui/catalog-page-shell";
import { ShowcaseSection } from "@/features/catalog/ui/showcase-section";
import { useShowcasePage } from "@/features/catalog/i18n";

export function CarouselPage() {
  const p = useShowcasePage("carousel");

  return (
    <CatalogPageShell slug="carousel">
      <ShowcaseSection title={p("slides.title")} className="w-full">
        <Carousel
          className="max-w-lg"
          slides={[1, 2, 3].map((n) => (
            <div
              key={n}
              className="bg-muted flex h-36 items-center justify-center rounded-xl text-lg font-medium"
            >
              {p("slides.slide", { n })}
            </div>
          ))}
        />
      </ShowcaseSection>
    </CatalogPageShell>
  );
}
