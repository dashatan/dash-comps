import { forwardRef } from "react";
import { cn } from "@/lib";
import CheckboxBasic from "./basic";
import type { BasicCheckboxProps } from "./basic";

export interface LabeledCheckboxProps extends Omit<BasicCheckboxProps, "aria-label"> {
  /** The label text for the checkbox */
  label?: string;
  /** Additional description for the checkbox */
  description?: string;
  /** The position of the label relative to the checkbox */
  labelPosition?: "left" | "right";
  /** Additional class name for the label */
  labelClassName?: string;
  /** Additional class name for the container */
  containerClassName?: string;
  /** Additional class name for the checkbox */
  checkboxClassName?: string;
}

const LabeledCheckbox = forwardRef<HTMLDivElement, LabeledCheckboxProps>(
  (
    {
      label,
      labelPosition = "right",
      labelClassName,
      containerClassName,
      checkboxClassName,
      id,
      description,
      onChange,
      ...checkboxProps
    },
    ref,
  ) => {
    const checkboxId = id || `checkbox-${Math.random().toString(36).substring(2, 9)}`;

    return (
      <CheckboxBasic
        {...checkboxProps}
        id={checkboxId}
        aria-label={label}
        className={checkboxClassName}
        onChange={onChange}
        label={label}
        description={description}
      />
    );

    return (
      <div
        ref={ref}
        className={cn(
          "group flex items-center gap-4",
          { "flex-row-reverse": labelPosition === "left" },
          containerClassName,
        )}
        onClick={(e) => {
          e.stopPropagation();
          onChange?.(!checkboxProps.checked);
        }}
      >
        <CheckboxBasic
          {...checkboxProps}
          id={checkboxId}
          aria-label={label}
          className={checkboxClassName}
          onChange={onChange}
        />
        <div className="flex flex-col">
          {label && (
            <label
              htmlFor={`${checkboxId}-input`}
              className={cn(
                "text-foreground cursor-pointer text-sm transition-colors duration-200 select-none",
                "group-hover:text-foreground/80",
                labelClassName,
              )}
            >
              {label}
            </label>
          )}
          <span className="text-foreground/60 text-xs">{description}</span>
        </div>
      </div>
    );
  },
);

LabeledCheckbox.displayName = "LabeledCheckbox";
export default LabeledCheckbox;
