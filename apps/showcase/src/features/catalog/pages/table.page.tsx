"use client";

import { useCallback, useMemo, useState, type ReactNode } from "react";
import { useShowcasePage } from "@/features/catalog/i18n";
import { CatalogPageShell } from "@/features/catalog/ui/catalog-page-shell";
import { ShowcaseSection } from "@/features/catalog/ui/showcase-section";
import { CodePreview } from "@/features/catalog/ui/code-preview";
import { TABLE_BASIC_USAGE_CODE } from "@/features/catalog/data/table-code-samples";
import {
  TABLE_ALL_ROWS,
  TABLE_REGIONS,
  TABLE_ROW_COUNT,
  TABLE_SEGMENTS,
  TABLE_STATUSES,
  filterAndSortTableRows,
  paginateTableRows,
  type CommerceUserRow,
} from "@/features/catalog/data/table-samples";
import {
  showcaseTableGuideImages,
  type ShowcaseTableGuideSectionKey,
} from "@/features/catalog/data/table-guide-samples";
import Table, {
  ExpandButton,
  StatusBox,
  TableCellColorDot,
  TableCellDateElement,
  TableCellNumberField,
  TableCellTextField,
  TableCheckbox,
  useTableStoreApi,
  type ChangeTag,
  type ColumnProps,
  type TableData,
} from "@/components/compound/table";
import {
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
} from "@/components/common/context-menu";
import Badge from "@/components/common/badge";
import Chip from "@/components/common/chips/chip";
import { Button } from "@/components/common/buttons";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTrigger,
} from "@/components/common/overlay/dialog";
import TabbedContent from "@/components/common/tabs";
import { Copy, Download, HelpCircle, Maximize2, Trash2 } from "lucide-react";
import { cn, useLanguage } from "@/lib";

const STATUS_COLORS = {
  active: "success",
  pending: "warning",
  inactive: "info",
  churned: "error",
} as const;

const TABLE_GUIDE_SECTIONS = {
  overview: ["dataset", "liveDemo"],
  toolbar: [
    "pagination",
    "rowCount",
    "bulkActions",
    "columnSettings",
    "filterToggle",
    "excel",
    "selectedCount",
  ],
  sorting: ["click", "cycle", "reload"],
  filtering: ["toggle", "types", "chips", "remove", "reload"],
  columns: ["resize", "reset", "reorder", "hide", "hover"],
  selection: ["single", "selectAll", "bulk", "clear"],
  expansion: ["open", "content", "collapse"],
  sidePanel: ["open", "toggle", "highlight", "actions"],
  scroll: ["drag", "frozen", "wide"],
} as const;

type TableGuideSectionKey = keyof typeof TABLE_GUIDE_SECTIONS;

const TABLE_GUIDE_SECTION_KEYS = Object.keys(
  TABLE_GUIDE_SECTIONS,
) as TableGuideSectionKey[];

function useTableGuideText() {
  const p = useShowcasePage("table");
  return useCallback((key: string) => p(key as Parameters<typeof p>[0]), [p]);
}

function TableGuideScreenshot({ section }: { section: TableGuideSectionKey }) {
  const t = useTableGuideText();
  const src = showcaseTableGuideImages[section as ShowcaseTableGuideSectionKey];

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-muted/10">
      <img
        src={src}
        alt={t(`guide.sections.${section}.screenshotAlt`)}
        className="aspect-16/10 w-full object-cover object-top"
        loading="lazy"
      />
    </div>
  );
}

function TableGuidePanel({ section }: { section: TableGuideSectionKey }) {
  const t = useTableGuideText();
  const intro = t(`guide.sections.${section}.intro`);

  return (
    <div className="flex flex-col gap-4 p-4">
      <TableGuideScreenshot section={section} />
      {intro ? (
        <p className="text-sm leading-relaxed text-muted-foreground">{intro}</p>
      ) : null}
      <ul className="list-disc space-y-2 ps-5 text-sm leading-relaxed text-muted-foreground">
        {TABLE_GUIDE_SECTIONS[section].map((item) => (
          <li key={item}>{t(`guide.sections.${section}.items.${item}`)}</li>
        ))}
      </ul>
    </div>
  );
}

