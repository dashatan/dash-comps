import { useState } from "react";
import PersianDatePicker from "@/components/compound/persian-date-picker";
import { useShowcasePage } from "@/features/catalog/i18n";
import { CatalogPageShell } from "@/features/catalog/ui/catalog-page-shell";
import { ShowcaseSection } from "@/features/catalog/ui/showcase-section";

export function PersianDatePickerPage() {
  const p = useShowcasePage("persian-date-picker");
  const [date, setDate] = useState<number | undefined>(undefined);
  const [range, setRange] = useState<number | undefined>(undefined);

  return (
    <CatalogPageShell slug="persian-date-picker">
      <ShowcaseSection title={p("singleDate.title")}>
        <PersianDatePicker value={date} onChange={setDate} />
      </ShowcaseSection>
      <ShowcaseSection title={p("withTime.title")} delay={0.05}>
        <PersianDatePicker value={range} onChange={setRange} withTime />
      </ShowcaseSection>
    </CatalogPageShell>
  );
}
