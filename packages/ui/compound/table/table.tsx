import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import orderColumns from './utils/order-columns'
import { applyDragScroll } from './utils/scroll-drag'
import ActionHeader from './components/header/action-header'
import { TableData, TableProps } from './types'
import ActionFilters from './components/header/action-filters'
import Body from './components/body'
import Header from './components/header'
import { cn } from '@/lib'
import { useTableStore, useTableStoreContext } from './context'

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
        className={cn('flex min-h-0 flex-1 flex-col overflow-hidden', { 'p-4': showActionHeader }, className?.l2)}
      >
        <div
          ref={scrollRef}
          id="table-inner"
          className={cn(
            'border-table-border relative min-h-0 w-full min-w-0 flex-1 overflow-x-auto overflow-y-auto rounded-md border',
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
            className={cn('w-max min-w-full border-separate border-spacing-0', className?.table)}
          >
            <Header
              actionHeaderProps={actionHeaderProps}
              columns={columns}
              loading={loading}
              THProps={THProps}
              columnHover={columnHover}
              hoveredColumnIndex={hoveredColumnIndex}
              onColumnHover={setHoveredColumnIndex}
            />
            <Body
              columns={columns}
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
