import { useMemo, useState, type ReactNode } from "react";
import { Star, Tag } from "lucide-react";
import { List } from "@/components/common/list";
import type { ButtonListProps } from "@/components/common/list/buttons";
import type { CardsListProps } from "@/components/common/list/cards";
import type { GridColumn } from "@/components/common/list/grid/types";
import type { LinesListProps } from "@/components/common/list/lines";
import { useShowcasePage } from "@/features/catalog/i18n";
import { CatalogPageShell } from "@/features/catalog/ui/catalog-page-shell";
import { ShowcaseSection } from "@/features/catalog/ui/showcase-section";
import { cn } from "@/lib";

type DetailItem = NonNullable<CardsListProps["list"]>[number];
type LinesItem = NonNullable<LinesListProps["list"]>[number];
type ButtonItem = NonNullable<ButtonListProps["list"]>[number];

type GridRow = {
  id: number;
  name: string;
  role: string;
  score: number;
  status: string;
};

const GRID_ROW_KEYS = ["alice", "bob", "carol", "dan"] as const;
const CHIP_TAG_KEYS = ["tagA", "tagB", "tagC", "tagD"] as const;

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

function DemoFrame({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "w-full rounded-xl border border-dashed border-border bg-muted/20 p-4",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function ListPage() {
  const p = useShowcasePage("list");
  const [clickedCell, setClickedCell] = useState<string | null>(null);
  const [sortInfo, setSortInfo] = useState<string | null>(null);

  const linesSample = useMemo<LinesItem[]>(
    () => [
      { name: p("sample.status"), value: p("sample.active"), hasValue: true },
      { name: p("sample.region"), value: p("sample.tehran"), hasValue: true },
      { name: p("sample.plan"), value: p("sample.pro"), hasValue: true },
      { name: p("sample.notes"), hasValue: false },
    ],
    [p],
  );

  const detailSample = useMemo<DetailItem[]>(
    () => [
      { name: p("sample.status"), value: p("sample.active"), hasValue: true },
      { name: p("sample.region"), value: p("sample.tehran"), hasValue: true },
      { name: p("sample.plan"), value: p("sample.pro"), hasValue: true },
      { name: p("sample.notes"), value: p("sample.dash"), hasValue: false },
    ],
    [p],
  );

  const longValueSample = useMemo<LinesItem[]>(
    () => [
      {
        name: p("sample.email"),
        value: p("sample.longEmail"),
        hasValue: true,
      },
      {
        name: p("sample.updated"),
        value: p("sample.longTimestamp"),
        hasValue: true,
      },
    ],
    [p],
  );

  const buttonSample = useMemo<ButtonItem[]>(
    () =>
      [
        {
          name: p("sample.status"),
          value: p("sample.confirmed"),
          hasValue: true,
        },
        { name: p("sample.tier"), value: p("sample.longTier"), hasValue: true },
        { name: p("sample.notes"), hasValue: false },
      ] as ButtonItem[],
    [p],
  );

  const twoColEven = useMemo(
    () => [
      { name: p("sample.status"), value: p("sample.active") },
      { name: p("sample.region"), value: p("sample.tehran") },
      { name: p("sample.plan"), value: p("sample.pro") },
      { name: p("sample.updated"), value: p("sample.today") },
    ],
    [p],
  );

  const twoColOdd = useMemo(
    () => [...twoColEven, { name: p("sample.notes"), value: p("sample.dash") }],
    [p, twoColEven],
  );

  const gridData = useMemo<GridRow[]>(
    () =>
      GRID_ROW_KEYS.map((key, index) => ({
        id: index + 1,
        name: p(`gridList.rows.${key}.name`),
        role: p(`gridList.rows.${key}.role`),
        score: [92, 78, 85, 64][index] ?? 0,
        status: p(`gridList.rows.${key}.status`),
      })),
    [p],
  );

  const gridColumns = useMemo<GridColumn<GridRow>[]>(
    () => [
      {
        field: "name",
        header: p("gridList.columns.name"),
        sortable: true,
        width: "1.5fr",
      },
      {
        field: "role",
        header: p("gridList.columns.role"),
        sortable: true,
        width: "1.2fr",
      },
      {
        field: "score",
        header: p("gridList.columns.score"),
        sortable: true,
        width: 80,
        body: (row) => (
          <span
            className={cn("font-semibold", {
              "text-emerald-600 dark:text-emerald-400": row.score >= 80,
              "text-amber-600 dark:text-amber-400":
                row.score >= 70 && row.score < 80,
              "text-red-600 dark:text-red-400": row.score < 70,
            })}
          >
            {row.score}
          </span>
        ),
      },
      {
        field: "status",
        header: p("gridList.columns.status"),
        width: "1fr",
        body: (row) => (
          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
            {row.status}
          </span>
        ),
      },
    ],
    [p],
  );

  return (
    <CatalogPageShell slug="list">
      <ShowcaseSection
        title={p("linesList.title")}
        description={p("linesList.description")}
        layout="stack"
      >
        <div className="grid w-full gap-6 lg:grid-cols-2">
          <ShowcaseRow label={p("linesList.rows.default")}>
            <List.Lines list={linesSample} />
          </ShowcaseRow>
          <ShowcaseRow label={p("linesList.rows.indicator")}>
            <List.Lines list={linesSample} indicator />
          </ShowcaseRow>
          <ShowcaseRow label={p("linesList.rows.loading")}>
            <DemoFrame className="min-h-32">
              <List.Lines list={linesSample} loading />
            </DemoFrame>
          </ShowcaseRow>
          <ShowcaseRow label={p("linesList.rows.longValues")}>
            <List.Lines list={longValueSample} indicator />
          </ShowcaseRow>
        </div>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("cardsList.title")}
        description={p("cardsList.description")}
        layout="stack"
      >
        <div className="grid w-full gap-6 lg:grid-cols-2">
          <ShowcaseRow label={p("cardsList.rows.default")}>
            <List.Cards list={detailSample} />
          </ShowcaseRow>
          <ShowcaseRow label={p("cardsList.rows.indicator")}>
            <List.Cards list={detailSample} indicator />
          </ShowcaseRow>
          <ShowcaseRow label={p("cardsList.rows.loading")}>
            <DemoFrame className="min-h-32">
              <List.Cards list={detailSample} loading />
            </DemoFrame>
          </ShowcaseRow>
        </div>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("chipsList.title")}
        description={p("chipsList.description")}
        layout="stack"
      >
        <div className="grid w-full gap-6 lg:grid-cols-2">
          <ShowcaseRow label={p("chipsList.rows.states")}>
            <List.Chips
              list={[
                { name: p("chipsList.tagA"), isActive: true },
                { name: p("chipsList.tagB") },
                { name: p("chipsList.tagC"), isActive: true },
                { name: p("chipsList.tagD") },
              ]}
            />
          </ShowcaseRow>
          <ShowcaseRow label={p("chipsList.rows.withIcons")}>
            <List.Chips
              list={[
                {
                  name: p("chipsList.tagA"),
                  isActive: true,
                  icon: <Star className="size-3" />,
                },
                { name: p("chipsList.tagB"), icon: <Tag className="size-3" /> },
                {
                  name: p("chipsList.tagC"),
                  isActive: true,
                  icon: <Star className="size-3" />,
                },
              ]}
            />
          </ShowcaseRow>
          <ShowcaseRow label={p("chipsList.rows.sharedIcon")}>
            <List.Chips
              icon={<Tag className="size-3" />}
              list={CHIP_TAG_KEYS.map((key) => ({
                name: p(`chipsList.${key}`),
                isActive: key === "tagA" || key === "tagC",
              }))}
            />
          </ShowcaseRow>
        </div>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("buttonsList.title")}
        description={p("buttonsList.description")}
        layout="stack"
      >
        <div className="grid w-full gap-6 lg:grid-cols-2">
          <ShowcaseRow label={p("buttonsList.rows.default")}>
            <List.Buttons list={buttonSample} />
          </ShowcaseRow>
          <ShowcaseRow label={p("buttonsList.rows.indicator")}>
            <List.Buttons list={buttonSample} indicator />
          </ShowcaseRow>
          <ShowcaseRow label={p("buttonsList.rows.loading")}>
            <List.Buttons list={buttonSample} loading />
          </ShowcaseRow>
          <ShowcaseRow label={p("buttonsList.rows.marquee")}>
            <List.Buttons
              list={[
                {
                  name: p("sample.tier"),
                  value: p("sample.longTier"),
                  hasValue: true,
                },
              ]}
            />
          </ShowcaseRow>
        </div>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("twoColGrid.title")}
        description={p("twoColGrid.description")}
        layout="stack"
      >
        <div className="grid w-full gap-6 lg:grid-cols-2">
          <ShowcaseRow label={p("twoColGrid.rows.even")}>
            <List.TwoColGrid list={twoColEven} />
          </ShowcaseRow>
          <ShowcaseRow label={p("twoColGrid.rows.odd")}>
            <List.TwoColGrid list={twoColOdd} />
          </ShowcaseRow>
          <ShowcaseRow label={p("twoColGrid.rows.loading")}>
            <List.TwoColGrid list={twoColOdd} loading />
          </ShowcaseRow>
        </div>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("gridList.title")}
        description={p("gridList.description")}
        layout="stack"
      >
        <div className="grid w-full gap-6">
          <ShowcaseRow label={p("gridList.rows.default")}>
            <DemoFrame className="h-64 overflow-hidden p-0">
              <List.Grid columns={gridColumns} data={gridData} />
            </DemoFrame>
          </ShowcaseRow>

          <ShowcaseRow label={p("gridList.rows.sortable")}>
            <DemoFrame className="h-64 overflow-hidden p-0">
              <List.Grid
                columns={gridColumns}
                data={gridData}
                defaultSort={{ field: "score", order: -1 }}
                onSortChange={(field, order) => {
                  setSortInfo(
                    field
                      ? p("gridList.sortActive", {
                          field,
                          order: order === 1 ? "asc" : "desc",
                        })
                      : p("gridList.sortCleared"),
                  );
                }}
              />
            </DemoFrame>
            {sortInfo ? (
              <p className="text-sm text-muted-foreground">{sortInfo}</p>
            ) : null}
          </ShowcaseRow>

          <div className="grid w-full gap-6 lg:grid-cols-2">
            <ShowcaseRow label={p("gridList.rows.loading")}>
              <DemoFrame className="h-64 overflow-hidden p-0">
                <List.Grid columns={gridColumns} data={gridData} loading />
              </DemoFrame>
            </ShowcaseRow>
            <ShowcaseRow label={p("gridList.rows.empty")}>
              <DemoFrame className="h-64 overflow-hidden p-0">
                <List.Grid columns={gridColumns} data={[]} />
              </DemoFrame>
            </ShowcaseRow>
          </div>

          <ShowcaseRow label={p("gridList.rows.cellClick")}>
            <DemoFrame className="h-64 overflow-hidden p-0">
              <List.Grid
                columns={gridColumns}
                data={gridData}
                onCellClick={(row, column) => {
                  setClickedCell(
                    p("gridList.cellClicked", {
                      name: row.name,
                      column: String(column.field),
                    }),
                  );
                }}
              />
            </DemoFrame>
            <p className="text-sm text-muted-foreground">
              {clickedCell ?? p("gridList.cellHint")}
            </p>
          </ShowcaseRow>

          <ShowcaseRow label={p("gridList.rows.customHeights")}>
            <DemoFrame className="h-72 overflow-hidden p-0">
              <List.Grid
                columns={gridColumns}
                data={gridData}
                rowHeight={52}
                headerHeight={48}
              />
            </DemoFrame>
          </ShowcaseRow>
        </div>
      </ShowcaseSection>
    </CatalogPageShell>
  );
}
