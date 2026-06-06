import { cn } from '@/lib'
import Number from '../inputs/number'
import { useEffect, useRef, useState } from 'react'
import { PlateValue } from '@/components/compound/license-plate/types'

/* ---------------------------------- Types --------------------------------- */
export type MotorcyclePlateValue = {
  p1?: number
  p2?: number
}

export type MotorcyclePlateInputProps = {
  onChange: (val: PlateValue) => void
  values?: PlateValue
  colorCode?: string
  clear?: boolean
  onClear?: (clear: boolean) => void
}

/* ------------------------------ Main Function ----------------------------- */
export default function MotorcyclePlate({ onChange, ...props }: MotorcyclePlateInputProps) {
  const ref1 = useRef<HTMLInputElement>(null)
  const ref2 = useRef<HTMLInputElement>(null)
  const [values, setValues] = useState<MotorcyclePlateValue>({})
  const [colorCode, setColorCode] = useState<string | undefined>(props.colorCode)
  const bg = colorCode && colors[colorCode] ? colors[colorCode] : ''

  /* --------------------------------- Effects -------------------------------- */
  useEffect(() => {
    if (props.clear) {
      setValues({})
      setColorCode(undefined)
      props.onClear && props.onClear(false)
    }
  }, [props.clear])

  useEffect(() => {
    if (props.values) {
      setValues(normalizeFrom(props.values))
    }
  }, [props.values])

  /* -------------------------------- Functions ------------------------------- */
  function handleFinish(key: keyof MotorcyclePlateValue, val: string | number, nextRef?: React.RefObject<HTMLInputElement | null>) {
    nextRef?.current?.select()
    const newVal = { ...values, [key]: val }
    setValues(newVal)
    onChange(normalizeTo(newVal))
  }

  function handleChange(key: keyof MotorcyclePlateValue, val?: string | number) {
    const newVal = { ...values, [key]: val }
    setValues(newVal)
    onChange(normalizeTo(newVal))
  }

  /* ----------------------------------- JSX ---------------------------------- */
  return (
    <div className={cn('flex w-[90px] flex-col overflow-hidden', 'dir-ltr h-full rounded-lg border', bg)}>
      <div className='flex items-center'>
        <div className='flex h-full w-5 min-w-5 flex-col items-center justify-center gap-1'>
          <img src='/iran-flag.png' alt='' width={13} />
          <div className='dir-ltr flex flex-col text-[5px] font-semibold'>
            <span>I.R.</span>
            <span className='-mt-0.5'>IRAN</span>
          </div>
        </div>
        <div className='flex h-full w-full'>
          <Number
            maxLength={3}
            value={values.p1}
            ref={ref1}
            className={cn(bg, '!py-1 !text-lg !font-extrabold')}
            onFinish={(val) => handleFinish('p1', val, ref2)}
            onChange={(val) => handleChange('p1', val)}
          />
        </div>
      </div>
      <div></div>

      <div className='flex h-full w-full'>
        <Number
          maxLength={5}
          value={values.p2}
          ref={ref2}
          className={cn(bg, '!pb-1 !text-lg !font-extrabold')}
          onFinish={(val) => handleFinish('p2', val.toString())}
          onChange={(val) => handleChange('p2', val)}
        />
      </div>
    </div>
  )
}

/* --------------------------------- Classes -------------------------------- */
const colors: { [key: string]: string } = {
  police: 'bg-plate-police-bg text-plate-police-text',
  'police-light': 'bg-plate-police-light text-plate-police-text',
  taxi: 'bg-plate-taxi-bg text-plate-taxi-text',
  'taxi-light': 'bg-plate-taxi-light text-plate-taxi-text',
  army: 'bg-plate-army-bg text-plate-army-text',
  'army-light': 'bg-plate-army-light text-plate-army-text',
  navy: 'bg-plate-navy-bg text-plate-navy-text',
  'navy-light': 'bg-plate-navy-light text-plate-navy-text',
  protocol: 'bg-plate-protocol-bg text-plate-protocol-text',
  'protocol-light': 'bg-plate-protocol-light text-plate-protocol-text',
  service: 'bg-plate-service-bg text-plate-service-text',
  'service-light': 'bg-plate-service-light text-plate-service-text',
}

/* ---------------------------------- Utils --------------------------------- */
function normalizeFrom(values: PlateValue) {
  const { p1, p2, p3, p4, p5, p6, p7, p8 } = values
  const res: MotorcyclePlateValue = {
    p1:
      `${(p1 && parseInt(p1)) || ''}${(p2 && parseInt(p2)) || ''}${p3 && parseInt(p3) ? p3 : ''}` !== ''
        ? parseInt(`${p1 || ''}${p2 || ''}${p3 || ''}`)
        : undefined,
    p2:
      `${(p4 && parseInt(p4)) || ''}` +
        `${(p5 && parseInt(p5)) || ''}` +
        `${(p6 && parseInt(p6)) || ''}` +
        `${(p7 && parseInt(p7)) || ''}` +
        `${(p8 && parseInt(p8)) || ''}` !==
      ''
        ? parseInt(`${p4 || ''}${p5 || ''}${p6 || ''}${p7 || ''}${p8 || ''}`)
        : undefined,
  }
  return res
}
function normalizeTo(values: MotorcyclePlateValue) {
  const { p1, p2 } = values
  const res: PlateValue = {
    p1: p1 ? `${p1}`[0] : undefined,
    p2: p1 ? `${p1}`[1] : undefined,
    p3: p1 ? `${p1}`[2] : undefined,
    p4: p2 ? `${p2}`[0] : undefined,
    p5: p2 ? `${p2}`[1] : undefined,
    p6: p2 ? `${p2}`[2] : undefined,
    p7: p2 ? `${p2}`[3] : undefined,
    p8: p2 ? `${p2}`[4] : undefined,
  }
  return res
}
