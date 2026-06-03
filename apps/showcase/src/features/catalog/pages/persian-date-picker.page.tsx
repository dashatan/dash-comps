import { useState } from "react";
import PersianDatePicker from "@/components/compound/persian-date-picker";
import { CatalogPageShell } from "@/features/catalog/ui/catalog-page-shell";
import { ShowcaseSection } from "@/features/catalog/ui/showcase-section";

export function PersianDatePickerPage() {
  const [date, setDate] = useState<number | undefined>(undefined);
  const [range, setRange] = useState<number | undefined>(undefined);

  return (
    <CatalogPageShell slug="persian-date-picker">
      <ShowcaseSection title="Single date">
        <PersianDatePicker value={date} onChange={setDate} />
      </ShowcaseSection>
      <ShowcaseSection title="With time" delay={0.05}>
        <PersianDatePicker value={range} onChange={setRange} withTime />
      </ShowcaseSection>
    </CatalogPageShell>
  );
}
