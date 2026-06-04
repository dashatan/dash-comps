import { cn } from "@/lib";
import { forwardRef, useCallback, useEffect, useState } from "react";
import CheckboxBasic from "./basic";
import type { BasicCheckboxProps } from "./basic";

export interface CardCheckboxProps extends Omit<
  BasicCheckboxProps,
  "aria-label" | "className" | "title"
> {
  /** The main title of the card checkbox */
  title?: React.ReactNode;
  /** The subtitle of the card checkbox */
  subTitle?: React.ReactNode;
  /** Custom title template to override the default title layout */
  titleTemplate?: React.ReactNode;
  /** The width of the card checkbox */
  width?: number | string;

  /** Custom class names for different parts of the component */
  className?: {
    container?: string;
    icon?: string;
    iconContainer?: string;
    titleContainer?: string;
    title?: string;
    subTitle?: string;
  };
}

const CardCheckbox = forwardRef<HTMLDivElement, CardCheckboxProps>(
  (
    { title, subTitle, titleTemplate, className, id, width, ...checkboxProps },
    ref,
  ) => {
    const [checked, setChecked] = useState(checkboxProps.checked);
    useEffect(() => {
      setChecked(checkboxProps.checked);
    }, [checkboxProps.checked]);

    const handleChange = useCallback(
      (checked: boolean) => {
        setChecked(checked);
        checkboxProps.onChange?.(checked);
      },
      [checkboxProps.onChange],
    );

    const checkboxId =
      id || `checkbox-${Math.random().toString(36).substring(2, 9)}`;

    return (
      <div
        ref={ref}
        className={cn(
          "flex w-full cursor-pointer items-start rounded-lg bg-primary/10 transition-all duration-100 select-none",
          {
            "bg-primary/40": checked,
            "cursor-default!": checkboxProps.disabled,
          },
          className?.container,
        )}
        onClick={() => !checkboxProps.disabled && handleChange(!checked)}
        style={{ width }}
      >
        <CheckboxBasic
          {...checkboxProps}
          severity={checkboxProps.severity || "primary"}
          checked={checked}
          onChange={handleChange}
          id={checkboxId}
          aria-label={typeof title === "string" ? title : undefined}
          className={cn("m-4", className?.iconContainer)}
        />

        {titleTemplate}

        {(title || subTitle) && (
          <div className={cn("flex flex-col py-4", className?.titleContainer)}>
            {title && (
              <label
                htmlFor={`${checkboxId}-input`}
                className={cn(
                  "cursor-pointer text-base font-semibold",
                  className?.title,
                )}
              >
                {title}
              </label>
            )}
            {subTitle && (
              <span
                className={cn(
                  "text-sm font-normal text-muted-foreground",
                  className?.subTitle,
                )}
              >
                {subTitle}
              </span>
            )}
          </div>
        )}
      </div>
    );
  },
);

CardCheckbox.displayName = "CardCheckbox";
export default CardCheckbox;
