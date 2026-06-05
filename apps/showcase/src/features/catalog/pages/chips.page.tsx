import { useState } from "react";
import { CatalogPageShell } from "@/features/catalog/ui/catalog-page-shell";
import { ShowcaseSection } from "@/features/catalog/ui/showcase-section";
import { useShowcasePage } from "@/features/catalog/i18n";
import Chip from "@/components/common/chips/chip";

export function ChipsPage() {
  const p = useShowcasePage("chips");
  const [tags, setTags] = useState(["React", "Tailwind", "Motion"]);

  return (
    <CatalogPageShell slug="chips">
      <ShowcaseSection title={p("basic.title")}>
        <Chip label={p("basic.default")} />
        <Chip label={p("basic.active")} className="bg-primary/15 text-primary" />
        <Chip label={p("basic.muted")} className="bg-muted" />
      </ShowcaseSection>

      <ShowcaseSection title={p("removableTags.title")} delay={0.05}>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Chip
              key={tag}
              label={tag}
              onRemove={() => setTags((current) => current.filter((item) => item !== tag))}
            />
          ))}
        </div>
      </ShowcaseSection>

      <ShowcaseSection title={p("customContent.title")} delay={0.1}>
        <Chip>
          <span className="font-medium">{p("customContent.custom")}</span>
          <span className="text-muted-foreground">{p("customContent.slotContent")}</span>
        </Chip>
      </ShowcaseSection>
    </CatalogPageShell>
  );
}
