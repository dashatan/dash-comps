import { useState } from "react";
import { Button } from "@/components/common/buttons";
import FadeAble from "@/components/common/fadeable";
import { CatalogPageShell } from "@/features/catalog/ui/catalog-page-shell";
import { ShowcaseSection } from "@/features/catalog/ui/showcase-section";

export function FadeablePage() {
  const [show, setShow] = useState(true);

  return (
    <CatalogPageShell slug="fadeable">
      <ShowcaseSection title="Visibility toggle">
        <Button onClick={() => setShow((s) => !s)}>{show ? "Hide" : "Show"}</Button>
        <FadeAble isVisible={show} className="rounded-lg bg-primary/15 px-4 py-2 text-sm">
          Content fades in and out
        </FadeAble>
      </ShowcaseSection>
    </CatalogPageShell>
  );
}
