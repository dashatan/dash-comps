'use client'
import { cn, nestedSearch } from '@/lib'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { TreeSelectItem, SingleSelectTreeProps as SingleSelectTreePropsType } from './types'
import SelectContainer from './container'
import { RecursiveSelectItemSingle } from './comps/recursive-select-item-single'
import { flattenData } from './utils'
const initialDepth = 1
export default function SingleSelectTree({ value, openedAll, showChips, ...props }: SingleSelectTreePropsType) {
  const [opened, setOpened] = useState<(number | string)[]>([])
  const [data, setData] = useState<TreeSelectItem[] | undefined>(props.options)
  const [open, setOpen] = useState(false)
  const selectedOption = useMemo(() => {
    const flatData = flattenData(props.options || [])
    const findOption = flatData?.find((x) => x.value === value)
    return findOption ? [findOption] : []
  }, [value, props.options])

  useEffect(() => {
    setOpened(openedAll ? props.options?.map((x) => x.value) || [] : [])
  }, [openedAll, props.options])

  useEffect(() => {
    setData(props.options)
  }, [props.options])

  const handleChange = useCallback(
    (option: TreeSelectItem) => {
      const newVal = value === option.value ? undefined : option.value
      props.onChange?.(newVal)
    },
    [props.onChange, value]
  )

  function handleChangeOpened(option: TreeSelectItem) {
    if (opened.includes(option.value)) {
      setOpened((x) => x.filter((y) => y !== option.value))
    } else {
      setOpened((x) => [...x, option.value])
    }
  }

  function handleSearch(text?: string) {
    if (!props.options) return
    const newData = nestedSearch(props.options, 'label', text)
    setData(newData)
  }

  function handleClear() {
    props.onChange?.(undefined)
  }

  return (
    <SelectContainer
      {...props}
      count={value ? 1 : 0}
      chips={selectedOption}
      showChips={showChips && value !== undefined}
      onClear={handleClear}
      onSearch={handleSearch}
      onRemove={handleClear}
      open={open}
      onOpenChange={setOpen}
      labelType='simple'
      value={selectedOption[0]?.label}
    >
      <ul className={cn('flex max-h-60 min-h-60 w-full flex-col overflow-y-auto', props.className?.dropdown?.body)}>
        {data?.map((option, index, a) => {
          return (
            <RecursiveSelectItemSingle
              key={index}
              depth={initialDepth}
              opened={opened}
              selected={value}
              last={index === a.length - 1}
              option={option}
              onChange={handleChange}
              onCollapse={handleChangeOpened}
            />
          )
        })}
      </ul>
    </SelectContainer>
  )
}
