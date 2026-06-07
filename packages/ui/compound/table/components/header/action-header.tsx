import { memo, useCallback, useMemo, useState } from 'react'
import Pagination from './paginator'
import { Cog, Loader2, Search, X } from 'lucide-react'
import {
  SelectItem,
  SingleSelectProps,
  TableHeaderChangeEvent,
} from '@/components/common/inputs/select/types'
import {
  ColumnProps,
  TableData,
  TableStoreApi,
  tableDefaultState,
  TableProps,
} from '@/components/compound/table/types'
import { orderColumnsWithoutHide } from '@/components/compound/table/utils/order-columns'
import { Select } from '@/components/common/inputs/select'
import { cn, getDocumentDirection, useLanguage } from '@/lib'
import Badge from '@/components/common/badge'
import Button from '@/components/common/buttons'
import ExcelIcon from '@/components/common/icons/ExcelIcon'
import { ButtonProps } from '@/components/common/buttons/types'
import { useTableStore, useTableStoreApi } from '@/components/compound/table/context'

function resolveColumnLabel(col: ColumnProps): string {
  if (typeof col.header === 'string') return col.header
  return col.field ?? String(col.id ?? '')
}

export interface ActionHeaderProps {
  bulkActionsOptions?: (Omit<SelectItem, 'onChange'> & {
    onChange?: (value: SelectItem['value'], api?: TableStoreApi) => void | Promise<void>
  })[]
  bulActionsProps?: SingleSelectProps
  firstExtraElements?: React.ReactNode
  secondExtraElements?: React.ReactNode
  totalSelected?: number
  columns?: ColumnProps[]
  activeColumns?: string[]
  onOrderChange?: (data: TableData) => void
  onChange?: TableProps['onTableChange']
  loading?: boolean
  hideBulkActions?: boolean
  hideFilter?: boolean
  hideTotalSelectedClearBtn?: boolean
  excelExportOptions?: { isLoading: boolean; onRequest: () => void }
  className?: string | { container?: string; firstSection?: string; secondSection?: string }
}

