import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib";
import { cva, type VariantProps } from "class-variance-authority";

const passwordToggleVariants = cva(
  [
    "flex h-full cursor-pointer items-center justify-center",
    "transition-all duration-200",
    "hover:bg-muted",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    "disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent ",
  ].join(" "),
  {
    variants: {
      size: {
        sm: "w-8",
        md: "w-10",
        lg: "w-12",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

export interface PasswordToggleProps extends VariantProps<
  typeof passwordToggleVariants
> {
  /** Whether the password is visible */
  active?: boolean;
  /** Callback when visibility changes */
  onChange?: (active: boolean) => void;
  /** Custom class name */
  className?: string;
  /** Whether the toggle is disabled */
  disabled?: boolean;
}

export default function PasswordToggle({
  active = false,
  onChange,
  className,
  size,
  disabled = false,
}: PasswordToggleProps) {
  const iconSize = {
    sm: 16,
    md: 20,
    lg: 24,
  }[size || "md"];

  return (
    <div
      role="switch"
      aria-checked={active}
      aria-label={active ? "Hide password" : "Show password"}
      className={cn(passwordToggleVariants({ size }), className)}
      onClick={(e) => {
        e.stopPropagation();
        onChange?.(!active);
      }}
    >
      {active ? (
        <Eye size={iconSize} className="transition-transform duration-200" />
      ) : (
        <EyeOff size={iconSize} className="transition-transform duration-200" />
      )}
    </div>
  );
}
