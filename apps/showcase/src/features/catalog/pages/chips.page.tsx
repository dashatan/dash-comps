import { useMemo, useState, type ReactNode } from "react";
import Chip from "@/components/common/chips/chip";
import ChipRemove from "@/components/common/chips/chip-remove";
import ChipSelect from "@/components/common/chips/chip-select";
import { ChipsList } from "@/components/common/inputs/select/comps/trigger/chips-list";
import type { SelectItem } from "@/components/common/inputs/select/types";
import { useShowcasePage } from "@/features/catalog/i18n";
import { CatalogPageShell } from "@/features/catalog/ui/catalog-page-shell";
import { ShowcaseSection } from "@/features/catalog/ui/showcase-section";

const CHIP_SELECT_KEYS = ["today", "week", "month", "year"] as const;
const CHIP_REMOVE_KEYS = ["design", "frontend", "backend", "devops"] as const;
const SELECT_CHIP_KEYS = [
  "react",
  "typescript",
  "tailwind",
  "motion",
  "vite",
  "pnpm",
] as const;

type ChipSelectKey = (typeof CHIP_SELECT_KEYS)[number];
type ChipRemoveKey = (typeof CHIP_REMOVE_KEYS)[number];
type SelectChipKey = (typeof SELECT_CHIP_KEYS)[number];

function ShowcaseRow({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex min-w-0 flex-col gap-2">
      <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
        {label}
      </p>
      <div className="flex flex-wrap items-center gap-2">{children}</div>
    </div>
  );
}

function SelectChipsFrame({ children }: { children: ReactNode }) {
  return (
    <div className="w-full overflow-hidden rounded-xl border border-border bg-input">
      {children}
    </div>
  );
}

export function ChipsPage() {
  const p = useShowcasePage("chips");

  const [tags, setTags] = useState(["React", "Tailwind", "Motion"]);
  const [selectedPreset, setSelectedPreset] = useState<ChipSelectKey>("week");
  const [activeFilters, setActiveFilters] = useState<ChipRemoveKey[]>([
    "design",
    "frontend",
  ]);
  const [filterChips, setFilterChips] = useState(["region", "status"]);
  const [selectChips, setSelectChips] = useState<SelectChipKey[]>([
    "react",
    "typescript",
    "tailwind",
    "motion",
    "vite",
    "pnpm",
  ]);

  const selectItems = useMemo<SelectItem[]>(
    () =>
      selectChips.map((key) => ({
        value: key,
        label: p(`selectChips.items.${key}`),
      })),
    [p, selectChips],
  );

  const handleSelectChipRemove = (item: SelectItem) => {
    setSelectChips((current) => current.filter((key) => key !== item.value));
  };

  return (
    <CatalogPageShell slug="chips">
      <ShowcaseSection title={p("basic.title")}>
        <Chip label={p("basic.default")} />
        <Chip
          label={p("basic.active")}
          className="bg-primary/15 text-primary"
        />
        <Chip label={p("basic.muted")} className="bg-muted" />
      </ShowcaseSection>

      <ShowcaseSection title={p("styled.title")} delay={0.05}>
        <Chip className="h-5 min-h-5 rounded-full bg-primary/20 px-3 text-primary">
          {p("styled.preset")}
        </Chip>
        <Chip
          label={p("styled.outline")}
          className="border border-border bg-background text-foreground"
        />
        <Chip
          label={p("styled.compact")}
          className="h-5 min-h-5 px-2 py-0 text-[10px]"
        />
      </ShowcaseSection>

      <ShowcaseSection title={p("removableTags.title")} delay={0.1}>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Chip
              key={tag}
              label={tag}
              onRemove={() =>
                setTags((current) => current.filter((item) => item !== tag))
              }
            />
          ))}
        </div>
      </ShowcaseSection>

      <ShowcaseSection title={p("customContent.title")} delay={0.15}>
        <Chip>
          <span className="font-medium">{p("customContent.custom")}</span>
          <span className="text-muted-foreground">
            {p("customContent.slotContent")}
          </span>
        </Chip>
      </ShowcaseSection>

      <ShowcaseSection title={p("template.title")} delay={0.2}>
        <Chip
          label={p("template.prefix")}
          template={
            <span className="font-medium text-primary">
              {p("template.value")}
            </span>
          }
        />
      </ShowcaseSection>

      <ShowcaseSection
        title={p("filterChips.title")}
        description={p("filterChips.description")}
        delay={0.25}
      >
        {filterChips.includes("region") ? (
          <Chip
            label={`${p("filterChips.region")}: ${p("filterChips.regionValue")}`}
            onRemove={() =>
              setFilterChips((current) =>
                current.filter((key) => key !== "region"),
              )
            }
          />
        ) : null}
        {filterChips.includes("status") ? (
          <Chip
            label={`${p("filterChips.status")}: ${p("filterChips.statusValue")}`}
            onRemove={() =>
              setFilterChips((current) =>
                current.filter((key) => key !== "status"),
              )
            }
          />
        ) : null}
      </ShowcaseSection>

      <ShowcaseSection
        title={p("chipSelect.title")}
        description={p("chipSelect.description")}
        delay={0.3}
        layout="stack"
      >
        <ShowcaseRow label={p("chipSelect.singleSelect")}>
          {CHIP_SELECT_KEYS.map((key) => (
            <ChipSelect
              key={key}
              text={p(`chipSelect.options.${key}`)}
              val={key}
              active={selectedPreset === key}
              onSelect={(val) => setSelectedPreset(val as ChipSelectKey)}
            />
          ))}
        </ShowcaseRow>
        <ShowcaseRow label={p("chipSelect.disabledState")}>
          <ChipSelect
            text={p("chipSelect.options.today")}
            val="today"
            active={false}
            disabled
            onSelect={() => undefined}
          />
          <ChipSelect
            text={p("chipSelect.options.week")}
            val="week"
            active
            disabled
            onSelect={() => undefined}
          />
        </ShowcaseRow>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("chipRemove.title")}
        description={p("chipRemove.description")}
        delay={0.35}
        layout="stack"
      >
        <ShowcaseRow label={p("chipRemove.active")}>
          {CHIP_REMOVE_KEYS.map((key) => (
            <ChipRemove
              key={key}
              val={p(`chipRemove.options.${key}`)}
              active={activeFilters.includes(key)}
              onRemove={() =>
                setActiveFilters((current) =>
                  current.filter((item) => item !== key),
                )
              }
            />
          ))}
        </ShowcaseRow>
        <ShowcaseRow label={p("chipRemove.inactive")}>
          <ChipRemove val={p("chipRemove.options.backend")} active={false} />
          <ChipRemove val={p("chipRemove.options.devops")} active={false} />
        </ShowcaseRow>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("selectChips.title")}
        description={p("selectChips.description")}
        delay={0.4}
        layout="stack"
        className="w-full flex-col items-stretch"
      >
        <ShowcaseRow label={p("selectChips.withOverflow")}>
          <SelectChipsFrame>
            <ChipsList
              chips={selectItems}
              chipsCountLimit={3}
              onRemove={handleSelectChipRemove}
            />
          </SelectChipsFrame>
        </ShowcaseRow>
        <ShowcaseRow label={p("selectChips.rowLimit")}>
          <SelectChipsFrame>
            <ChipsList
              chips={selectItems}
              chipRowsCount={1}
              onRemove={handleSelectChipRemove}
            />
          </SelectChipsFrame>
        </ShowcaseRow>
      </ShowcaseSection>
    </CatalogPageShell>
  );
}
