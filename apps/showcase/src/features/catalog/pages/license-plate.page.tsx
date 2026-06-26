import { useState, type ReactNode } from "react";
import PlateInput from "@/components/compound/license-plate";
import PlateCard from "@/components/compound/license-plate/components/plate-card";
import type { PlateValue } from "@/components/compound/license-plate/types";
import { useShowcasePage } from "@/features/catalog/i18n";
import { CatalogPageShell } from "@/features/catalog/ui/catalog-page-shell";
import { ShowcaseSection } from "@/features/catalog/ui/showcase-section";
import { cn } from "@/lib";

const CAR_PLATE_WIDTH = 280;
const PLATE_MAX_WIDTH = 300;
const MOTORCYCLE_PLATE_WIDTH = 120;

const STANDARD_CAR_PLATE: PlateValue = {
  p1: "1",
  p2: "2",
  p3: "ب",
  p4: "3",
  p5: "4",
  p6: "5",
  p7: "6",
  p8: "7",
};

const MOTORCYCLE_PLATE: PlateValue = {
  p1: "1",
  p2: "2",
  p3: "3",
  p4: "4",
  p5: "5",
  p6: "6",
  p7: "7",
  p8: "8",
};

const PROTOCOL_PLATE: PlateValue = {
  p1: "1",
  p2: "2",
  p3: "3",
  p4: "4",
};

const SIMPLE_PLATE: PlateValue = {
  p1: "1",
  p2: "2",
  p3: "ب",
  p4: "3",
  p5: "4",
  p6: "5",
  p7: "6",
  p8: "7",
};

const SPECIAL_LETTER_KEYS = [
  "protocol",
  "police",
  "taxi",
  "policeSepah",
  "navy",
  "army",
  "general",
  "agriculture",
  "serviceD",
  "serviceS",
] as const;

type SpecialLetterKey = (typeof SPECIAL_LETTER_KEYS)[number];

const specialLetterValues: Record<SpecialLetterKey, PlateValue> = {
  protocol: { ...STANDARD_CAR_PLATE, p3: "الف" },
  police: { ...STANDARD_CAR_PLATE, p3: "پ" },
  taxi: { ...STANDARD_CAR_PLATE, p3: "ت" },
  policeSepah: { ...STANDARD_CAR_PLATE, p3: "ث" },
  navy: { ...STANDARD_CAR_PLATE, p3: "ز" },
  army: { ...STANDARD_CAR_PLATE, p3: "ش" },
  general: { ...STANDARD_CAR_PLATE, p3: "ع" },
  agriculture: { ...STANDARD_CAR_PLATE, p3: "ک" },
  serviceD: { ...STANDARD_CAR_PLATE, p3: "D" },
  serviceS: { ...STANDARD_CAR_PLATE, p3: "S" },
};

function ShowcaseRow({
  label,
  children,
  className,
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex min-w-0 flex-col gap-2", className)}>
      <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
        {label}
      </p>
      {children}
    </div>
  );
}

function ValuePreview({ value }: { value: PlateValue | undefined }) {
  return (
    <pre className="w-full overflow-x-auto rounded-lg border border-border bg-muted/50 p-3 text-xs">
      {JSON.stringify(value ?? null, null, 2)}
    </pre>
  );
}

