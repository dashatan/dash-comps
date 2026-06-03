import { useEffect, useRef, useState } from 'react'
import SimpleText from '../inputs/simple-text'
import { PlateValue } from '@/components/compound/license-plate/types'
import { cn } from '@/lib'

/* ---------------------------------- Types --------------------------------- */

export type SimplePlateInputProps = {
  onChange: (val: PlateValue) => void
  values?: PlateValue
  colorCode?: string
  clear?: boolean
  onClear?: (clear: boolean) => void
  id?: string
}

/* ------------------------------ Main Function ----------------------------- */
export default function SimplePlate({ onChange, id, ...props }: SimplePlateInputProps) {
  const ref = useRef<(HTMLInputElement | null)[]>([])
  const [values, setValues] = useState<PlateValue>(props.values || {})
  const plateId = id || 'simple-plate'

  /* --------------------------------- Effects -------------------------------- */
  useEffect(() => {
    if (props.clear) {
      setValues({})
      props.onClear && props.onClear(false)
    }
  }, [props.clear])

  useEffect(() => {
    if (props.values) {
      setValues(props.values)
    }
  }, [props.values])

  /* -------------------------------- Functions ------------------------------- */
  function handleFinish(key: keyof PlateValue, val?: string, nextRef?: HTMLInputElement | null) {
    nextRef?.select()
    const newVal = { ...values, [key]: val }
    setValues(newVal)
    onChange(newVal)
  }

  /* ----------------------------------- JSX ---------------------------------- */
  return (
    <div id={plateId} className={cn('flex w-[335px] overflow-hidden', 'dir-ltr h-full rounded-lg border border-gray-800')}>
      {Array.from(new Array(8)).map((_, x) => {
        return (
          <div key={x} id={`${plateId}-label-${x + 1}`} className='flex h-full w-full border-s border-gray-200'>
            <SimpleText
              ref={(r) => {
                ref.current[x + 1] = r
              }}
              value={(values as any)[`p${x + 1}`]}
              id={`${plateId}-label-${x + 1}-field`}
              onChange={(val, cleared) => {
                handleFinish(`p${x + 1}` as any, val, cleared === true ? ref.current[x] : cleared === false ? ref.current[x + 2] : undefined)
              }}
            />
          </div>
        )
      })}
    </div>
  )
}
