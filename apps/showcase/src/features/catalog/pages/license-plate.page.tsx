import { useState } from "react";
import PlateInput from "@/components/compound/license-plate";
import type { PlateValue } from "@/components/compound/license-plate/types";
import { CatalogPageShell } from "@/features/catalog/ui/catalog-page-shell";
import { ShowcaseSection } from "@/features/catalog/ui/showcase-section";

export function LicensePlatePage() {
  const [car, setCar] = useState<PlateValue | undefined>(undefined);
  const [motor, setMotor] = useState<PlateValue | undefined>(undefined);
  const [clearCar, setClearCar] = useState(false);
  const [clearMotor, setClearMotor] = useState(false);

  return (
    <CatalogPageShell slug="license-plate">
      <ShowcaseSection title="Car plate" description="PlateInput variant=&quot;car&quot;.">
        <PlateInput
          variant="car"
          value={car}
          clear={clearCar}
          setClear={setClearCar}
          onChange={setCar}
          className={{ root: "max-w-md" }}
        />
      </ShowcaseSection>
      <ShowcaseSection title="Motorcycle" delay={0.05}>
        <PlateInput
          variant="motorcycle"
          value={motor}
          clear={clearMotor}
          setClear={setClearMotor}
          onChange={setMotor}
          className={{ root: "max-w-md" }}
        />
      </ShowcaseSection>
      <ShowcaseSection title="Simple text" delay={0.1}>
        <PlateInput variant="simple" className={{ root: "max-w-xs" }} />
      </ShowcaseSection>
    </CatalogPageShell>
  );
}
