import { CarPlateInputValue, PlateValue, PlateValueRequestParams } from '@/components/compound/license-plate/types'
import { plateLetters } from '@/components/compound/license-plate/utils/letters'

export function normalizePlateValueToRequest(plate: PlateValue) {
  let params = {} as PlateValueRequestParams
  Object.entries(plate).map(([key, val]) => {
    if (key === 'p3') {
      const letter = plateLetters.letters.find((x) => x.letter === val)
      params[key] = val && letter ? (letter.code as number) : undefined
    } else params[key] = val ? parseFloat(val) : undefined
  })
  return params
}

export function normalizePlateValueToCar(values: PlateValue = {}): CarPlateInputValue {
  // Combine p1+p2, p4+p5+p6, p7+p8 as strings, handle undefined gracefully
  return {
    p1: [values.p1, values.p2].filter(Boolean).join('') || '',
    p2: values.p3 || '',
    p3: [values.p4, values.p5, values.p6].filter(Boolean).join('') || '',
    p4: [values.p7, values.p8].filter(Boolean).join('') || '',
  }
}
export function normalizePlateValueToCarLocalValue(values: PlateValue = {}): CarPlateInputValue {
  // Combine p1+p2, p4+p5+p6, p7+p8 as strings, handle undefined gracefully

  return {
    p1: [values.p1, values.p2].filter(Boolean).join('') || '',
    p2: values.p3 ? plateLetters.letters.find((x) => x.code === Number(values.p3) || x.letter === values.p3)?.letter : '',
    p3: [values.p4, values.p5, values.p6].filter(Boolean).join('') || '',
    p4: [values.p7, values.p8].filter(Boolean).join('') || '',
  }
}

export function normalizeCarToPlateValue(values: CarPlateInputValue = {}): PlateValue {
  // Split strings into individual chars, handle empty gracefully
  const { p1 = '', p2 = '', p3 = '', p4 = '' } = values
  return {
    p1: p1[0],
    p2: p1[1],
    p3: p2 || undefined,
    p4: p3[0],
    p5: p3[1],
    p6: p3[2],
    p7: p4[0],
    p8: p4[1],
  }
}

export function makePlateValue(row: Partial<PlateValueRequestParams>) {
  const letter = plateLetters.letters.find((x) => x.code === row.p3)?.letter
  return { p1: `${row.p1}`, p2: `${row.p2}`, p3: letter, p4: `${row.p4}`, p5: `${row.p5}`, p6: `${row.p6}`, p7: `${row.p7}`, p8: `${row.p8}` }
}
