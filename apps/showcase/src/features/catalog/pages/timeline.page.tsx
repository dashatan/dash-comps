import Timeline from "@/components/common/timeline";
import { useShowcasePage } from "@/features/catalog/i18n";
import { CatalogPageShell } from "@/features/catalog/ui/catalog-page-shell";
import { ShowcaseSection } from "@/features/catalog/ui/showcase-section";

export function TimelinePage() {
  const p = useShowcasePage("timeline");

  return (
    <CatalogPageShell slug="timeline">
      <ShowcaseSection
        title={p("eventList.title")}
        description={p("eventList.description")}
        layout="stack"
      >
        <Timeline
          items={[
            { title: p("eventList.events.orderPlaced"), time: "09:00" },
            { title: p("eventList.events.shipped"), time: "14:30" },
            { title: p("eventList.events.delivered"), time: "18:00" },
          ]}
        />
      </ShowcaseSection>

      <ShowcaseSection
        title={p("descriptions.title")}
        description={p("descriptions.description")}
        layout="stack"
      >
        <Timeline
          items={[
            {
              time: p("descriptions.items.morning.time"),
              title: p("descriptions.items.morning.title"),
              description: p("descriptions.items.morning.description"),
            },
            {
              time: p("descriptions.items.afternoon.time"),
              title: p("descriptions.items.afternoon.title"),
              description: p("descriptions.items.afternoon.description"),
            },
            {
              time: p("descriptions.items.evening.time"),
              title: p("descriptions.items.evening.title"),
              description: p("descriptions.items.evening.description"),
            },
          ]}
        />
      </ShowcaseSection>

      <ShowcaseSection
        title={p("changes.title")}
        description={p("changes.description")}
        layout="stack"
      >
        <Timeline
          items={[
            {
              title: p("changes.items.design.title"),
              description: p("changes.items.design.description"),
              changes: [
                p("changes.items.design.changes.0"),
                p("changes.items.design.changes.1"),
                p("changes.items.design.changes.2"),
              ],
            },
            {
              title: p("changes.items.engineering.title"),
              description: p("changes.items.engineering.description"),
              changes: [
                p("changes.items.engineering.changes.0"),
                p("changes.items.engineering.changes.1"),
              ],
            },
          ]}
        />
      </ShowcaseSection>

      <ShowcaseSection
        title={p("versionReleases.title")}
        description={p("versionReleases.description")}
        layout="stack"
      >
        <Timeline
          items={[
            {
              time: p("versionReleases.items.v240.time"),
              version: p("versionReleases.items.v240.version"),
              title: p("versionReleases.items.v240.title"),
              description: p("versionReleases.items.v240.description"),
              changes: [
                p("versionReleases.items.v240.changes.0"),
                p("versionReleases.items.v240.changes.1"),
              ],
            },
            {
              time: p("versionReleases.items.v230.time"),
              version: p("versionReleases.items.v230.version"),
              title: p("versionReleases.items.v230.title"),
              description: p("versionReleases.items.v230.description"),
              changes: [p("versionReleases.items.v230.changes.0")],
            },
          ]}
        />
      </ShowcaseSection>

      <ShowcaseSection
        title={p("withImages.title")}
        description={p("withImages.description")}
        layout="stack"
      >
        <Timeline
          items={[
            {
              time: p("withImages.items.launch.time"),
              title: p("withImages.items.launch.title"),
              description: p("withImages.items.launch.description"),
              image: "/carousel/banner-release.jpg",
              imageAlt: p("withImages.items.launch.imageAlt"),
            },
            {
              time: p("withImages.items.event.time"),
              title: p("withImages.items.event.title"),
              description: p("withImages.items.event.description"),
              image: "/carousel/banner-event.jpg",
              imageAlt: p("withImages.items.event.imageAlt"),
            },
          ]}
        />
      </ShowcaseSection>

      <ShowcaseSection
        title={p("titleOnly.title")}
        description={p("titleOnly.description")}
        layout="stack"
      >
        <Timeline
          items={[
            { title: p("titleOnly.items.0") },
            { title: p("titleOnly.items.1") },
            { title: p("titleOnly.items.2") },
          ]}
        />
      </ShowcaseSection>

      <ShowcaseSection
        title={p("singleItem.title")}
        description={p("singleItem.description")}
        layout="stack"
      >
        <Timeline
          items={[
            {
              time: p("singleItem.time"),
              title: p("singleItem.titleText"),
              description: p("singleItem.descriptionText"),
            },
          ]}
        />
      </ShowcaseSection>

      <ShowcaseSection
        title={p("mixed.title")}
        description={p("mixed.description")}
        layout="stack"
      >
        <Timeline
          items={[
            {
              time: p("mixed.items.placed.time"),
              title: p("mixed.items.placed.title"),
            },
            {
              time: p("mixed.items.shipped.time"),
              title: p("mixed.items.shipped.title"),
              description: p("mixed.items.shipped.description"),
            },
            {
              version: p("mixed.items.release.version"),
              title: p("mixed.items.release.title"),
              description: p("mixed.items.release.description"),
              changes: [
                p("mixed.items.release.changes.0"),
                p("mixed.items.release.changes.1"),
              ],
            },
          ]}
        />
      </ShowcaseSection>
    </CatalogPageShell>
  );
}
