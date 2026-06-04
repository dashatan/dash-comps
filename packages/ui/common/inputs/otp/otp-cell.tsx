"use client";

import { cn } from "@/lib";
import {
  getCellWaveIntensity,
  getCellWaveStyle,
} from "@/components/common/inputs/otp/paste-wave";
import { otpInputVariants } from "@/components/common/inputs/otp/variants";
import type { OTPInputProps, OTPInputSize } from "@/components/common/inputs/otp/types";

const otpDigitSizeClasses: Record<OTPInputSize, string> = {
  sm: "text-base leading-9",
  md: "text-lg leading-11",
  lg: "text-xl leading-14",
};

type OtpCellProps = {
  index: number;
  id?: string;
  value: string;
  size: OTPInputSize;
  status: NonNullable<OTPInputProps["status"]>;
  waveFront: number;
  pasteCharCount: number;
  isPasting: boolean;
  isRising: boolean;
  numericOnly: boolean;
  disabled: boolean;
  required: boolean;
  autoFocus: boolean;
  inputClassName?: string;
  inputRef: (el: HTMLInputElement | null) => void;
  onBeforeInput: (e: React.FormEvent<HTMLInputElement>) => void;
  onInput: (e: React.FormEvent<HTMLInputElement>) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onFocus: () => void;
  onBlur: () => void;
  onClick: () => void;
  onPaste: (e: React.ClipboardEvent<HTMLInputElement>) => void;
};

export function OtpCell({
  index,
  id,
  value,
  size,
  status,
  waveFront,
  pasteCharCount,
  isPasting,
  isRising,
  numericOnly,
  disabled,
  required,
  autoFocus,
  inputClassName,
  inputRef,
  onBeforeInput,
  onInput,
  onKeyDown,
  onFocus,
  onBlur,
  onClick,
  onPaste,
}: OtpCellProps) {
  const wave =
    isPasting && index < pasteCharCount
      ? getCellWaveIntensity(index, waveFront)
      : 0;

  return (
    <div
      className={cn(
        "relative isolate grid place-items-center overflow-hidden rounded-sm",
        otpInputVariants({ size, status }),
        "p-0",
      )}
      style={getCellWaveStyle(wave)}
    >
      {wave > 0 ? (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-0 rounded-[inherit] bg-primary/20"
          style={{ opacity: wave }}
        />
      ) : null}
      <input
        id={`${id}-${index}`}
        ref={inputRef}
        type="text"
        inputMode={numericOnly ? "numeric" : "text"}
        pattern={numericOnly ? "[0-9]*" : undefined}
        maxLength={1}
        value={value}
        onBeforeInput={onBeforeInput}
        onInput={onInput}
        onKeyDown={onKeyDown}
        onFocus={onFocus}
        onBlur={onBlur}
        onClick={onClick}
        onPaste={onPaste}
        disabled={disabled}
        required={required}
        autoFocus={autoFocus}
        className={cn(
          "relative z-10 h-full w-full border-0 bg-transparent p-0 text-center font-semibold tabular-nums shadow-none ring-0 outline-none focus-visible:ring-0",
          otpDigitSizeClasses[size],
          isRising && "otp-cell-rise",
          inputClassName,
        )}
      />
    </div>
  );
}
