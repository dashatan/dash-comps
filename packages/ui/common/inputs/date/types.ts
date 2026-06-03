import { LabelContainerProps } from "@/components/common/inputs/select/types";
import { ReactNode } from "react";
import { CalendarProps, DateObject } from "react-multi-date-picker";

export interface DatePreset {
  key: string;
  label: string;
  months: number;
}

export interface DateInputClassName {
  input?: string;
  content?: string;
  calendar?: string;
  trigger?: string;
  dialog?: string;
}

export type DateInputProps = {
  label?: string;
  onChange?: (value: number[]) => void;
  value?: number[];
  disabled?: boolean;
  withTime?: boolean;
  withPreset?: boolean;
  autoClose?: boolean;
  withoutClear?: boolean;
  oneLineLabel?: boolean;
  range?: boolean;
  multiple?: boolean;
  forceLabel?: string | ReactNode;
  className?: DateInputClassName;
  status?: LabelContainerProps["status"];
  message?: LabelContainerProps["message"];
  labelContainerProps?: Omit<LabelContainerProps, "hasValue" | "ref">;
  width?: number | string;
  icon?: ReactNode;
  presets?: DatePreset[];
  placeholder?: string;
  required?: boolean;
  error?: string;
  id?: string;
  currentDate?: DateObject;
  limitedRange?: string;
  minDate?: number | Date | DateObject;
  maxDate?: number | Date | DateObject;
};

export interface DateInputState {
  dateObjects: DateObject[];
  times: string[];
  open: boolean;
  activePreset: string | null;
}

export interface DateInputLabelProps {
  dates: string[];
  times: string[];
  handleClear: (withSubmit?: boolean) => void;
  props: DateInputProps;
  t: (key: string) => string;
}

export interface DateInputDialogProps {
  dateObjects: DateObject[];
  times: string[];
  setTimes: (times: string[] | ((prev: string[]) => string[])) => void;
  handleDateChange: (d: DateObject | DateObject[] | null) => void;
  handlePreset: (key: string, months: number) => void;
  activePreset: string | null;
  presets: DatePreset[];
  props: DateInputProps;
  t: (key: string) => string;
}

export interface DateInputFooterProps {
  handleSubmit: () => void;
  handleCancellation: () => void;
  handleClear: (withSubmit?: boolean) => void;
  t: (key: string) => string;
}

export interface TimeSectionProps {
  label: string;
  value: string;
  onChange: (timeString: string) => void;
}

export interface RangeTimeSectionProps {
  t: (key: string) => string;
  times: string[];
  setTimes: (times: string[] | ((prev: string[]) => string[])) => void;
}

export interface ItemProps {
  label: string;
  value: string | ReactNode;
}
