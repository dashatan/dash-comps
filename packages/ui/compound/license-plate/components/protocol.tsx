import Number from '../inputs/number'
import { useEffect, useRef, useState } from 'react'
import { PlateValue } from '@/components/compound/license-plate/types'
import { cn } from '@/lib'
/* ---------------------------------- Types --------------------------------- */
export type ProtocolPlateInputValue = {
  p1?: string | number
}

export type ProtocolPlateInputProps = {
  onChange: (val: PlateValue) => void
  values?: PlateValue
  colorCode?: string
  clear?: boolean
  onClear?: (clear: boolean) => void
}

/* ------------------------------ Main Function ----------------------------- */
export default function ProtocolPlate({ onChange, ...props }: ProtocolPlateInputProps) {
  const ref1 = useRef<HTMLInputElement>(null)
  const [values, setValues] = useState<ProtocolPlateInputValue>(normalizeFrom(props.values || {}))

  /* --------------------------------- Effects -------------------------------- */
  useEffect(() => {
    if (props.clear) {
      setValues({})
      props.onClear && props.onClear(false)
    }
  }, [props.clear])

  useEffect(() => {
    if (props.values) {
      setValues(normalizeFrom(props.values))
    }
  }, [props.values])

  /* -------------------------------- Functions ------------------------------- */

  function handleChange(val?: string | number) {
    const newVal = { p1: val }
    setValues(newVal)
    onChange(normalizeTo(newVal))
  }

  /* ----------------------------------- JSX ---------------------------------- */
  return (
    <div className={cn('flex w-[335px] overflow-hidden', 'dir-ltr h-full rounded-lg', 'bg-plate-protocol-bg text-plate-protocol-text')}>
      <div className='flex h-full w-[38px] min-w-[38px] flex-col items-center justify-center gap-1'>
        <img src='/iran-flag.png' alt='' width={26} />
        <div className='dir-ltr flex flex-col text-[9px] font-bold'>
          <span>I.R.</span>
          <span className='-mt-1'>IRAN</span>
        </div>
      </div>
      <div
        className='flex h-full w-[185px] min-w-[185px] flex-col items-center justify-center text-[26px] font-semibold'
        onClick={() => ref1.current?.select()}
      >
        <span className='-mb-1'>تشریـــــــفات</span>
        <span className='-mt-1'>PROTOCOL</span>
      </div>
      <div className='flex h-full w-full'>
        <Number
          maxLength={4}
          value={values.p1}
          ref={ref1}
          className={cn('text-plate-protocol-text', 'selection:bg-plate-protocol-light')}
          onFinish={handleChange}
          onChange={handleChange}
        />
      </div>
    </div>
  )
}

/* ---------------------------------- Utils --------------------------------- */
function normalizeFrom(values: PlateValue) {
  const { p1, p2, p3, p4, p5, p6, p7, p8 } = values
  const res: ProtocolPlateInputValue = {
    p1:
      `${(p1 && parseInt(p1)) || ''}` + `${(p2 && parseInt(p2)) || ''}` + `${(p3 && parseInt(p3)) || ''}` + `${(p4 && parseInt(p4)) || ''}` !== ''
        ? parseInt(`${p1 || ''}${p2 || ''}${p3 || ''}${p4 || ''}`)
        : undefined,
  }
  return res
}
function normalizeTo(values: ProtocolPlateInputValue) {
  const { p1 } = values
  const res: PlateValue = {
    p1: p1 ? `${p1}`[0] : undefined,
    p2: p1 ? `${p1}`[1] : undefined,
    p3: p1 ? `${p1}`[2] : undefined,
    p4: p1 ? `${p1}`[3] : undefined,
  }
  return res
}