export function LicensePlatePage() {
  const p = useShowcasePage("license-plate");

  const [car, setCar] = useState<PlateValue | undefined>(undefined);
  const [motor, setMotor] = useState<PlateValue | undefined>(undefined);
  const [protocol, setProtocol] = useState<PlateValue | undefined>(undefined);
  const [simple, setSimple] = useState<PlateValue | undefined>(undefined);
  const [clearable, setClearable] = useState<PlateValue | undefined>(
    STANDARD_CAR_PLATE,
  );

  return (
    <CatalogPageShell slug="license-plate">
      <ShowcaseSection
        title={p("variants.title")}
        description={p("variants.description")}
        layout="stack"
      >
        <div className="grid w-full gap-6 lg:grid-cols-2">
          <ShowcaseRow label={p("variants.car")}>
            <PlateInput
              variant="car"
              value={car}
              onChange={setCar}
              width={CAR_PLATE_WIDTH}
            />
          </ShowcaseRow>
          <ShowcaseRow label={p("variants.motorcycle")}>
            <PlateInput
              variant="motorcycle"
              value={motor}
              onChange={setMotor}
              width={MOTORCYCLE_PLATE_WIDTH}
            />
          </ShowcaseRow>
          <ShowcaseRow label={p("variants.protocol")}>
            <PlateInput
              variant="protocol"
              value={protocol}
              onChange={setProtocol}
              width={PLATE_MAX_WIDTH}
            />
          </ShowcaseRow>
          <ShowcaseRow label={p("variants.simple")}>
            <PlateInput
              variant="simple"
              value={simple}
              onChange={setSimple}
              width={PLATE_MAX_WIDTH}
            />
          </ShowcaseRow>
        </div>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("letterColors.title")}
        description={p("letterColors.description")}
        delay={0.05}
        layout="stack"
      >
        <div className="grid w-full gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {SPECIAL_LETTER_KEYS.map((key) => (
            <ShowcaseRow key={key} label={p(`letterColors.samples.${key}`)}>
              <PlateInput
                variant="car"
                value={specialLetterValues[key]}
                readonly
                width={CAR_PLATE_WIDTH}
              />
            </ShowcaseRow>
          ))}
        </div>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("states.title")}
        description={p("states.description")}
        delay={0.1}
        layout="stack"
      >
        <div className="grid w-full gap-4 md:grid-cols-2">
          <ShowcaseRow label={p("states.empty")}>
            <PlateInput variant="car" width={CAR_PLATE_WIDTH} />
          </ShowcaseRow>
          <ShowcaseRow label={p("states.prefilled")}>
            <PlateInput
              variant="car"
              value={STANDARD_CAR_PLATE}
              readonly
              width={CAR_PLATE_WIDTH}
            />
          </ShowcaseRow>
          <ShowcaseRow label={p("states.disabled")}>
            <PlateInput
              variant="car"
              value={STANDARD_CAR_PLATE}
              disabled
              width={CAR_PLATE_WIDTH}
            />
          </ShowcaseRow>
          <ShowcaseRow label={p("states.readonly")}>
            <PlateInput
              variant="car"
              value={STANDARD_CAR_PLATE}
              readonly
              width={CAR_PLATE_WIDTH}
            />
          </ShowcaseRow>
          <ShowcaseRow label={p("states.error")}>
            <PlateInput
              variant="car"
              value={{ p1: "9", p2: "9" }}
              errorMessage={p("states.errorMessage")}
              width={CAR_PLATE_WIDTH}
            />
          </ShowcaseRow>
          <ShowcaseRow label={p("states.motorcyclePrefilled")}>
            <PlateInput
              variant="motorcycle"
              value={MOTORCYCLE_PLATE}
              readonly
              width={MOTORCYCLE_PLATE_WIDTH}
            />
          </ShowcaseRow>
          <ShowcaseRow label={p("states.protocolPrefilled")}>
            <PlateInput
              variant="protocol"
              value={PROTOCOL_PLATE}
              readonly
              width={PLATE_MAX_WIDTH}
            />
          </ShowcaseRow>
          <ShowcaseRow label={p("states.simplePrefilled")}>
            <PlateInput
              variant="simple"
              value={SIMPLE_PLATE}
              readonly
              width={PLATE_MAX_WIDTH}
            />
          </ShowcaseRow>
        </div>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("formFields.title")}
        description={p("formFields.description")}
        delay={0.15}
        layout="stack"
      >
        <div className="grid w-full gap-4 md:grid-cols-2">
          <ShowcaseRow label={p("formFields.labelRequired")}>
            <PlateInput
              variant="car"
              label={p("formFields.plateLabel")}
              required
              width={CAR_PLATE_WIDTH}
            />
          </ShowcaseRow>
          <ShowcaseRow label={p("formFields.helperText")}>
            <PlateInput
              variant="car"
              label={p("formFields.plateLabel")}
              helperText={p("formFields.helperHint")}
              width={CAR_PLATE_WIDTH}
            />
          </ShowcaseRow>
          <ShowcaseRow label={p("formFields.withClear")}>
            <PlateInput
              variant="car"
              label={p("formFields.plateLabel")}
              withClear
              value={clearable}
              onChange={setClearable}
              width={CAR_PLATE_WIDTH}
            />
          </ShowcaseRow>
          <ShowcaseRow label={p("formFields.validationError")}>
            <PlateInput
              variant="car"
              label={p("formFields.plateLabel")}
              required
              errorMessage={p("formFields.validationMessage")}
              width={CAR_PLATE_WIDTH}
            />
          </ShowcaseRow>
        </div>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("widths.title")}
        description={p("widths.description")}
        delay={0.2}
        layout="stack"
      >
        <div className="grid w-full gap-4 md:grid-cols-3">
          <ShowcaseRow label={p("widths.compact")}>
            <PlateInput
              variant="car"
              value={STANDARD_CAR_PLATE}
              readonly
              width={240}
            />
          </ShowcaseRow>
          <ShowcaseRow label={p("widths.default")}>
            <PlateInput
              variant="car"
              value={STANDARD_CAR_PLATE}
              readonly
              width={280}
            />
          </ShowcaseRow>
          <ShowcaseRow label={p("widths.wide")}>
            <PlateInput
              variant="car"
              value={STANDARD_CAR_PLATE}
              readonly
              width={PLATE_MAX_WIDTH}
            />
          </ShowcaseRow>
        </div>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("plateCard.title")}
        description={p("plateCard.description")}
        delay={0.25}
        layout="stack"
      >
        <div className="flex w-full flex-wrap items-center gap-4">
          <PlateCard value={STANDARD_CAR_PLATE} />
          <PlateCard value={specialLetterValues.taxi} />
          <PlateCard value={specialLetterValues.police} />
          <PlateCard value={specialLetterValues.protocol} />
        </div>
        <p className="text-sm text-muted-foreground">{p("plateCard.hint")}</p>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("controlled.title")}
        description={p("controlled.description")}
        delay={0.3}
        layout="stack"
      >
        <PlateInput
          variant="car"
          label={p("controlled.label")}
          helperText={p("controlled.helper")}
          value={car}
          onChange={setCar}
          withClear
          width={CAR_PLATE_WIDTH}
        />
        <ShowcaseRow label={p("controlled.output")}>
          <ValuePreview value={car} />
        </ShowcaseRow>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("clipboard.title")}
        description={p("clipboard.description")}
        delay={0.35}
        layout="stack"
      >
        <PlateInput
          variant="car"
          value={STANDARD_CAR_PLATE}
          width={CAR_PLATE_WIDTH}
        />
        <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
          <li>{p("clipboard.hover")}</li>
          <li>{p("clipboard.copyShortcut")}</li>
          <li>{p("clipboard.pasteShortcut")}</li>
        </ul>
      </ShowcaseSection>
    </CatalogPageShell>
  );
}
