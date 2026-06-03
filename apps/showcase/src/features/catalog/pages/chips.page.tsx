import { useState } from "react";
import { CatalogPageShell } from "@/features/catalog/ui/catalog-page-shell";
import { ShowcaseSection } from "@/features/catalog/ui/showcase-section";
import Chip from "@/components/common/chips/chip";

export function ChipsPage() {
  const [tags, setTags] = useState(["React", "Tailwind", "Motion"]);

  return (
    <CatalogPageShell slug="chips">
      <ShowcaseSection title="Basic chips">
        <Chip label="Default" />
        <Chip label="Active" className="bg-primary/15 text-primary" />
        <Chip label="Muted" className="bg-muted" />
      </ShowcaseSection>

      <ShowcaseSection title="Removable tags" delay={0.05}>
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

      <ShowcaseSection title="Custom content" delay={0.1}>
        <Chip>
          <span className="font-medium">Custom</span>
          <span className="text-muted-foreground"> · slot content</span>
        </Chip>
      </ShowcaseSection>
    </CatalogPageShell>
  );
}
