'use client'

import { createContext, useContext, useMemo, useRef, useEffect, type ReactNode } from 'react'
import { useStore } from 'zustand'
import { createTableStore, type TableOnChange, type TableStore, type TableStoreApi } from './store'
import { TableData, tableDefaultState } from './types'

type TableStoreContextValue = TableStore

const TableStoreContext = createContext<TableStoreContextValue | null>(null)

function buildInitialState(
  defaultValues?: Partial<TableData>,
  totalRecords?: number,
): Partial<TableData> {
  const hasFilter =
    defaultValues?.filters && Object.keys(defaultValues.filters).length > 0

  return {
    ...tableDefaultState,
    ...defaultValues,
    showFilter: hasFilter ? true : defaultValues?.showFilter,
    showFilterChips: hasFilter ? true : defaultValues?.showFilterChips,
    totalRecords: totalRecords ?? defaultValues?.totalRecords ?? 0,
  }
}

export type TableStoreProviderProps = {
  children: ReactNode
  defaultValues?: Partial<TableData>
  totalRecords?: number
  onTableChange?: TableOnChange
}

export function TableStoreProvider({
  children,
  defaultValues,
  totalRecords,
  onTableChange,
}: TableStoreProviderProps) {
  const onChangeRef = useRef(onTableChange)
  onChangeRef.current = onTableChange

  const defaultValuesSignature = useMemo(
    () => (defaultValues ? JSON.stringify(defaultValues) : null),
    [defaultValues],
  )

  const storeRef = useRef<TableStore | null>(null)
  if (!storeRef.current) {
    storeRef.current = createTableStore(
      buildInitialState(defaultValues, totalRecords),
      (data, tag) => onChangeRef.current?.(data, tag),
    )
  }

  useEffect(() => {
    if (!defaultValuesSignature) return
    const parsed = JSON.parse(defaultValuesSignature) as Partial<TableData>
    storeRef.current?.getState().reset(buildInitialState(parsed, parsed.totalRecords))
  }, [defaultValuesSignature])

  useEffect(() => {
    if (totalRecords !== undefined) {
      storeRef.current?.getState().setTotalRecords(totalRecords)
    }
  }, [totalRecords])

  return (
    <TableStoreContext.Provider value={storeRef.current}>
      {children}
    </TableStoreContext.Provider>
  )
}

export function useTableStoreContext() {
  const store = useContext(TableStoreContext)
  if (!store) {
    throw new Error('useTableStore must be used within TableStoreProvider')
  }
  return store
}

export function useTableStore<T>(selector: (state: ReturnType<TableStore['getState']>) => T): T {
  const store = useTableStoreContext()
  return useStore(store, selector)
}

export function useTableStoreApi(): TableStoreApi {
  const store = useTableStoreContext()
  return useMemo(
    () => ({
      getSnapshot: () => store.getState().getSnapshot(),
      setSelected: (selected) => store.getState().setSelected(selected),
      clearSelected: () => store.getState().clearSelected(),
      setSelectAll: (selectAll) => store.getState().setSelectAll(selectAll),
      reset: (partial) => store.getState().reset(partial),
      setFilter: (key, value) => store.getState().setFilter(key, value),
      setFilters: (filters) => store.getState().setFilters(filters),
      setPage: (page) => store.getState().setPage(page),
      setRows: (rows) => store.getState().setRows(rows),
      setSort: (sortField, sortOrder) => store.getState().setSort(sortField, sortOrder),
      toggleFilterRow: () => store.getState().toggleFilterRow(),
      toggleExpandedRow: (key, open) => store.getState().toggleExpandedRow(key, open),
      setActiveColumns: (activeColumns) => store.getState().setActiveColumns(activeColumns),
      setSidePanelData: (data) => store.getState().setSidePanelData(data),
      setTotalRecords: (total) => store.getState().setTotalRecords(total),
      emit: (tag) => store.getState().emit(tag),
    }),
    [store],
  )
}
