import { useState } from "react";
import { Slider, RangeSlider } from "@/components/common/slider";
import { CatalogPageShell } from "@/features/catalog/ui/catalog-page-shell";
import { ShowcaseSection } from "@/features/catalog/ui/showcase-section";

export function SliderPage() {
  const [value, setValue] = useState([40]);
  const [range, setRange] = useState<[number, number]>([20, 70]);

  return (
    <CatalogPageShell slug="slider">
      <ShowcaseSection title="Single value">
        <div className="w-64 space-y-2">
          <Slider value={value} onValueChange={setValue} max={100} step={1} />
          <p className="text-muted-foreground text-sm">{value[0]}%</p>
        </div>
      </ShowcaseSection>
      <ShowcaseSection title="Range" delay={0.05}>
        <div className="w-64 space-y-2">
          <RangeSlider min={0} max={100} value={range} onChange={setRange} />
          <p className="text-muted-foreground text-sm">
            {range[0]} – {range[1]}
          </p>
        </div>
      </ShowcaseSection>
    </CatalogPageShell>
  );
}