function ActionHeaderFunction(props: ActionHeaderProps) {
  const { t, language } = useLanguage()
  const isRtl = getDocumentDirection(language) === 'rtl'
  const { onOrderChange } = props
  const api = useTableStoreApi()
  const selected = useTableStore((s) => s.selected)
  const selectAll = useTableStore((s) => s.selectAll)
  const totalRecords = useTableStore((s) => s.totalRecords)
  const rows = useTableStore((s) => s.rows)
  const showFilter = useTableStore((s) => s.showFilter)
  const [reorder, setReorder] = useState(false)
  const totalSelected = selectAll ? totalRecords : selected?.length

  const containerClass =
    typeof props.className === 'string' ? props.className : props.className?.container
  const firstSectionClass =
    typeof props.className === 'object' ? props.className?.firstSection : undefined
  const secondSectionClass =
    typeof props.className === 'object' ? props.className?.secondSection : undefined

  const handleColumnsOrder = useCallback(
    ({ data, selected: sel }: TableHeaderChangeEvent) => {
      const nextActiveColumns = data?.flatMap((x) =>
        sel?.includes(x.value) ? (x.value as string) : [],
      )
      onOrderChange?.({ activeColumns: nextActiveColumns })
    },
    [onOrderChange],
  )

  const handleRefresh = useCallback(() => {
    setReorder(true)
    onOrderChange?.({ activeColumns: props.columns?.flatMap((x) => x.field || []) })
  }, [onOrderChange, props.columns])

  const activeColumnsKey = (props.activeColumns ?? []).join(',')

  const columnsOptions = useMemo(
    () =>
      orderColumnsWithoutHide(props.columns || [], props.activeColumns || []).flatMap((x) => {
        if (!x.field) return []
        return { label: resolveColumnLabel(x), value: x.field as string }
      }),
    [props.columns, activeColumnsKey],
  )

  function handleRows(newRows: number) {
    api.setRows(newRows)
  }

  function handleToggleFilter() {
    api.toggleFilterRow()
  }

  return (
    <div
      className={cn(
        'flex w-full items-center justify-between overflow-x-auto border-t border-b px-4',
        isRtl ? 'flex-row' : 'flex-row-reverse',
        containerClass,
      )}
    >
      <div
        className={cn(
          'flex min-h-20 items-center gap-2 py-2',
          isRtl ? 'flex-row' : 'flex-row-reverse',
          firstSectionClass,
        )}
      >
        <Pagination loading={props.loading} />
        <Select.Single
          label={t('table.rowCount')}
          value={rows || tableDefaultState.rows}
          onChange={(e) => e && handleRows(e as number)}
          scrollable
          options={[
            { label: t('table.item', { count: 5 }), value: 5, title: '5' },
            { label: t('table.item', { count: 10 }), value: 10, title: '10' },
            { label: t('table.item', { count: 15 }), value: 15, title: '15' },
            { label: t('table.item', { count: 20 }), value: 20, title: '20' },
            { label: t('table.item', { count: 50 }), value: 50, title: '50' },
            { label: t('table.item', { count: 100 }), value: 100, title: '100' },
            { label: t('table.item', { count: 1000 }), value: 1000, title: '1000' },
          ]}
        />
        {!props.hideBulkActions && (
          <Select.Single
            {...props.bulActionsProps}
            label={t('table.bulkActions', { defaultValue: 'Bulk actions' })}
            options={props.bulkActionsOptions}
            fitContent
            scrollable
            noValueChange
            itemTemplate={(option) => {
              const bulkOption = option as (typeof props.bulkActionsOptions extends (infer U)[] | undefined
                ? U
                : never) & {
                onChange?: (value: SelectItem['value'], api?: TableStoreApi) => void
              }
              return (
                <li
                  className={cn(
                    'flex cursor-pointer items-center gap-2 border-b p-2',
                    'text-sm font-medium hover:bg-table-row',
                    option.className,
                  )}
                  onClick={() => bulkOption.onChange?.(option.value, api)}
                >
                  <span className="flex w-8 scale-75 justify-center">{option.icon}</span>
                  <span>{option.label}</span>
                </li>
              )
            }}
          />
        )}
        <Select.MultiOrderable
          options={columnsOptions}
          labelTemplate={
            <ActionButton tooltip={t('table.tableSettings')} tooltipOptions={{ sideOffset: 22 }}>
              <Cog className="size-7 text-icon" />
            </ActionButton>
          }
          onChange={handleColumnsOrder}
          onRefresh={handleRefresh}
          selected={props.activeColumns}
          heading={t('table.tableSettings')}
          subHeading={t('table.tableOrder')}
          reorder={reorder}
          setReorder={setReorder}
          fitContent
          width={80}
        />
        {!props.hideFilter && (
          <ActionButton tooltip="Filters" onClick={handleToggleFilter}>
            <Search className={cn('size-6', showFilter && 'text-primary')} />
          </ActionButton>
        )}
        {props.excelExportOptions && (
          <ActionButton onClick={props.excelExportOptions.onRequest}>
            {props.excelExportOptions.isLoading ? (
              <Loader2 className="size-6 animate-spin" />
            ) : (
              <ExcelIcon color="var(--color-icon)" className="size-6!" />
            )}
          </ActionButton>
        )}
        {props.firstExtraElements}
      </div>
      <div className={cn('flex h-full items-center', secondSectionClass)}>
        {!props.hideTotalSelectedClearBtn && (
          <div className="flex h-full w-20 items-center justify-center border-e">
            <div onClick={() => api.clearSelected()}>
              <Badge severity={!totalSelected ? 'info' : 'primary'} withRing disabled={!totalSelected}>
                {!!totalSelected && <X className="size-3" />}
                <span className="me-px mt-px">{totalSelected || 0}</span>
              </Badge>
            </div>
          </div>
        )}
        {props.secondExtraElements}
      </div>
    </div>
  )
}

const ActionHeader = memo(ActionHeaderFunction)
export default ActionHeader

export function ActionButton(props: ButtonProps) {
  return (
    <Button
      asChild
      variant="outlined"
      severity="info"
      className={cn('size-14 min-w-14 border bg-input p-0 text-icon', props.className)}
      {...props}
    >
      <span>{props.children}</span>
    </Button>
  )
}
