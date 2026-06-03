import { cn } from "@/lib";
import BasicNumberInput, { BasicNumberInputProps } from "../../number/basic";
import { useEffect, useRef, useState } from "react";

export interface TimeObject {
  hour: number;
  minute: number;
  second: number;
}

export interface TimePickerProps {
  onChange?: (result: { string: string; obj: TimeObject }) => void;
  withSecond?: boolean;
  inputClassName?: string;
  value?: string;
  disabled?: boolean;
}

const INITIAL_TIME: TimeObject = { hour: 0, minute: 0, second: 0 };

export default function TimePicker({
  value,
  onChange,
  withSecond,
  inputClassName,
  disabled,
}: TimePickerProps) {
  const [time, setTime] = useState<TimeObject>(INITIAL_TIME);
  // Parse initial value safely
  useEffect(() => {
    if (value) {
      const parts = value.split(":");
      const parsed: TimeObject = {
        hour: Math.max(0, Math.min(23, parseInt(parts[0] || "0", 10) || 0)),
        minute: Math.max(0, Math.min(59, parseInt(parts[1] || "0", 10) || 0)),
        second: Math.max(0, Math.min(59, parseInt(parts[2] || "0", 10) || 0)),
      };
      setTime(parsed);
    } else {
      setTime(INITIAL_TIME);
    }
  }, [value]);

  // Notify parent of changes only when time actually changes (not on initial render)
  const prevTimeRef = useRef<TimeObject>(INITIAL_TIME);
  useEffect(() => {
    if (
      onChange &&
      (prevTimeRef.current.hour !== time.hour ||
        prevTimeRef.current.minute !== time.minute ||
        prevTimeRef.current.second !== time.second)
    ) {
      const timeString = withSecond
        ? `${time.hour.toString().padStart(2, "0")}:${time.minute.toString().padStart(2, "0")}:${time.second.toString().padStart(2, "0")}`
        : `${time.hour.toString().padStart(2, "0")}:${time.minute.toString().padStart(2, "0")}`;
      onChange({ string: timeString, obj: time });
      prevTimeRef.current = time;
    }
  }, [time, withSecond, onChange]);

  function handleChange(val: number, key: keyof TimeObject, max: number) {
    const clampedValue = Math.max(0, Math.min(max, val));
    setTime((prev) => ({ ...prev, [key]: clampedValue }));
  }

  return (
    <div className="dir-ltr flex w-full items-center justify-between">
      <TimeInput
        value={time.hour}
        max={23}
        onChange={(e) => handleChange(e || 0, "hour", 23)}
        className={inputClassName}
        disabled={disabled}
        aria-label="Hour"
      />
      <span className="mx-2 text-xl font-bold">:</span>
      <TimeInput
        value={time.minute}
        max={59}
        onChange={(e) => handleChange(e || 0, "minute", 59)}
        className={inputClassName}
        disabled={disabled}
        aria-label="Minute"
      />
      {withSecond && (
        <>
          <span className="mx-2 text-xl font-bold">:</span>
          <TimeInput
            value={time.second}
            max={59}
            onChange={(e) => handleChange(e || 0, "second", 59)}
            className={inputClassName}
            disabled={disabled}
            aria-label="Second"
          />
        </>
      )}
    </div>
  );
}

interface TimeInputProps extends BasicNumberInputProps {
  disabled?: boolean;
  "aria-label"?: string;
}

function TimeInput({ disabled, ...props }: TimeInputProps) {
  const ref = useRef<HTMLInputElement>(null);

  return (
    <BasicNumberInput
      {...props}
      ref={ref}
      disabled={disabled}
      className={cn(
        "dir-ltr h-10 w-10 overflow-hidden rounded-md border text-center",
        "focus:border-input-border focus:ring-input-border transition-colors focus:ring-1",
        disabled && "cursor-not-allowed opacity-50",
        props.className,
      )}
      min={0}
      onClick={() => !disabled && ref.current?.select()}
    />
  );
}