function TableGuideDialog() {
  const t = useTableGuideText();

  const tabs = useMemo(
    () =>
      TABLE_GUIDE_SECTION_KEYS.map((section) => ({
        name: section,
        header: t(`guide.sections.${section}.title`),
        content: <TableGuidePanel section={section} />,
      })),
    [t],
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outlined" leftIcon={<HelpCircle className="size-4" />}>
          {t("guide.openButton")}
        </Button>
      </DialogTrigger>
      <DialogContent
        title={t("guide.title")}
        className="flex h-[min(85vh,720px)] w-[calc(100vw-2rem)] flex-col overflow-hidden sm:w-176"
      >
        <div className="shrink-0 border-b border-border px-4 py-3">
          <DialogDescription className="text-sm leading-relaxed text-muted-foreground">
            {t("guide.description")}
          </DialogDescription>
        </div>
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <TabbedContent
            tabs={tabs}
            enableScroll
            className={{
              container: "min-h-0 flex-1",
              content: "min-h-0 overflow-auto",
              tabs: "px-2",
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

type CellJustify = "center" | "start" | "end";

function headerCell(label: string, justify: CellJustify = "center") {
  return <TableCellTextField value={label} justify={justify} />;
}

const INITIAL_TABLE_STATE: TableData = {
  page: 0,
  rows: 15,
  offset: 0,
  limit: 15,
  first: 0,
  selected: [],
  selectAll: false,
  filters: {},
  expandedRows: {},
  showFilter: false,
  showFilterChips: false,
};

type LocalizedCommerceUserRow = CommerceUserRow & {
  name: string;
  email: string;
  regionLabel: string;
  segmentLabel: string;
  tierLabel: string;
  categoryLabel: string;
  statusLabel: string;
  notes: string;
  preferredCategory: string;
};

type RowDetailItem = {
  label: string;
  value: ReactNode;
  valueClassName?: string;
};

type RowDetailGroup = {
  title: string;
  items: RowDetailItem[];
};

type TableTranslate = ReturnType<typeof useShowcasePage<"table">>;

function buildRowDetailGroups(
  row: LocalizedCommerceUserRow,
  p: TableTranslate,
  language: string,
  formatCurrency: (value: number) => string,
): RowDetailGroup[] {
  return [
    {
      title: p("expansion.groups.profile"),
      items: [
        {
          label: p("expansion.email"),
          value: row.email,
          valueClassName: "dir-ltr",
        },
        { label: p("expansion.region"), value: row.regionLabel },
        { label: p("expansion.segment"), value: row.segmentLabel },
      ],
    },
    {
      title: p("expansion.groups.commerce"),
      items: [
        {
          label: p("expansion.orders"),
          value: row.orders.toLocaleString(language),
        },
        {
          label: p("expansion.totalSpent"),
          value: `${formatCurrency(row.totalSpent)}${p("sampleData.currencySuffix")}`,
        },
        { label: p("expansion.loyaltyScore"), value: `${row.loyaltyScore}%` },
      ],
    },
    {
      title: p("expansion.groups.activity"),
      items: [
        {
          label: p("expansion.lastOrder"),
          value: <TableCellDateElement val={row.lastOrderAt} />,
        },
        {
          label: p("expansion.registered"),
          value: <TableCellDateElement val={row.registeredAt} />,
        },
        {
          label: p("expansion.newsletter"),
          value: row.newsletterEnabled
            ? p("sampleData.newsletter.on")
            : p("sampleData.newsletter.off"),
          valueClassName: row.newsletterEnabled
            ? "text-success"
            : "text-muted-foreground",
        },
        {
          label: p("expansion.preferredCategory"),
          value: row.preferredCategory,
        },
      ],
    },
  ];
}

function RowDetailGroupSection({ group }: { group: RowDetailGroup }) {
  return (
    <section className="overflow-hidden rounded-md border border-table-border bg-table-row">
      <h4 className="border-b border-table-border bg-muted/20 px-3 py-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
        {group.title}
      </h4>
      <dl className="divide-y divide-table-border">
        {group.items.map((item) => (
          <div
            key={item.label}
            className="grid grid-cols-[minmax(6.5rem,42%)_1fr] items-start gap-3 px-3 py-2.5"
          >
            <dt className="text-xs font-medium text-muted-foreground">
              {item.label}
            </dt>
            <dd className={cn("text-sm font-medium", item.valueClassName)}>
              {item.value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

function RowDetailHeader({ row }: { row: LocalizedCommerceUserRow }) {
  return (
    <div className="flex flex-wrap items-center gap-2 border-b border-table-border bg-muted/30 px-4 py-3">
      <span className="text-base font-semibold">{row.name}</span>
      <Badge severity="primary">#{row.id}</Badge>
      <StatusBox text={row.statusLabel} color={STATUS_COLORS[row.status]} />
      <Badge severity="info">{row.tierLabel}</Badge>
    </div>
  );
}

function RowDetailNotes({
  notes,
  label,
}: {
  notes: string;
  label: string;
}) {
  return (
    <div className="border-t border-table-border bg-muted/15 px-4 py-3">
      <p className="mb-1.5 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
        {label}
      </p>
      <p className="text-sm leading-relaxed text-muted-foreground">{notes}</p>
    </div>
  );
}

function TableRowSidePanel({ row }: { row: LocalizedCommerceUserRow }) {
  const p = useShowcasePage("table");
  const { language } = useLanguage();

  const formatCurrency = (value: number) =>
    value.toLocaleString(language, { maximumFractionDigits: 0 });

  const groups = buildRowDetailGroups(row, p, language, formatCurrency);

  return (
    <aside className="flex h-full w-80 shrink-0 flex-col overflow-hidden rounded-md border border-table-border bg-table">
      <RowDetailHeader row={row} />
      <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto p-3">
        {groups.map((group) => (
          <RowDetailGroupSection key={group.title} group={group} />
        ))}
      </div>
      <RowDetailNotes notes={row.notes} label={p("expansion.notes")} />
    </aside>
  );
}

function RowExpandSection({ row }: { row: LocalizedCommerceUserRow }) {
  const p = useShowcasePage("table");
  const { language } = useLanguage();

  const formatCurrency = (value: number) =>
    value.toLocaleString(language, { maximumFractionDigits: 0 });

  const groups = buildRowDetailGroups(row, p, language, formatCurrency);

  return (
    <div className="p-3">
      <div className="overflow-hidden rounded-lg border border-table-border bg-table">
        <RowDetailHeader row={row} />

        <div className="grid gap-3 p-3 lg:grid-cols-3">
          {groups.map((group) => (
            <RowDetailGroupSection key={group.title} group={group} />
          ))}
        </div>

        <RowDetailNotes notes={row.notes} label={p("expansion.notes")} />
      </div>
    </div>
  );
}

function TableRowContextMenu({ row }: { row: LocalizedCommerceUserRow }) {
  const p = useShowcasePage("table");
  const api = useTableStoreApi();

  const handleOpenSidePanel = () => {
    const current = api.getSnapshot().sidePanelData as
      | LocalizedCommerceUserRow
      | undefined;
    api.setSidePanelData(current?.id === row.id ? undefined : row);
  };

  return (
    <>
      <ContextMenuItem onClick={handleOpenSidePanel}>
        <Maximize2 className="me-2 size-4" />
        {p("contextMenu.openSidePanel")}
        <ContextMenuShortcut>↵</ContextMenuShortcut>
      </ContextMenuItem>
      <ContextMenuItem onClick={() => navigator.clipboard.writeText(row.email)}>
        <Copy className="me-2 size-4" />
        {p("contextMenu.copyEmail")}
      </ContextMenuItem>
      <ContextMenuSeparator />
      <ContextMenuItem
        variant="destructive"
        onClick={() =>
          window.alert(p("contextMenu.archiveAlert", { email: row.email }))
        }
      >
        <Trash2 className="me-2 size-4" />
        {p("contextMenu.archive")}
      </ContextMenuItem>
    </>
  );
}

export function TablePage() {
  const p = useShowcasePage("table");
  const { language } = useLanguage();
  const [tableState, setTableState] = useState<TableData>(INITIAL_TABLE_STATE);
  const [loading, setLoading] = useState(false);
  const [excelLoading, setExcelLoading] = useState(false);

  const localizeRow = useCallback(
    (row: CommerceUserRow): LocalizedCommerceUserRow => {
      const tierLabel = p(`sampleData.tiers.${row.tier}`);
      const segmentLabel = p(`sampleData.segments.${row.segment}`);
      const regionLabel = p(`sampleData.regions.${row.region}`);
      const categoryLabel = p(`sampleData.categories.${row.category}`);

      return {
        ...row,
        name: p(`sampleData.names.${row.nameKey}`),
        email: `user${row.id}@shop.example`,
        regionLabel,
        segmentLabel,
        tierLabel,
        categoryLabel,
        statusLabel: p(`sampleData.statuses.${row.status}`),
        notes: p("sampleData.notes", {
          id: row.id,
          tier: tierLabel,
          segment: segmentLabel,
          region: regionLabel,
        }),
        preferredCategory: p("sampleData.preferredCategory", {
          category: categoryLabel,
          region: regionLabel,
          id: row.id,
        }),
      };
    },
    [p],
  );

  const localizedRows = useMemo(
    () => TABLE_ALL_ROWS.map(localizeRow),
    [localizeRow],
  );

  const filteredRows = useMemo(
    () => filterAndSortTableRows(localizedRows, tableState),
    [localizedRows, tableState],
  );

  const pageData = useMemo(
    () => paginateTableRows(filteredRows, tableState),
    [filteredRows, tableState.page, tableState.rows],
  );

  const pageIds = useMemo(() => pageData.map((r) => r.id), [pageData]);

  const simulateFetch = useCallback(() => {
    setLoading(true);
    window.setTimeout(() => setLoading(false), 380);
  }, []);

  const handleExcelExport = useCallback(async () => {
    setExcelLoading(true);
    try {
      await new Promise<void>((resolve) => window.setTimeout(resolve, 800));
      window.alert(
        p("bulkActions.exportFilteredAlert", {
          count: filteredRows.length,
        }),
      );
    } finally {
      setExcelLoading(false);
    }
  }, [filteredRows.length, p]);

  const handleTableChange = useCallback(
    (data: TableData | Record<string, string>, tag: ChangeTag) => {
      setTableState(data as TableData);
      if (
        tag === "filter" ||
        tag === "pagination" ||
        tag === "rows" ||
        tag === "sort"
      ) {
        simulateFetch();
      }
    },
    [simulateFetch],
  );

  const columns: ColumnProps[] = useMemo(
    () => [
      {
        field: "select",
        header: <TableCheckbox.SelectAll ids={pageIds} />,
        body: (row) => (
          <TableCheckbox.SelectOne
            value={(row as LocalizedCommerceUserRow).id}
          />
        ),
        width: 56,
        frozen: { pos: "right" },
        excludeExpand: { pos: "right" },
      },
      {
        field: "id",
        header: headerCell(p("columns.id"), "center"),
        sortable: true,
        width: 72,
        frozen: { pos: "right" },
        excludeExpand: { pos: "right" },
        body: (row) => (
          <TableCellTextField
            value={(row as LocalizedCommerceUserRow).id}
            justify="center"
            className="font-semibold"
          />
        ),
      },
      {
        field: "email",
        header: headerCell(p("columns.email"), "center"),
        width: 180,
        body: (row) => (
          <TableCellTextField
            value={(row as LocalizedCommerceUserRow).email}
            justify="center"
            className="font-medium dir-ltr"
          />
        ),
      },
      {
        field: "name",
        header: headerCell(p("columns.name"), "start"),
        sortable: true,
        filter: true,
        filterElementType: "text",
        width: 150,
        body: (row) => (
          <TableCellTextField
            value={(row as LocalizedCommerceUserRow).name}
            justify="start"
          />
        ),
      },
      {
        field: "status",
        header: headerCell(p("columns.status"), "center"),
        filter: true,
        filterElementType: "select",
        filterOptions: TABLE_STATUSES.map((s) => ({
          label: p(`sampleData.statuses.${s}`),
          value: s,
        })),
        filterChips: (val) => {
          const status = String(val) as CommerceUserRow["status"];
          return (
            <Chip
              label={p("filterChips.status", {
                value: p(`sampleData.statuses.${status}`),
              })}
            />
          );
        },
        width: 130,
        body: (row) => {
          const r = row as LocalizedCommerceUserRow;
          return (
            <TableCellTextField
              justify="center"
              value=""
              emptyValue={
                <StatusBox
                  text={r.statusLabel}
                  color={STATUS_COLORS[r.status]}
                  justify="center"
                />
              }
            />
          );
        },
      },
      {
        field: "region",
        header: headerCell(p("columns.region"), "center"),
        filter: true,
        filterElementType: "multi-select",
        filterOptions: TABLE_REGIONS.map((r) => ({
          label: p(`sampleData.regions.${r}`),
          value: r,
        })),
        width: 120,
        body: (row) => (
          <TableCellTextField
            value={(row as LocalizedCommerceUserRow).regionLabel}
            justify="center"
          />
        ),
      },
      {
        field: "segment",
        header: headerCell(p("columns.segment"), "center"),
        defaultInactive: true,
        filter: true,
        filterElementType: "select",
        filterOptions: TABLE_SEGMENTS.map((s) => ({
          label: p(`sampleData.segments.${s}`),
          value: s,
        })),
        width: 140,
        body: (row) => (
          <TableCellTextField
            value={(row as LocalizedCommerceUserRow).segmentLabel}
            justify="center"
          />
        ),
      },
      {
        field: "tier",
        header: headerCell(p("columns.tier"), "center"),
        width: 110,
        body: (row) => (
          <TableCellTextField
            value={(row as LocalizedCommerceUserRow).tierLabel}
            justify="center"
          />
        ),
      },
      {
        field: "orders",
        header: headerCell(p("columns.orders"), "end"),
        sortable: true,
        filter: true,
        filterElementType: "number-range",
        filterKey: "orders",
        width: 120,
        body: (row) => (
          <TableCellNumberField
            value={(row as LocalizedCommerceUserRow).orders}
            justify="end"
            className="px-4"
          />
        ),
      },
      {
        field: "totalSpent",
        header: headerCell(p("columns.totalSpent"), "end"),
        sortable: true,
        width: 150,
        body: (row) => (
          <TableCellNumberField
            value={(row as LocalizedCommerceUserRow).totalSpent}
            suffix={p("sampleData.currencySuffix")}
            justify="end"
            className="px-4"
          />
        ),
      },
      {
        field: "loyaltyScore",
        header: headerCell(p("columns.loyaltyScore"), "center"),
        sortable: true,
        width: 110,
        body: (row) => (
          <TableCellNumberField
            value={(row as LocalizedCommerceUserRow).loyaltyScore}
            suffix="%"
            justify="center"
            className="px-4"
          />
        ),
      },
      {
        field: "lastOrderAt",
        header: headerCell(p("columns.lastOrder"), "start"),
        filter: true,
        filterElementType: "date",
        width: 180,
        body: (row) => (
          <TableCellDateElement
            val={(row as LocalizedCommerceUserRow).lastOrderAt}
            justify="start"
            className="px-4"
          />
        ),
      },
      {
        field: "registeredAt",
        header: headerCell(p("columns.registered"), "start"),
        sortable: true,
        width: 200,
        body: (row) => (
          <TableCellDateElement
            val={(row as LocalizedCommerceUserRow).registeredAt}
            justify="start"
            className="px-4"
          />
        ),
      },
      {
        field: "subscriptionEnd",
        header: headerCell(p("columns.subscriptionEnd"), "start"),
        defaultInactive: true,
        width: 160,
        body: (row) => (
          <TableCellDateElement
            val={(row as LocalizedCommerceUserRow).subscriptionEnd}
            justify="start"
            className="px-4"
          />
        ),
      },
      {
        field: "color",
        header: headerCell(p("columns.tag"), "center"),
        width: 72,
        body: (row) => (
          <TableCellTextField
            justify="center"
            value=""
            emptyValue={
              <TableCellColorDot
                color={(row as LocalizedCommerceUserRow).color}
              />
            }
          />
        ),
      },
      {
        field: "newsletterEnabled",
        header: headerCell(p("columns.newsletter"), "center"),
        width: 110,
        body: (row) => {
          const r = row as LocalizedCommerceUserRow;
          return (
            <TableCellTextField
              value={
                r.newsletterEnabled
                  ? p("sampleData.newsletter.on")
                  : p("sampleData.newsletter.off")
              }
              justify="center"
              className={cn({
                "text-success": r.newsletterEnabled,
                "text-muted-foreground": !r.newsletterEnabled,
              })}
            />
          );
        },
      },
      {
        field: "notes",
        header: headerCell(p("columns.notes"), "start"),
        width: 280,
        body: (row) => (
          <TableCellTextField
            value={(row as LocalizedCommerceUserRow).notes}
            justify="start"
            className="w-full truncate"
          />
        ),
      },
      {
        field: "preferredCategory",
        header: headerCell(p("columns.preferredCategory"), "start"),
        defaultInactive: true,
        width: 320,
        body: (row) => (
          <TableCellTextField
            value={(row as LocalizedCommerceUserRow).preferredCategory}
            justify="start"
            className="w-full truncate"
          />
        ),
      },
      {
        field: "expand",
        header: "",
        body: (row) => (
          <ExpandButton expandKey={(row as LocalizedCommerceUserRow).id} />
        ),
        width: 56,
        frozen: { pos: "left" },
        excludeExpand: { pos: "left" },
      },
    ],
    [p, pageIds],
  );

  return (
    <CatalogPageShell
      slug="table"
      title={p("pageHeader.title")}
      description={p("pageHeader.description")}
    >
      <ShowcaseSection
        title={p("compoundTable.showcase.title")}
        layout="stack"
        contentClassName="gap-4"
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="min-w-0 flex-1 text-sm text-muted-foreground">
            {p("guide.summary")}
          </p>
          <TableGuideDialog />
        </div>
        <div className="h-[min(78vh,820px)] w-full overflow-hidden rounded-xl border border-border">
          <Table
            columns={columns}
            data={pageData as Record<string, unknown>[]}
            defaultValues={INITIAL_TABLE_STATE}
            totalRecords={filteredRows.length}
            loading={loading}
            showActionHeader
            showActionFilters
            draggable
            columnHover
            dataKey="id"
            expandOnNewRow={false}
            onTableChange={handleTableChange}
            rowProps={{
              getRowClassName: (data, api) => {
                const active = (
                  api.getSnapshot().sidePanelData as
                    | LocalizedCommerceUserRow
                    | undefined
                )?.id;
                return cn({
                  "ring-primary/30 ring-1 ring-inset":
                    active === (data as LocalizedCommerceUserRow).id,
                });
              },
            }}
            rowExpansionTemplate={(row) => (
              <RowExpandSection row={row as LocalizedCommerceUserRow} />
            )}
            sidePanelTemplate={(row) => (
              <TableRowSidePanel row={row as LocalizedCommerceUserRow} />
            )}
            rightClickMenu={(row) => (
              <TableRowContextMenu row={row as LocalizedCommerceUserRow} />
            )}
            actionHeaderProps={{
              firstExtraElements: (
                <Badge severity="secondary" className="h-10 px-3">
                  {filteredRows.length.toLocaleString(language)} /{" "}
                  {TABLE_ROW_COUNT.toLocaleString(language)}
                </Badge>
              ),
              secondExtraElements: (
                <Badge severity="info" className="mx-2 hidden sm:inline-flex">
                  <Maximize2 className="me-1 size-3.5" />
                  {p("compoundTable.showcase.hint")}
                </Badge>
              ),
              bulkActionsOptions: [
                {
                  label: p("bulkActions.exportSelected"),
                  value: "export",
                  icon: <Download className="size-4" />,
                  onChange: (_value, api) => {
                    const selected = api?.getSnapshot().selected;
                    window.alert(
                      p("bulkActions.exportSelectedAlert", {
                        count: selected?.length ?? 0,
                      }),
                    );
                  },
                },
                {
                  label: p("bulkActions.clearSelection"),
                  value: "clear",
                  icon: <Trash2 className="size-4" />,
                  onChange: (_value, api) => api?.clearSelected(),
                },
              ],
              excelExportOptions: {
                isLoading: excelLoading,
                onRequest: handleExcelExport,
              },
            }}
            actionFilterProps={{
              sort: ["status", "region", "name", "orders"],
            }}
          />
        </div>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("codeSample.title")}
        description={p("codeSample.description")}
        layout="stack"
        contentClassName="border-0 bg-transparent p-0"
      >
        <CodePreview
          code={TABLE_BASIC_USAGE_CODE}
          filename={p("codeSample.filename")}
          language="tsx"
          copyLabel={p("codeSample.copy")}
          copiedLabel={p("codeSample.copied")}
        />
      </ShowcaseSection>
    </CatalogPageShell>
  );
}
