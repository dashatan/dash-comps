import { forwardRef } from "react";
import { cn } from "@/lib";

export type BasicNumberInputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "onChange" | "max"
> & {
  onChange?: (val?: number) => void;
  max?: number;
};
const BasicNumberInput = forwardRef<HTMLInputElement, BasicNumberInputProps>(
  ({ onChange, ...props }, ref) => {
    function handleChange(v?: string) {
      const val = v ? parseInt(v) : undefined;
      if (v === "" || v === undefined) {
        onChange?.(undefined);
        return;
      }
      if (!/^\d+$/.test(v)) {
        return;
      }
      if (props.max && val !== undefined && val > props.max) {
        return;
      }
      onChange?.(val);
    }
    return (
      <input
        {...props}
        ref={ref}
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        onChange={(e) => handleChange(e.target.value)}
        value={props.value === undefined ? "" : props.value}
        className={cn(
          "text-base font-medium text-foreground outline-none dir-ltr",
          "[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none",
          props.className,
        )}
      />
    );
  },
);

BasicNumberInput.displayName = "BasicNumberInput";

export default BasicNumberInput;
