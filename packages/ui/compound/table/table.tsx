import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import orderColumns from './utils/order-columns'
import { applyDragScroll } from './utils/scroll-drag'
import ActionHeader from './components/header/action-header'
import { ColumnProps, TableData, TableProps } from './types'
import ActionFilters from './components/header/action-filters'
import Body from './components/body'
import Header from './components/header'
import { cn } from '@/lib'
import { useTableStore, useTableStoreContext } from './context'

const MIN_COL_WIDTH = 50

function colKey(col: ColumnProps, index: number) {
  return String(col.id ?? col.field ?? index)
}

function measureIntrinsicWidth(el: HTMLElement, chrome: number) {
  const prevCssText = el.style.cssText
  el.style.position = 'absolute'
  el.style.width = 'max-content'
  el.style.visibility = 'hidden'
  const intrinsic = el.getBoundingClientRect().width
  el.style.cssText = prevCssText
  return Math.ceil(intrinsic + chrome)
}

function measureHeaderMinWidth(th: HTMLTableCellElement) {
  const label = th.querySelector<HTMLElement>('[data-slot="header-label"]')
  if (!label) return MIN_COL_WIDTH
  const chrome = th.getBoundingClientRect().width - label.getBoundingClientRect().width
  return Math.max(MIN_COL_WIDTH, measureIntrinsicWidth(label, chrome))
}

function measureCellContentWidth(td: HTMLTableCellElement) {
  const inner = td.querySelector<HTMLElement>('[data-slot="body-cell-content"]') ?? td.firstElementChild
  if (!inner || !(inner instanceof HTMLElement)) {
    return Math.max(MIN_COL_WIDTH, td.scrollWidth)
  }
  const cellStyle = getComputedStyle(td)
  const padX = parseFloat(cellStyle.paddingLeft) + parseFloat(cellStyle.paddingRight)
  return Math.max(MIN_COL_WIDTH, measureIntrinsicWidth(inner, padX))
}

function measureBodyMinWidth(table: HTMLTableElement, colIndex: number) {
  const rows = Array.from(table.querySelectorAll<HTMLTableRowElement>('tbody tr'))
  let max = MIN_COL_WIDTH

  for (const row of rows) {
    if (row.cells.length === 1 && row.cells[0].colSpan > 1) continue
    const td = row.cells[colIndex]
    if (!td) continue
    max = Math.max(max, measureCellContentWidth(td))
  }

  return max
}

function measureColumnMinWidth(th: HTMLTableCellElement, colIndex: number, table: HTMLTableElement) {
  return Math.max(MIN_COL_WIDTH, measureHeaderMinWidth(th), measureBodyMinWidth(table, colIndex))
}

