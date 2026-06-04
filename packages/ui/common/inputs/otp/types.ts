export type OTPInputStatus =
  | "default"
  | "primary"
  | "secondary"
  | "success"
  | "error"
  | "warning";

export type OTPInputSize = "sm" | "md" | "lg";

export interface OTPInputProps {
  id?: string
  /** The number of OTP digits */
  length?: number
  /** The current value of the OTP input */
  value?: string
  /** Callback when OTP value changes */
  onChange?: (value: string) => void
  /** Whether the input is disabled */
  disabled?: boolean
  /** Whether the input is required */
  required?: boolean
  /** Label text for the input */
  label?: string
  /** Status of the input (error, success, etc.) */
  status?: OTPInputStatus
  /** Message to display below the input */
  message?: string
  /** Custom class names for different parts of the component */
  className?: {
    container?: string;
    cells?: string;
    input?: string;
    label?: string;
    message?: string;
  };
  /** Whether to auto-focus the first input on mount */
  autoFocus?: boolean
  /** Whether to allow paste functionality */
  allowPaste?: boolean
  /** Total duration of the paste fill animation (ms) */
  pasteDurationMs?: number
  /** Whether to allow only numeric input */
  numericOnly?: boolean
  /** Whether the input is in a loading state */
  isLoading?: boolean;
  /** Cell size preset */
  size?: OTPInputSize;
  /** Max width of the OTP row (number = px, string = any CSS width) */
  width?: number | string;
}
