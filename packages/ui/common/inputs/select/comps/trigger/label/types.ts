import { SelectTriggerTemplateProps } from "@/components/common/inputs/select/types";

export type LabelProps = Pick<
  SelectTriggerTemplateProps,
  | "value"
  | "label"
  | "open"
  | "className"
  | "Icon"
  | "count"
  | "onClear"
  | "labelType"
  | "withSelectAll"
  | "selectAllLabel"
  | "loading"
>;

export type LabelType = NonNullable<LabelProps["labelType"]> | "float";
