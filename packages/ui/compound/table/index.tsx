import { FormProvider, useForm } from 'react-hook-form'
import { TableData, TableProps, tableDefaultState } from './types'
import { TableComponent } from './table'

export function Table(props: TableProps) {
  const hasFilter = props.defaultValues?.filters && Object.keys(props.defaultValues.filters).length > 0
  const table = useForm<TableData>({
    defaultValues: {
      ...(props.defaultValues || tableDefaultState),
      showFilter: hasFilter,
      showFilterChips: hasFilter,
    },
  })

  return (
    <FormProvider {...table}>
      <TableComponent {...props} />
    </FormProvider>
  )
}

export default Table