export function TableComponent({
  columns: initialColumns,
  data,
  loading = false,
  showActionHeader = false,
  showActionFilters = false,
  expandOnNewRow = false,
  dataKey = 'id',
  draggable = false,
  columnHover = false,
  fullScreen = false,
  actionHeaderProps,
  actionFilterProps,
  THProps,
  TDProps,
  rowProps,
  className,
  rowExpansionTemplate,
  sidePanelTemplate,
  rightClickMenu,
}: TableProps) {
  const store = useTableStoreContext()
  const storeActiveColumns = useTableStore((s) => s.activeColumns)
  const sidePanelData = useTableStore((s) => s.sidePanelData)
  const showFilterChips = useTableStore((s) => s.showFilterChips)
  const setSidePanelData = useTableStore((s) => s.setSidePanelData)
  const setActiveColumns = useTableStore((s) => s.setActiveColumns)

  const columnFieldsKey = useMemo(
    () => initialColumns?.map((c) => `${c.field ?? ''}:${c.defaultInactive ? 1 : 0}`).join('|') ?? '',
    [initialColumns],
  )

  const defaultActiveFields = useMemo(
    () =>
      initialColumns?.flatMap((x) => (!x.defaultInactive && x.field ? (x.field as string) : [])) ?? [],
    [columnFieldsKey, initialColumns],
  )

  const activeColumns = storeActiveColumns?.length ? storeActiveColumns : defaultActiveFields
  const activeColumnsKey = activeColumns.join(',')

  const columns = useMemo(
    () => orderColumns(initialColumns || [], activeColumns),
    [initialColumns, activeColumnsKey],
  )

  const [hoveredColumnIndex, setHoveredColumnIndex] = useState<number | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [colWidths, setColWidths] = useState<Record<string, number>>({})
  const columnMinWidthsRef = useRef<Record<string, number>>({})
  const colRefs = useRef<(HTMLTableColElement | null)[]>([])
  const scrollRef = useRef<HTMLDivElement>(null)
  const dragStart = useRef({ x: 0, y: 0, scrollLeft: 0, scrollTop: 0 })
  const noResult = !loading && !data?.length

  useEffect(() => {
    if (sidePanelData && loading) {
      setSidePanelData(undefined)
    }
  }, [loading, sidePanelData, setSidePanelData])

  useEffect(() => {
    const validFields = new Set(
      initialColumns?.flatMap((c) => (c.field ? [c.field as string] : [])) ?? [],
    )
    const current = store.getState().activeColumns ?? []

    if (!current.length && defaultActiveFields.length) {
      setActiveColumns(defaultActiveFields)
      return
    }

    const filtered = current.filter((field) => validFields.has(field))
    if (filtered.length !== current.length) {
      setActiveColumns(filtered.length ? filtered : defaultActiveFields)
    }
  }, [columnFieldsKey, defaultActiveFields, setActiveColumns, store, initialColumns])

  useLayoutEffect(() => {
    const table = scrollRef.current?.querySelector('table')
    const ths = scrollRef.current?.querySelectorAll<HTMLTableCellElement>('thead tr:first-child th')
    if (!table || !ths?.length || !columns?.length) return

    const nextMinWidths: Record<string, number> = {}
    const measurements = Array.from(ths).flatMap((th, i) => {
      const col = columns[i]
      if (!col) return []
      const key = colKey(col, i)
      const minWidth = measureColumnMinWidth(th, i, table)
      nextMinWidths[key] = minWidth
      return {
        key,
        minWidth,
        rendered: th.getBoundingClientRect().width,
      }
    })

    columnMinWidthsRef.current = nextMinWidths

    setColWidths((prev) => {
      let changed = false
      const next = { ...prev }
      for (const { key, minWidth, rendered } of measurements) {
        const current = next[key] ?? rendered
        if (current + 0.5 < minWidth) {
          next[key] = minWidth
          changed = true
        }
      }
      return changed ? next : prev
    })
  }, [columns, data, loading])

  const handleOrder = useCallback(
    ({ activeColumns: cols }: TableData) => {
      if (loading) return
      setActiveColumns(cols || [])
    },
    [loading, setActiveColumns],
  )

  const stopDragging = useCallback(() => {
    setIsDragging(false)
  }, [])

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (!draggable || !scrollRef.current) return
      setIsDragging(true)
      dragStart.current = {
        x: e.pageX - scrollRef.current.offsetLeft,
        y: e.pageY - scrollRef.current.offsetTop,
        scrollLeft: scrollRef.current.scrollLeft,
        scrollTop: scrollRef.current.scrollTop,
      }
    },
    [draggable],
  )

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging || !scrollRef.current) return
      e.preventDefault()
      const x = e.pageX - scrollRef.current.offsetLeft
      const y = e.pageY - scrollRef.current.offsetTop
      applyDragScroll(
        scrollRef.current,
        dragStart.current.scrollLeft,
        dragStart.current.scrollTop,
        x - dragStart.current.x,
        y - dragStart.current.y,
      )
    },
    [isDragging],
  )

  useEffect(() => {
    if (!isDragging) return
    window.addEventListener('mouseup', stopDragging)
    return () => window.removeEventListener('mouseup', stopDragging)
  }, [isDragging, stopDragging])

  function handleColumnResizeStart(e: React.PointerEvent, index: number) {
    const handle = e.currentTarget as HTMLElement
    const th = handle.closest('th')
    const col = columns?.[index]
    const colEl = colRefs.current[index]
    const table = scrollRef.current?.querySelector('table')
    if (!th || !col || !colEl || !table) return
    e.preventDefault()
    const startX = e.clientX
    const startWidth = th.getBoundingClientRect().width
    const key = colKey(col, index)
    const minWidth =
      columnMinWidthsRef.current[key] ?? measureColumnMinWidth(th, index, table)
    const dir = getComputedStyle(th).direction === 'rtl' ? -1 : 1

    const computeWidth = (ev: PointerEvent) =>
      Math.max(minWidth, startWidth + (ev.clientX - startX) * dir)

    const onMove = (ev: PointerEvent) => {
      colEl.style.width = `${computeWidth(ev)}px`
    }
    const onUp = (ev: PointerEvent) => {
      setColWidths((prev) => ({ ...prev, [key]: computeWidth(ev) }))
      handle.removeEventListener('pointermove', onMove)
    }
    handle.setPointerCapture(e.pointerId)
    handle.addEventListener('pointermove', onMove)
    handle.addEventListener('pointerup', onUp, { once: true })
  }

  function handleColumnResizeReset(index: number) {
    const col = columns?.[index]
    if (!col) return
    setColWidths((prev) => {
      const next = { ...prev }
      delete next[colKey(col, index)]
      return next
    })
  }

  function getColWidth(col: ColumnProps, index: number, all: ColumnProps[]) {
    const resized = colWidths[colKey(col, index)]
    if (resized) return resized
    if (index === all.length - 2) return undefined
    return col.width ?? col.style?.width ?? col.style?.minWidth
  }

  function getNumericColWidth(col: ColumnProps, index: number, all: ColumnProps[]) {
    const width = getColWidth(col, index, all)
    if (typeof width === 'number') return width
    const parsed = typeof width === 'string' ? parseFloat(width) : NaN
    return Number.isNaN(parsed) ? undefined : parsed
  }

  function resolveFrozenColumns(cols?: ColumnProps[]) {
    if (!cols?.some((c) => c.frozen)) return cols
    return cols.map((col, i, a) => {
      if (!col.frozen) return col
      const { pos } = col.frozen
      const sameSide = (j: number) => a[j].frozen?.pos === pos
      const closerToEdge = (j: number) => (pos === 'right' ? j < i : j > i)
      const edge = !a.some((_, j) => j !== i && sameSide(j) && !closerToEdge(j))
      let distance = 0
      for (let j = 0; j < a.length; j++) {
        if (j === i || !sameSide(j) || !closerToEdge(j)) continue
        const width = getNumericColWidth(a[j], j, a)
        if (width === undefined) return { ...col, frozen: { ...col.frozen, edge } }
        distance += width
      }
      return { ...col, frozen: { ...col.frozen, distance, edge } }
    })
  }

  const resolvedColumns = resolveFrozenColumns(columns)

  const tableContent = (
    <div
      id="table-container"
      className={cn('flex h-full min-h-0 w-full flex-col overflow-hidden', className?.l1)}
    >
      {showActionHeader && (
        <ActionHeader
          {...actionHeaderProps}
          columns={initialColumns}
          activeColumns={activeColumns}
          onOrderChange={handleOrder}
          loading={loading}
        />
      )}
      {showActionFilters && showFilterChips && (
        <ActionFilters columns={initialColumns} {...actionFilterProps} />
      )}
      <div
        id="table-content"
        className={cn('flex min-h-0 flex-1 flex-row gap-4 overflow-hidden', { 'p-4': showActionHeader }, className?.l2)}
      >
        <div
          ref={scrollRef}
          id="table-inner"
          className={cn(
            'border-table-border relative min-h-0 w-full min-w-0 flex-1 overflow-auto rounded-md border',
            draggable && 'cursor-grab select-none',
            draggable && isDragging && 'cursor-grabbing',
            !draggable && 'select-text',
            noResult && 'flex flex-col',
            className?.l3,
          )}
          onMouseDown={draggable ? handleMouseDown : undefined}
          onMouseMove={draggable ? handleMouseMove : undefined}
          onMouseUp={draggable ? stopDragging : undefined}
          onMouseLeave={draggable ? stopDragging : undefined}
        >
          <table
            id="table-non-scrollable"
            className={cn('w-full table-fixed border-separate border-spacing-0', className?.table)}
          >
            <colgroup>
              {columns?.map((col, i, a) => (
                <col
                  key={colKey(col, i)}
                  ref={(el) => {
                    colRefs.current[i] = el
                  }}
                  style={{ width: getColWidth(col, i, a) }}
                />
              ))}
            </colgroup>
            <Header
              actionHeaderProps={actionHeaderProps}
              columns={resolvedColumns}
              loading={loading}
              THProps={THProps}
              columnHover={columnHover}
              hoveredColumnIndex={hoveredColumnIndex}
              onColumnHover={setHoveredColumnIndex}
              onColumnResizeStart={handleColumnResizeStart}
              onColumnResizeReset={handleColumnResizeReset}
            />
            <Body
              columns={resolvedColumns}
              data={data}
              dataKey={dataKey}
              loading={loading}
              rightClickMenu={rightClickMenu}
              rowExpansionTemplate={rowExpansionTemplate}
              rowProps={rowProps}
              expandOnNewRow={expandOnNewRow}
              TDProps={TDProps}
              columnHover={columnHover}
              hoveredColumnIndex={hoveredColumnIndex}
              onColumnHover={setHoveredColumnIndex}
              draggable={draggable}
            />
          </table>
        </div>
        {sidePanelData && sidePanelTemplate && sidePanelTemplate(sidePanelData)}
      </div>
    </div>
  )

  if (fullScreen) {
    return <div className="bg-background fixed inset-0 z-9999 flex flex-col">{tableContent}</div>
  }

  return tableContent
}
