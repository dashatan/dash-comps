import { forwardRef } from "react";
import { cn } from "@/lib";
import CheckboxBasic from "./basic";
import type { BasicCheckboxProps } from "./basic";

export interface LabeledCheckboxProps extends Omit<
  BasicCheckboxProps,
  "aria-label"
> {
  /** The label text for the checkbox */
  label?: string;
  /** Additional description for the checkbox */
  description?: string;
  /** The position of the label relative to the checkbox */
  labelPosition?: "left" | "right";
  /** Additional class name for the checkbox */
  className?: string;
}

const LabeledCheckbox = forwardRef<HTMLDivElement, LabeledCheckboxProps>(
  (
    {
      label,
      labelPosition = "right",
      className,
      id,
      description,
      onChange,
      ...checkboxProps
    },
    ref,
  ) => {
    const checkboxId =
      id || `checkbox-${Math.random().toString(36).substring(2, 9)}`;

    return (
      <CheckboxBasic
        {...checkboxProps}
        ref={ref}
        id={checkboxId}
        aria-label={label}
        className={className}
        onChange={onChange}
        label={label}
        description={description}
      />
    );
  },
);

LabeledCheckbox.displayName = "LabeledCheckbox";
export default LabeledCheckbox;
