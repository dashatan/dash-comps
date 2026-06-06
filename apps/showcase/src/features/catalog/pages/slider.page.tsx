import { useMemo, useState, type ReactNode } from "react";
import {
  RangeSlider,
  Slider,
  type RangeSliderStep,
} from "@/components/common/slider";
import { useShowcasePage } from "@/features/catalog/i18n";
import { CatalogPageShell } from "@/features/catalog/ui/catalog-page-shell";
import { ShowcaseSection } from "@/features/catalog/ui/showcase-section";

function ValueHint({ children }: { children: ReactNode }) {
  return <p className="text-muted-foreground text-sm">{children}</p>;
}

export function SliderPage() {
  const p = useShowcasePage("slider");
  const [value, setValue] = useState([40]);
  const [customRangeValue, setCustomRangeValue] = useState([50]);
  const [range, setRange] = useState<[number, number]>([20, 70]);
  const [stepRange, setStepRange] = useState<[number, number]>([0, 100]);
  const [customStepRange, setCustomStepRange] = useState<[number, number]>([
    0, 100,
  ]);
  const [gradientRange, setGradientRange] = useState<[number, number]>([
    25, 75,
  ]);
  const [hiddenLabelRange, setHiddenLabelRange] = useState<[number, number]>([
    20, 80,
  ]);
  const [colorRange, setColorRange] = useState<[number, number]>([30, 70]);
  const [priceRange, setPriceRange] = useState<[number, number]>([
    2500, 7500,
  ]);

  const customSteps = useMemo<RangeSliderStep[]>(
    () => [
      { value: 0, label: p("range.customSteps.labels.low") },
      { value: 25, label: p("range.customSteps.labels.medium") },
      { value: 50, label: p("range.customSteps.labels.high") },
      { value: 75, label: p("range.customSteps.labels.veryHigh") },
      { value: 100, label: p("range.customSteps.labels.max") },
    ],
    [p],
  );

  return (
    <CatalogPageShell slug="slider">
      <ShowcaseSection title={p("single.controlled.title")} layout="stack">
        <Slider value={value} onValueChange={setValue} max={100} step={1} />
        <ValueHint>{p("single.controlled.info", { value: value[0] })}</ValueHint>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("single.defaultValue.title")}
        description={p("single.defaultValue.description")}
        layout="stack"
      >
        <Slider defaultValue={[30]} max={100} step={1} />
      </ShowcaseSection>

      <ShowcaseSection title={p("single.disabled.title")} layout="stack">
        <Slider defaultValue={[60]} max={100} step={1} disabled />
      </ShowcaseSection>

      <ShowcaseSection
        title={p("single.customRange.title")}
        description={p("single.customRange.description")}
        layout="stack"
      >
        <Slider
          value={customRangeValue}
          onValueChange={setCustomRangeValue}
          min={0}
          max={200}
          step={25}
        />
        <ValueHint>
          {p("single.customRange.info", { value: customRangeValue[0] })}
        </ValueHint>
      </ShowcaseSection>

      <ShowcaseSection title={p("single.customStyles.title")} layout="stack">
        <Slider
          defaultValue={[55]}
          max={100}
          step={1}
          trackClassName="bg-violet-200"
          rangeClassName="bg-violet-600"
          thumbClassName="border-violet-600 bg-violet-600"
        />
      </ShowcaseSection>

      <ShowcaseSection title={p("range.basic.title")} layout="stack">
        <RangeSlider min={0} max={100} value={range} onChange={setRange} />
        <ValueHint>
          {p("range.basic.info", { min: range[0], max: range[1] })}
        </ValueHint>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("range.steps.title")}
        description={p("range.steps.description")}
        layout="stack"
      >
        <RangeSlider
          min={0}
          max={100}
          steps={5}
          value={stepRange}
          onChange={setStepRange}
        />
        <ValueHint>
          {p("range.steps.info", { min: stepRange[0], max: stepRange[1] })}
        </ValueHint>
      </ShowcaseSection>

      <ShowcaseSection title={p("range.customSteps.title")} layout="stack">
        <RangeSlider
          min={0}
          max={100}
          steps={customSteps}
          value={customStepRange}
          onChange={setCustomStepRange}
        />
        <ValueHint>
          {p("range.basic.info", {
            min: customStepRange[0],
            max: customStepRange[1],
          })}
        </ValueHint>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("range.gradient.title")}
        description={p("range.gradient.description")}
        layout="stack"
      >
        <RangeSlider
          min={0}
          max={100}
          value={gradientRange}
          onChange={setGradientRange}
          gradientColors={["#ef4444", "#f59e0b", "#22c55e"]}
        />
        <ValueHint>
          {p("range.basic.info", {
            min: gradientRange[0],
            max: gradientRange[1],
          })}
        </ValueHint>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("range.hiddenLabels.title")}
        description={p("range.hiddenLabels.description")}
        layout="stack"
      >
        <RangeSlider
          min={0}
          max={100}
          steps={6}
          showLabels={false}
          value={hiddenLabelRange}
          onChange={setHiddenLabelRange}
        />
        <ValueHint>
          {p("range.basic.info", {
            min: hiddenLabelRange[0],
            max: hiddenLabelRange[1],
          })}
        </ValueHint>
      </ShowcaseSection>

      <ShowcaseSection title={p("range.disabled.title")} layout="stack">
        <RangeSlider
          min={0}
          max={100}
          value={[35, 65]}
          onChange={() => undefined}
          disabled
        />
      </ShowcaseSection>

      <ShowcaseSection title={p("range.customColor.title")} layout="stack">
        <RangeSlider
          min={0}
          max={100}
          steps={5}
          color="#0ea5e9"
          value={colorRange}
          onChange={setColorRange}
        />
        <ValueHint>
          {p("range.basic.info", { min: colorRange[0], max: colorRange[1] })}
        </ValueHint>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("range.wideRange.title")}
        description={p("range.wideRange.description")}
        layout="stack"
      >
        <RangeSlider
          min={1000}
          max={10000}
          steps={10}
          value={priceRange}
          onChange={setPriceRange}
        />
        <ValueHint>
          {p("range.wideRange.info", {
            min: priceRange[0].toLocaleString(),
            max: priceRange[1].toLocaleString(),
          })}
        </ValueHint>
      </ShowcaseSection>
    </CatalogPageShell>
  );
}
