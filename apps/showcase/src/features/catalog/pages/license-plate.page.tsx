import { useState } from "react";
import PlateInput from "@/components/compound/license-plate";
import type { PlateValue } from "@/components/compound/license-plate/types";
import { useShowcasePage } from "@/features/catalog/i18n";
import { CatalogPageShell } from "@/features/catalog/ui/catalog-page-shell";
import { ShowcaseSection } from "@/features/catalog/ui/showcase-section";

export function LicensePlatePage() {
  const p = useShowcasePage("license-plate");
  const [car, setCar] = useState<PlateValue | undefined>(undefined);
  const [motor, setMotor] = useState<PlateValue | undefined>(undefined);
  const [clearCar, setClearCar] = useState(false);
  const [clearMotor, setClearMotor] = useState(false);

  return (
    <CatalogPageShell slug="license-plate">
      <ShowcaseSection
        title={p("carPlate.title")}
        description={p("carPlate.description")}
      >
        <PlateInput
          variant="car"
          value={car}
          clear={clearCar}
          setClear={setClearCar}
          onChange={setCar}
          className={{ root: "max-w-md" }}
        />
      </ShowcaseSection>
      <ShowcaseSection title={p("motorcycle.title")} delay={0.05}>
        <PlateInput
          variant="motorcycle"
          value={motor}
          clear={clearMotor}
          setClear={setClearMotor}
          onChange={setMotor}
          className={{ root: "max-w-md" }}
        />
      </ShowcaseSection>
      <ShowcaseSection title={p("simpleText.title")} delay={0.1}>
        <PlateInput variant="simple" className={{ root: "max-w-xs" }} />
      </ShowcaseSection>
    </CatalogPageShell>
  );
}
