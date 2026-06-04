"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib";
import { OtpCell } from "@/components/common/inputs/otp/otp-cell";
import { DEFAULT_PASTE_DURATION_MS } from "@/components/common/inputs/otp/paste-wave";
import { useOtpPasteWave } from "@/components/common/inputs/otp/use-otp-paste-wave";
import { OTPInputProps } from "./types";
import "./otp.css";

export default function OTPInput({
  id,
  length = 6,
  value = "",
  onChange,
  disabled = false,
  required = false,
  label,
  status,
  message,
  className,
  autoFocus = false,
  allowPaste = true,
  pasteDurationMs = DEFAULT_PASTE_DURATION_MS,
  numericOnly = true,
  isLoading = false,
  size = "md",
  width,
}: OTPInputProps) {
  const [otp, setOtp] = useState<string[]>(value.split("").slice(0, length));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const {
    isPastingRef,
    isPasting,
    pasteCharCount,
    waveFront,
    risingCell,
    applyPastedValue,
    cancelPasteAnimation,
    resetPasteVisuals,
  } = useOtpPasteWave({
    length,
    pasteDurationMs,
    numericOnly,
    onChange,
    setOtp,
    inputRefs,
  });

  useEffect(() => {
    if (isPastingRef.current) return;
    setOtp(value.split("").slice(0, length));
    resetPasteVisuals();
  }, [value, length, resetPasteVisuals]);

  const handleChange = (index: number, nextValue: string) => {
    if (numericOnly && !/^\d*$/.test(nextValue)) return;

    if (nextValue.length > 1) {
      if (!allowPaste) return;
      applyPastedValue(nextValue);
      return;
    }

    cancelPasteAnimation();

    const newOtp = [...otp];
    newOtp[index] = nextValue.slice(-1);
    setOtp(newOtp);
    onChange?.(newOtp.join(""));

    if (nextValue && index < length - 1) {
      const nextInput = inputRefs.current[index + 1];
      nextInput?.focus();
      nextInput?.select();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace") {
      cancelPasteAnimation();

      if (!otp[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
        inputRefs.current[index - 1]?.select();
        return;
      }

      const newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);
      onChange?.(newOtp.join(""));
      return;
    }

    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
      inputRefs.current[index - 1]?.select();
    } else if (e.key === "ArrowRight" && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
      inputRefs.current[index + 1]?.select();
    }
  };

  const handleBeforeInput = (e: React.FormEvent<HTMLInputElement>) => {
    const nativeEvent = e.nativeEvent as InputEvent;
    if (nativeEvent.inputType === "insertFromPaste" && !allowPaste) {
      e.preventDefault();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (!allowPaste) return;
    applyPastedValue(e.clipboardData.getData("text"));
  };

  const rowWidth =
    width === undefined
      ? undefined
      : typeof width === "number"
        ? `${width}px`
        : width;

  const cellStatus = status ?? "default";

  return (
    <div
      className={cn(
        "flex w-fit max-w-full flex-col gap-2",
        className?.container,
      )}
      style={rowWidth ? { width: rowWidth } : undefined}
    >
      {label ? (
        <label
          htmlFor={id ?? label}
          className={cn("text-sm font-medium", className?.label)}
        >
          {label}
        </label>
      ) : null}
      <div
        className={cn(
          "relative flex w-fit max-w-full flex-wrap items-center gap-2 dir-ltr",
          disabled && "cursor-not-allowed opacity-50",
          isLoading && "animate-pulse",
          isPasting && "pointer-events-none",
          className?.cells,
        )}
      >
        {Array.from({ length }, (_, index) => (
          <OtpCell
            key={index}
            index={index}
            id={id}
            value={otp[index] || ""}
            size={size ?? "md"}
            status={cellStatus}
            waveFront={waveFront}
            pasteCharCount={pasteCharCount}
            isPasting={isPasting}
            isRising={risingCell === index}
            numericOnly={numericOnly}
            disabled={disabled || isLoading}
            required={required}
            autoFocus={autoFocus && index === 0}
            inputClassName={className?.input}
            inputRef={(el) => {
              inputRefs.current[index] = el;
            }}
            onBeforeInput={handleBeforeInput}
            onInput={(e) =>
              handleChange(index, (e.target as HTMLInputElement).value)
            }
            onKeyDown={(e) => handleKeyDown(index, e)}
            onFocus={() => inputRefs.current[index]?.select()}
            onBlur={() => {}}
            onClick={() => {
              inputRefs.current[index]?.focus();
              inputRefs.current[index]?.select();
            }}
            onPaste={handlePaste}
          />
        ))}
      </div>
      {message ? (
        <p
          className={cn("text-sm", {
            "text-error": status === "error",
            "text-warning": status === "warning",
            "text-success": status === "success",
            "text-primary": status === "primary",
            "text-secondary": status === "secondary",
          })}
        >
          {message}
        </p>
      ) : null}
    </div>
  );
}
