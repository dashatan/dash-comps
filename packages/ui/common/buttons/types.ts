export type ButtonVariant =
  | "contained"
  | "outlined"
  | "text"
  | "icon"
  | "icon-button";
export type ButtonSeverity =
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "input"
  | "muted";
export type ButtonSize = "xs" | "sm" | "md" | "lg" | "xl" | number;
export type ButtonRounded = "sm" | "md" | "lg" | "full" | "circle";

export type ButtonProps = {
  id?: string;
  /** The variant of the button */
  variant?: ButtonVariant;
  /** The severity level of the button */
  severity?: ButtonSeverity;
  /** The size of the button */
  size?: ButtonSize;
  /** The border radius of the button */
  rounded?: ButtonRounded;
  /** Whether the button should take full width */
  fullWidth?: boolean;
  /** The icon to display */
  icon?: React.ReactNode;
  /** The label text of the button */
  label?: string;
  /** Whether the button is in a loading state */
  isLoading?: boolean;
  /** The icon to display on the left side */
  leftIcon?: React.ReactNode;
  /** The icon to display on the right side */
  rightIcon?: React.ReactNode;
  /** The content of the button */
  children?: React.ReactNode;
  /** Whether the button is disabled */
  disabled?: boolean;
  /** The type of the button */
  type?: "button" | "submit" | "reset";
  /** The onClick handler */
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  /** Additional CSS class name */
  className?: string;
  /** Additional inline styles */
  style?: React.CSSProperties;
  /** Tooltip text to display on hover */
  tooltip?: string;
  /** tooltip options */
  tooltipOptions?: {
    openDelay?: number;
    closeDelay?: number;
    side?: "top" | "right" | "bottom" | "left";
    align?: "start" | "center" | "end";
    className?: string;
    sideOffset?: number;
  };
  /** Render as child (do not render a <button>, just pass props to child) */
  asChild?: boolean;
};
