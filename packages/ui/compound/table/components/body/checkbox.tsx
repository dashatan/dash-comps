import { Checkbox } from '@/components/common/inputs/checkbox'
import { useTableStore } from '../../context'
import { cn } from '@/lib'

export namespace TableCheckbox {
  export function SelectAll({
    ids,
    onChange,
  }: {
    ids?: (number | string)[]
    onChange?: (selected: (number | string)[]) => void
  }) {
    const selectAll = useTableStore((s) => s.selectAll)
    const selected = useTableStore((s) => s.selected)
    const setSelected = useTableStore((s) => s.setSelected)
    const setSelectAll = useTableStore((s) => s.setSelectAll)

    const pageIsSelected = !!ids?.length && ids?.every((x) => selected?.includes(x))
    const checked = selectAll || pageIsSelected

    return (
      <div className="relative me-0 flex items-center rounded-md p-2">
        <Checkbox.Basic
          onChange={(active) => {
            setSelectAll(false)
            if (active && ids) {
              const newSelected = [...(selected || []), ...ids.filter((x) => !selected?.includes(x))]
              setSelected(newSelected)
              onChange?.(newSelected)
            } else {
              const newSelected = selected?.filter((x) => !ids?.includes(x))
              setSelected(newSelected)
              if (newSelected) onChange?.(newSelected)
            }
          }}
          checked={checked}
          className={cn('border-table-border bg-table-checkbox')}
        />
      </div>
    )
  }

  export function SelectOne({
    value,
    onChange,
  }: {
    value: string | number
    onChange?: (selected: (number | string)[]) => void
  }) {
    const selectAll = useTableStore((s) => s.selectAll)
    const selected = useTableStore((s) => s.selected)
    const setSelected = useTableStore((s) => s.setSelected)
    const checked = selectAll || selected?.includes(value)

    return (
      <div className="flex w-full items-center justify-center">
        <Checkbox.Basic
          checked={checked}
          className={cn('border-table-border bg-table-checkbox')}
          onChange={() => {
            let newSelected = [...(selected || [])]
            if (newSelected.includes(value)) {
              newSelected = newSelected.filter((x) => x !== value)
            } else {
              newSelected = [...newSelected, value]
            }
            setSelected(newSelected)
            onChange?.(newSelected)
          }}
        />
      </div>
    )
  }
}
