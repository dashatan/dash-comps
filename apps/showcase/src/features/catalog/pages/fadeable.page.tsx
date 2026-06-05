import { useState } from "react";
import { Button } from "@/components/common/buttons";
import FadeAble from "@/components/common/fadeable";
import { CatalogPageShell } from "@/features/catalog/ui/catalog-page-shell";
import { ShowcaseSection } from "@/features/catalog/ui/showcase-section";
import { useShowcasePage } from "@/features/catalog/i18n";

export function FadeablePage() {
  const p = useShowcasePage("fadeable");
  const [show, setShow] = useState(true);

  return (
    <CatalogPageShell slug="fadeable">
      <ShowcaseSection title={p("visibilityToggle.title")}>
        <Button onClick={() => setShow((s) => !s)}>
          {show ? p("visibilityToggle.hide") : p("visibilityToggle.show")}
        </Button>
        <FadeAble isVisible={show} className="rounded-lg bg-primary/15 px-4 py-2 text-sm">
          {p("visibilityToggle.content")}
        </FadeAble>
      </ShowcaseSection>
    </CatalogPageShell>
  );
}
