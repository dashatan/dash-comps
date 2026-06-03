"use client";

import React from "react";
import RadioInput from "@/components/common/inputs/radio/radio-input";
import TextInput from "@/components/common/inputs/text";
import {
  Controller,
  UseFormReturn,
  Path,
  FieldValues,
  useFormContext,
  PathValue,
  FormProvider,
  SubmitHandler,
  SubmitErrorHandler,
} from "react-hook-form";
import TextareaInput from "@/components/common/inputs/text/textarea";
import { Select } from "@/components/common/inputs/select";
import NumberInput from "@/components/common/inputs/number";
import SwitchField, {
  SwitchFieldProps,
} from "@/components/common/inputs/switch/switchField";
import PasswordInput from "@/components/common/inputs/text/password";
import WeightInput from "@/components/common/inputs/weight";
import NumberRangeInput from "@/components/common/inputs/number/range";
import {
  LabelContainerClassName,
  MultiSelectProps,
  MultiSelectTreeProps,
  SelectItem,
  SingleSelectProps,
  SingleSelectTreeProps,
  TreeSelectItem,
} from "@/components/common/inputs/select/types";
import { TextInputProps } from "@/components/common/inputs/text";
import { TextareaInputProps } from "@/components/common/inputs/text/textarea";
import { NumberInputProps } from "@/components/common/inputs/number";
import { NumberRangeInputProps } from "@/components/common/inputs/number/range";
import { RadioInputProps } from "@/components/common/inputs/radio/radio-input";
import { WeightInputProps } from "@/components/common/inputs/weight";
import Checkbox, { CheckboxProps } from "@/components/common/inputs/checkbox";
import OTPInput from "@/components/common/inputs/otp";
import { OTPInputProps } from "@/components/common/inputs/otp/types";
import { cn } from "@/lib";
import PhoneInput, { PhoneInputProps } from "@/components/common/inputs/text/phone";
import { DateInputProps, DateInput } from "@/components/common/inputs/date";
import { useCallback, useMemo } from "react";
import {
  PlateInputProps,
  PlateType,
  PlateValue,
} from "@/components/compound/license-plate/types";
import PlateInput from "@/components/compound/license-plate";

type PlateFormFieldProps = Omit<PlateInputProps, "type" | "onChange" | "defaultValue"> & {
  variant: PlateType;
  value?: PlateValue;
  onChange?: (val?: PlateValue) => void;
};

// Base types for all field props (className can be string for most inputs or LabelContainerClassName for select)
type BaseFieldProps<T extends FieldValues> = {
  name: Path<T>;
  label?: string;
  status?: "error" | "success" | "warning" | "primary" | "secondary";
  message?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string | LabelContainerClassName;
  defaultValue?: PathValue<T, Path<T>>;
  id?: string;
};

// Input component props without common props
type InputPropsWithoutCommon<T> = Omit<T, "label" | "status" | "message">;

// Field type definitions
type FieldTypeConfig = {
  text: { props: TextInputProps };
  password: { props: TextInputProps };
  textarea: { props: TextareaInputProps };
  number: { props: NumberInputProps };
  weight: { props: WeightInputProps };
  select: { props: SingleSelectProps; options: SelectItem[] };
  multi: { props: MultiSelectProps; options: SelectItem[] };
  tree: { props: MultiSelectTreeProps; options: TreeSelectItem[] };
  "tree-single": { props: SingleSelectTreeProps; options: TreeSelectItem[] };
  "number-range": { props: NumberRangeInputProps };
  radio: { props: RadioInputProps; options: RadioInputProps["options"] };
  switch: { props: SwitchFieldProps };
  checkbox: { props: CheckboxProps };
  date: { props: DateInputProps };
  otp: { props: OTPInputProps };
  phone: { props: PhoneInputProps };
  plate: { props: Omit<PlateFormFieldProps, "value" | "onChange"> };
};

// Generic field type
type FieldProps<
  T extends FieldValues,
  K extends keyof FieldTypeConfig,
> = BaseFieldProps<T> & {
  type: K;
} & InputPropsWithoutCommon<FieldTypeConfig[K]["props"]> &
  (K extends keyof {
    [P in keyof FieldTypeConfig as FieldTypeConfig[P] extends { options: any }
      ? P
      : never]: any;
  }
    ? { options: FieldTypeConfig[K]["options"] }
    : {});

// Input components mapping
const inputComponents = {
  text: TextInput,
  password: PasswordInput,
  textarea: TextareaInput,
  weight: WeightInput,
  number: NumberInput,
  select: Select.Single,
  multi: Select.Multi,
  tree: Select.MultiTree,
  "tree-single": Select.SingleTree,
  "number-range": NumberRangeInput,
  radio: RadioInput,
  switch: SwitchField,
  checkbox: Checkbox,
  date: DateInput,
  otp: OTPInput,
  phone: PhoneInput,
  plate: PlateInput,
} as const;

// Union type for all possible field props
type FormFieldProps<T extends FieldValues> = {
  [K in keyof FieldTypeConfig]: FieldProps<T, K>;
}[keyof FieldTypeConfig];

type FormProps<T extends FieldValues> = {
  form: UseFormReturn<T>;
  children: React.ReactNode;
  onSubmit: SubmitHandler<T>;
  onInvalid?: SubmitErrorHandler<T>;
  className?: string;
};

export function Form<T extends FieldValues>({
  form,
  children,
  onSubmit,
  onInvalid,
  className,
}: FormProps<T>) {
  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, onInvalid)}
        className={cn("select-none", className)}
        noValidate
      >
        {children}
      </form>
    </FormProvider>
  );
}

function FormFieldComponent<T extends FieldValues>(props: FormFieldProps<T>) {
  const { name, type, label, status, message, defaultValue, id, ...restProps } = props;
  const form = useFormContext<T>();
  const Component = inputComponents[type];

  if (!form) {
    throw new Error("FormField must be used within FormProvider");
  }

  const restPropsMemo = useMemo(() => restProps, [restProps]);

  const render = useCallback(
    ({ field: { value, onChange }, fieldState }: any) => {
      const componentProps = {
        ...restPropsMemo,
        value,
        label,
        onChange,
        status: fieldState.error?.message ? "error" : status,
        message: fieldState.error?.message || message,
        id,
      };

      return <Component {...(componentProps as any)} />;
    },
    [restPropsMemo, label, message, status, id, Component],
  );

  return (
    <Controller
      control={form.control}
      name={name}
      defaultValue={defaultValue}
      render={render}
    />
  );
}

export const FormField = React.memo(FormFieldComponent) as typeof FormFieldComponent;
