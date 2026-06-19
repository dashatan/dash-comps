import { cn } from "@/lib";
import { Dot } from "lucide-react";
import { ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";

export interface StatusBoxProps extends VariantProps<typeof statusBoxVariants> {
  text: string | ReactNode;
  onClick?: () => void;
  icon?: React.ReactNode;
  className?: string;
  textClassName?: string;
  justify?: "center" | "start" | "end";
  rounded?: "sm" | "md" | "lg" | "full";
}

const statusBoxVariants = cva(
  "relative flex h-8 min-w-28 items-center justify-center rounded-md border px-2 text-center  font-medium whitespace-nowrap",
  {
    variants: {
      color: {
        primary: "border-primary/30 bg-primary/5 text-primary/80",
        secondary: "border-secondary/30 bg-secondary/5 text-secondary/80",
        success: "border-success/30 bg-success/5 text-success/80",
        warning: "border-warning/30 bg-warning/5 text-warning/80",
        error: "border-error/30 bg-error/5 text-error/80",
        info: "border-info/30 bg-info/5 text-info/80",
      },
      rounded: {
        sm: "rounded-sm",
        md: "rounded-md",
        lg: "rounded-lg",
        full: "rounded-full",
      },
    },
    defaultVariants: {
      color: "info",
      rounded: "full",
    },
  },
);

export default function StatusBox({
  text,
  className,
  color,
  icon,
  onClick,
  textClassName,
  justify = "center",
  rounded = "full",
}: StatusBoxProps) {
  return (
    <div
      className={cn("flex cursor-default items-center select-none", {
        "cursor-pointer": onClick,
        "justify-center": justify === "center",
        "justify-start": justify === "start",
        "justify-end": justify === "end",
      })}
      onClick={onClick}
    >
      <div className={cn(statusBoxVariants({ color, rounded }), className)}>
        {onClick && (
          <Dot
            className={cn("absolute right-1 scale-[2]", {
              "text-primary/80": color === "primary",
              "text-secondary/80": color === "secondary",
              "text-success/80": color === "success",
              "text-error/80": color === "error",
              "text-warning/80": color === "warning",
              "text-info/80": !color || color === "info",
            })}
          />
        )}
        <span className={cn(textClassName, "mt-px")}>{text}</span>
        <span>{icon}</span>
      </div>
    </div>
  );
}
