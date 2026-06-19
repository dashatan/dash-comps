"use client";

import { useCallback, useMemo, useState, type ReactNode } from "react";
import { useShowcasePage } from "@/features/catalog/i18n";
import { CatalogPageShell } from "@/features/catalog/ui/catalog-page-shell";
import { ShowcaseSection } from "@/features/catalog/ui/showcase-section";
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
import { Copy, Download, Maximize2, Trash2 } from "lucide-react";
import { cn, useLanguage } from "@/lib";

const STATUS_COLORS = {
  active: "success",
  pending: "warning",
  inactive: "info",
  churned: "error",
} as const;

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

function RowExpandSection({ row }: { row: LocalizedCommerceUserRow }) {
  const p = useShowcasePage("table");
  const { language } = useLanguage();

  const formatCurrency = (value: number) =>
    value.toLocaleString(language, { maximumFractionDigits: 0 });

  type DetailItem = {
    label: string;
    value: ReactNode;
    valueClassName?: string;
  };

  const groups: { title: string; items: DetailItem[] }[] = [
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

  return (
    <div className="p-3">
      <div className="overflow-hidden rounded-lg border border-table-border bg-table">
        <div className="flex flex-wrap items-center gap-2 border-b border-table-border bg-muted/30 px-4 py-3">
          <span className="text-base font-semibold">{row.name}</span>
          <Badge severity="primary">#{row.id}</Badge>
          <StatusBox text={row.statusLabel} color={STATUS_COLORS[row.status]} />
          <Badge severity="info">{row.tierLabel}</Badge>
        </div>

        <div className="grid gap-3 p-3 lg:grid-cols-3">
          {groups.map((group) => (
            <section
              key={group.title}
              className="overflow-hidden rounded-md border border-table-border bg-table-row"
            >
              <h4 className="border-b border-table-border bg-muted/20 px-3 py-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                {group.title}
              </h4>
              <dl className="divide-y divide-table-border">
                {group.items.map((item) => (
                  <div
                    key={item.label}
                    className="grid grid-cols-[minmax(7rem,38%)_1fr] items-center gap-3 px-3 py-2.5"
                  >
                    <dt className="text-xs font-medium text-muted-foreground">
                      {item.label}
                    </dt>
                    <dd
                      className={cn("text-sm font-medium", item.valueClassName)}
                    >
                      {item.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          ))}
        </div>

        <div className="border-t border-table-border bg-muted/15 px-4 py-3">
          <p className="mb-1.5 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            {p("expansion.notes")}
          </p>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {row.notes}
          </p>
        </div>
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
  const [lastChangeTag, setLastChangeTag] = useState<ChangeTag | null>(null);

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

  const formatCurrency = useCallback(
    (value: number) =>
      value.toLocaleString(language, {
        maximumFractionDigits: 0,
      }),
    [language],
  );

  const simulateFetch = useCallback((tag: ChangeTag) => {
    setLastChangeTag(tag);
    setLoading(true);
    window.setTimeout(() => setLoading(false), 380);
  }, []);

  const handleTableChange = useCallback(
    (data: TableData | Record<string, string>, tag: ChangeTag) => {
      setTableState(data as TableData);
      if (
        tag === "filter" ||
        tag === "pagination" ||
        tag === "rows" ||
        tag === "sort"
      ) {
        simulateFetch(tag);
      } else {
        setLastChangeTag(tag);
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
            className="max-w-[260px]"
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
            className="max-w-[300px]"
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
    <CatalogPageShell slug="table">
      <ShowcaseSection
        title={p("compoundTable.title")}
        className="flex-col items-start"
        layout="stack"
      >
        <p className="max-w-3xl text-sm text-muted-foreground">
          {p("compoundTable.description.lead")}
        </p>
        <ul className="mt-3 grid gap-1.5 text-sm text-muted-foreground sm:grid-cols-2">
          {(
            [
              p("compoundTable.features.pagination"),
              p("compoundTable.features.filters"),
              p("compoundTable.features.selection"),
              p("compoundTable.features.columns"),
              p("compoundTable.features.frozen"),
              p("compoundTable.features.scroll"),
              p("compoundTable.features.expansion"),
              p("compoundTable.features.sidePanel"),
            ] as const
          ).map((item) => (
            <li key={item} className="flex items-center gap-2">
              <span className="size-1.5 shrink-0 rounded-full bg-primary" />
              {item}
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs text-muted-foreground">
          {TABLE_ROW_COUNT.toLocaleString(language)}{" "}
          {p("compoundTable.meta.records")} ·{" "}
          {lastChangeTag ? (
            <>
              {p("compoundTable.meta.lastEvent")}:{" "}
              <code className="text-foreground">{lastChangeTag}</code>
            </>
          ) : (
            p("compoundTable.meta.interact")
          )}
        </p>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("compoundTable.showcase.title")}
        description={p("compoundTable.showcase.description")}
        layout="stack"
      >
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
            sidePanelTemplate={(row) => {
              const r = row as LocalizedCommerceUserRow;
              return (
                <aside className="flex h-full w-80 shrink-0 flex-col gap-4 overflow-y-auto rounded-md border border-table-border bg-table p-4">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-base font-semibold">{r.name}</h3>
                    <Badge severity="primary">#{r.id}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground dir-ltr">
                    {r.email}
                  </p>
                  <StatusBox
                    text={r.statusLabel}
                    color={STATUS_COLORS[r.status]}
                  />
                  <dl className="grid gap-2 text-sm">
                    <div className="flex justify-between gap-2">
                      <dt className="text-muted-foreground">
                        {p("sidePanel.region")}
                      </dt>
                      <dd>{r.regionLabel}</dd>
                    </div>
                    <div className="flex justify-between gap-2">
                      <dt className="text-muted-foreground">
                        {p("sidePanel.segment")}
                      </dt>
                      <dd>{r.segmentLabel}</dd>
                    </div>
                    <div className="flex justify-between gap-2">
                      <dt className="text-muted-foreground">
                        {p("sidePanel.orders")}
                      </dt>
                      <dd>{r.orders.toLocaleString(language)}</dd>
                    </div>
                    <div className="flex justify-between gap-2">
                      <dt className="text-muted-foreground">
                        {p("sidePanel.totalSpent")}
                      </dt>
                      <dd>
                        {formatCurrency(r.totalSpent)}
                        {p("sampleData.currencySuffix")}
                      </dd>
                    </div>
                  </dl>
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    {r.notes}
                  </p>
                </aside>
              );
            }}
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
                <Badge severity="info" className="me-2 hidden sm:inline-flex">
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
                isLoading: loading,
                onRequest: () =>
                  window.alert(
                    p("bulkActions.exportFilteredAlert", {
                      count: filteredRows.length,
                    }),
                  ),
              },
            }}
            actionFilterProps={{
              sort: ["status", "region", "name", "orders"],
            }}
          />
        </div>
      </ShowcaseSection>
    </CatalogPageShell>
  );
}
