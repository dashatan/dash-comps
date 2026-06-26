import { createStore } from "zustand/vanilla";
import { ChangeTag, FilterValue, TableData, tableDefaultState } from "./types";
import {
  areFiltersEqual,
  isSameFilterValue,
  normalizeFilterValue,
  normalizeFilters,
} from "./utils/is-same-filter-value";

export type TableOnChange = (data: TableData, tag: ChangeTag) => void;

export type TableStoreState = TableData & {
  setPage: (page: number) => void;
  setRows: (rows: number) => void;
  setSort: (sortField: string, sortOrder: TableData["sortOrder"]) => void;
  setFilter: (key: string, value: FilterValue | undefined) => void;
  setFilters: (filters: TableData["filters"]) => void;
  applyFilterValues: (values: Partial<TableData>) => void;
  toggleFilterRow: () => void;
  setSelected: (selected: TableData["selected"]) => void;
  clearSelected: () => void;
  setSelectAll: (selectAll: boolean) => void;
  toggleExpandedRow: (key: string | number, open?: boolean) => void;
  setActiveColumns: (activeColumns: string[]) => void;
  setSidePanelData: (data: TableData["sidePanelData"]) => void;
  setTotalRecords: (totalRecords: number | undefined) => void;
  setShowFilterChips: (show: boolean) => void;
  reset: (partial?: Partial<TableData>) => void;
  getSnapshot: () => TableData;
  emit: (tag: ChangeTag) => void;
};

export type TableStore = ReturnType<typeof createTableStore>;

function toSnapshot(state: TableData): TableData {
  return {
    first: state.first,
    rows: state.rows,
    offset: state.offset,
    page: state.page,
    totalRecords: state.totalRecords,
    selected: state.selected,
    selectAll: state.selectAll,
    sortField: state.sortField,
    sortOrder: state.sortOrder,
    searchField: state.searchField,
    searchText: state.searchText,
    showFilter: state.showFilter,
    showFilterChips: state.showFilterChips,
    activeColumns: state.activeColumns,
    filters: state.filters,
    expandedRows: state.expandedRows,
    sidePanelData: state.sidePanelData,
  };
}

export function createTableStore(
  initial: Partial<TableData> = {},
  onChange?: TableOnChange,
) {
  return createStore<TableStoreState>((set, get) => ({
    ...tableDefaultState,
    ...initial,

    setPage: (page) => {
      const rowsPerPage = get().rows ?? tableDefaultState.rows ?? 15;
      const offset = page * rowsPerPage;
      set({ page, offset, first: offset });
      get().emit("pagination");
    },

    setRows: (rows) => {
      set({ rows, page: 0, offset: 0, first: 0 });
      get().emit("rows");
    },

    setSort: (sortField, sortOrder) => {
      set({ sortField, sortOrder });
      get().emit("sort");
    },

    setFilter: (key: string, value: FilterValue | undefined) => {
      const next = normalizeFilterValue(value);
      const prev = get().filters?.[key];
      if (isSameFilterValue(prev, next)) return;

      const filters = { ...get().filters, [key]: next };
      set({ filters, page: 0, offset: 0, first: 0 });
      get().emit("filter");
    },

    setFilters: (filters) => {
      const normalized = normalizeFilters(filters);
      if (areFiltersEqual(get().filters, normalized)) return;

      set({ filters: normalized, page: 0, offset: 0, first: 0 });
      get().emit("filter");
    },

    applyFilterValues: (values) => {
      const current = get();
      const nextFilters =
        values.filters !== undefined
          ? normalizeFilters(values.filters)
          : current.filters;

      if (
        values.filters !== undefined &&
        areFiltersEqual(current.filters, nextFilters) &&
        Object.keys(values).every(
          (key) =>
            key === "filters" ||
            values[key as keyof TableData] === current[key as keyof TableData],
        )
      ) {
        return;
      }

      set({ ...values, filters: nextFilters, page: 0, offset: 0, first: 0 });
      get().emit("filter");
    },

    toggleFilterRow: () => {
      set({ showFilter: !get().showFilter });
    },

    setSelected: (selected) => {
      set({ selected, selectAll: false });
      get().emit("selection");
    },

    clearSelected: () => {
      set({ selected: [], selectAll: false });
      get().emit("selection");
    },

    setSelectAll: (selectAll) => {
      set({ selectAll });
      get().emit("selection");
    },

    toggleExpandedRow: (key, open) => {
      const expandedRows = { ...(get().expandedRows || {}) };
      const isOpen = expandedRows[key];
      if (open === false || (open === undefined && isOpen)) {
        delete expandedRows[key];
      } else {
        expandedRows[key] = true;
      }
      set({ expandedRows });
    },

    setActiveColumns: (activeColumns) => {
      set({ activeColumns });
      get().emit("order");
    },

    setSidePanelData: (sidePanelData) => {
      set({ sidePanelData });
    },

    setTotalRecords: (totalRecords) => {
      set({ totalRecords });
    },

    setShowFilterChips: (showFilterChips) => {
      set({ showFilterChips });
    },

    reset: (partial) => {
      set({ ...tableDefaultState, ...partial });
    },

    getSnapshot: () => toSnapshot(get()),

    emit: (tag) => {
      onChange?.(get().getSnapshot(), tag);
    },
  }));
}

export type TableStoreApi = Pick<
  TableStoreState,
  | "getSnapshot"
  | "setSelected"
  | "clearSelected"
  | "setSelectAll"
  | "reset"
  | "setFilter"
  | "setFilters"
  | "setPage"
  | "setRows"
  | "setSort"
  | "toggleFilterRow"
  | "toggleExpandedRow"
  | "setActiveColumns"
  | "setSidePanelData"
  | "setTotalRecords"
  | "emit"
>;
