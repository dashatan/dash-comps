"use client";

import {
  useEffect,
  useRef,
  useState,
  useCallback,
  forwardRef,
  RefObject,
} from "react";
import LabelContainer from "../label/labelContainer";
import BasicTextInput from "./basic";
import { cn } from "@/lib";
import {
  LabelContainerClassName,
  LabelContainerProps,
} from "@/components/common/inputs/select/types";
import { Loader2 } from "lucide-react";

/**
 * Props for the TextInput component
 */
export type TextInputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "onChange" | "size" | "prefix"
> & {
  /** Unique identifier for the input */
  id?: string;
  /** Label text for the input */
  label?: string;
  /** Custom class name for the label container */
  labelClassName?: LabelContainerClassName;
  /** Status of the input (error, success, etc.) */
  status?: LabelContainerProps["status"];
  /** Message to display below the input */
  message?: React.ReactNode | string;
  /** Element to display after the input */
  suffix?: React.ReactNode;
  /** Element to display before the input */
  prefix?: React.ReactNode;
  /** Whether to show the message */
  showMessage?: boolean;
  /** Callback when input value changes */
  onChange?: (val: string) => void;
  /** Whether the input is in a loading state */
  isLoading?: boolean;
  /** Whether the input is required */
  required?: boolean;
  /** Helper text to display below the input */
  helperText?: string;
  /** Custom class name for the input wrapper */
  wrapperClassName?: string;
  /** Size variant of the input */
  size?: "sm" | "md" | "lg";
  width?: number | string;
};

/**
 * A text input component with label, status, and theme support
 */
const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  (
    {
      id,
      label,
      labelClassName,
      status,
      message,
      suffix,
      prefix,
      onChange,
      value,
      className,
      isLoading,
      required,
      helperText,
      wrapperClassName,
      size,
      showMessage,
      width,
      ...props
    },
    forwardedRef,
  ) => {
    const localRef = useRef<HTMLInputElement>(null);
    const ref = (forwardedRef as RefObject<HTMLInputElement>) || localRef;
    const onChangeRef = useRef(onChange);
    onChangeRef.current = onChange;
    const [focused, setFocused] = useState(false);
    const [internalValue, setInternalValue] = useState(value);
    const [isAutoFilled, setIsAutoFilled] = useState(false);

    // Update internal value when prop changes
    useEffect(() => {
      setInternalValue(value);
    }, [value]);

    // Enhanced autofill detection
    useEffect(() => {
      const input = ref.current;
      if (!input) return;

      const controlledValue = String(value ?? "");

      const checkAutofill = () => {
        const domValue = input.value;
        const hasBrowserAutofill =
          input.matches(":-webkit-autofill") ||
          input.matches(":-webkit-autofill:focus");
        const hasUnsyncedDomValue =
          !!domValue &&
          domValue !== controlledValue &&
          !focused &&
          !document.activeElement?.isEqualNode(input);
        const detected = hasBrowserAutofill || hasUnsyncedDomValue;

        setIsAutoFilled((prev) => (prev === detected ? prev : detected));
        if (detected && domValue !== controlledValue) {
          setInternalValue(domValue);
          onChangeRef.current?.(domValue);
        }
      };

      checkAutofill();
      const timeoutId = setTimeout(checkAutofill, 100);

      const handleAnimation = (e: AnimationEvent) => {
        if (
          e.animationName === "onAutoFillStart" ||
          e.animationName === "onAutoFillCancel"
        ) {
          checkAutofill();
        }
      };

      input.addEventListener("animationstart", handleAnimation);

      return () => {
        clearTimeout(timeoutId);
        input.removeEventListener("animationstart", handleAnimation);
      };
    }, [focused, value]);

    // Memoize change handler
    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setInternalValue(newValue);
        setIsAutoFilled(!!newValue);
        onChange?.(newValue);
      },
      [onChange],
    );

    // Memoize focus handlers
    const handleFocus = useCallback(() => setFocused(true), []);
    const handleBlur = useCallback(() => {
      setFocused(false);
      const input = ref.current;
      if (input) {
        const isAutoFilled =
          window.getComputedStyle(input).backgroundColor !==
            "rgba(0, 0, 0, 0)" ||
          input.matches(":-webkit-autofill") ||
          input.matches(":-webkit-autofill:focus");

        setIsAutoFilled(isAutoFilled);
      }
    }, []);

    // Generate unique ID if not provided
    const inputId =
      id || `text-input-${Math.random().toString(36).substr(2, 9)}`;

    let hasValue = focused || isAutoFilled || !!internalValue;
    if (isAutoFilled && !internalValue && !focused) hasValue = false;

    return (
      <LabelContainer
        label={label}
        hasValue={hasValue}
        onClick={() => ref.current?.focus()}
        message={message}
        status={status ?? (focused ? "primary" : undefined)}
        className={{
          wrapper: {
            container: cn(labelClassName?.wrapper?.container, ""),
            ...labelClassName?.wrapper,
          },
          ...labelClassName,
        }}
        showMessage={showMessage}
        width={width}
        helperText={helperText}
        prefix={prefix}
        suffix={
          isLoading ? <Loader2 className="size-4 animate-spin" /> : suffix
        }
        required={required}
      >
        <BasicTextInput
          {...props}
          id={inputId}
          ref={ref}
          value={internalValue}
          placeholder={!label ? props.placeholder : undefined}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          required={required}
          wrapperClassName={wrapperClassName}
          className={cn(
            "h-full px-4 py-0 pt-4",
            suffix && "pe-0",
            prefix && "ps-0",
            "transition-all duration-200",
            "disabled:cursor-not-allowed disabled:opacity-50",
            className,
          )}
        />
      </LabelContainer>
    );
  },
);

TextInput.displayName = "TextInput";

export default TextInput;
