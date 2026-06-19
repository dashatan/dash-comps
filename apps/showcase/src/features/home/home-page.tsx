import { PageTransition } from "@/shared/motion/primitives";
import { catalogCategories } from "@/features/catalog/registry";
import { useShowcaseShell } from "@/features/catalog/i18n";
import {
  featuredCommonComponents,
  featuredCompoundComponents,
} from "@/features/home/data/featured-components";
import { HomeHero } from "@/features/home/ui/home-hero";
import { HomeSectionHeader } from "@/features/home/ui/home-section-header";
import { ShowcaseCard } from "@/features/home/ui/showcase-card";
import { CommonComponentPreview } from "@/features/home/ui/previews/common-previews";
import { CompoundComponentPreview } from "@/features/home/ui/previews/compound-previews";

function findCategory(slug: string) {
  return catalogCategories.find((category) => category.slug === slug);
}

export function HomePage() {
  const { home, categoryTitle, categoryDescription } = useShowcaseShell();

  return (
    <PageTransition className="flex w-full flex-col gap-16 pb-8 md:gap-20 md:pb-12">
      <HomeHero />

      <section aria-labelledby="compound-showcase-heading">
        <HomeSectionHeader
          eyebrow={home.compound.eyebrow}
          title={home.compound.title}
          description={home.compound.description}
          seeAllLabel={home.compound.seeAll}
          seeAllTo="/components"
          seeAllHash="compound"
        />

        <h2 id="compound-showcase-heading" className="sr-only">
          {home.compound.title}
        </h2>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featuredCompoundComponents.map((featured) => {
            const category = findCategory(featured.slug);
            if (!category) return null;

            return (
              <ShowcaseCard
                key={featured.slug}
                category={category}
                title={categoryTitle(featured.slug)}
                description={categoryDescription(featured.slug)}
                exploreLabel={home.card.explore}
                variantsLabel={home.card.variants(category.count)}
                preview={<CompoundComponentPreview slug={featured.slug} />}
                span={"span" in featured ? featured.span : undefined}
              />
            );
          })}
        </div>
      </section>

      <section aria-labelledby="common-showcase-heading">
        <HomeSectionHeader
          eyebrow={home.common.eyebrow}
          title={home.common.title}
          description={home.common.description}
          seeAllLabel={home.common.seeAll}
          seeAllTo="/components"
          seeAllHash="common"
        />

        <h2 id="common-showcase-heading" className="sr-only">
          {home.common.title}
        </h2>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featuredCommonComponents.map((featured) => {
            const category = findCategory(featured.slug);
            if (!category) return null;

            return (
              <ShowcaseCard
                key={featured.slug}
                category={category}
                title={categoryTitle(featured.slug)}
                description={categoryDescription(featured.slug)}
                exploreLabel={home.card.explore}
                variantsLabel={home.card.variants(category.count)}
                preview={<CommonComponentPreview slug={featured.slug} />}
                span={"span" in featured ? featured.span : undefined}
              />
            );
          })}
        </div>
      </section>
    </PageTransition>
  );
}
