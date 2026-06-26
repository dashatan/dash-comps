import { TableProps } from "./types";

import { TableComponent } from "./table";

import { TableStoreProvider } from "./context";

export function Table(props: TableProps) {
  return (
    <TableStoreProvider
      defaultValues={props.defaultValues}
      totalRecords={props.totalRecords}
      onTableChange={props.onTableChange}
    >
      <TableComponent {...props} />
    </TableStoreProvider>
  );
}

export default Table;

export * from "./types";

export * from "./context";

export * from "./store";

export {
  TableCellTextField,
  TableCellNumberField,
  TableCellDateField,
  TableCellTimeField,
  TableCellDateTimeField,
  TableCellDateElement,
  TableCellColorDot,
  TableCellLinkButton,
  TableNoContent,
  TableHeaderCell,
} from "./components/shared";

export { default as TableHeaderCountBox } from "./components/shared";

export { TableCheckbox } from "./components/body/checkbox";

export { default as ClearTable } from "./components/body/clear";

export {
  default as ExpandButton,
  DividerHor,
  Section,
} from "./components/body/expand";

export { default as StatusBox } from "./components/body/status";

export { TableSearchBox } from "./components/shared/search-box";

export { TrackButton } from "./components/shared/track-button";

export { default as TotalCount } from "./components/header/total-count";
