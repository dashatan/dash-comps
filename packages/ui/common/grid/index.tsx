import { cn } from "@/lib";
import { ReactNode } from "react";

export interface GridContainerProps {
  children?: ReactNode;
  className?: string;
  "aria-label"?: string;
}

/**
 * GridContainer component that provides a responsive layout structure
 * @param props - GridContainer component props
 * @returns A responsive grid layout
 */
export function GridContainer({
  className,
  children,
  "aria-label": ariaLabel,
}: GridContainerProps) {
  return (
    <div className="flex-full @container flex flex-col overflow-auto">
      <div
        className={cn(
          "flex-full grid items-stretch gap-4 p-4",
          `grid-cols-12 grid-rows-2`,
          className,
        )}
        role="grid"
        aria-label={ariaLabel}
      >
        {children}
      </div>
    </div>
  );
}

export interface GridCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "elevated";
}

/**
 * GridCard component for displaying content in a card format
 * @param props - GridCard component props
 * @returns A card component within the grid
 */
export function GridCard({
  variant = "default",
  className,
  style,
  children,
  ...props
}: GridCardProps) {
  return (
    <div
      {...props}
      className={cn(
        "col-span-12 flex min-h-fit w-full flex-col gap-4 overflow-hidden rounded-xl border p-4",
        variant === "default" && "border-border bg-card text-card-foreground",
        variant === "elevated" &&
          "border-border bg-popover text-popover-foreground shadow-sm",

        className,
      )}
    >
      {children}
    </div>
  );
}

export interface GridHeaderProps {
  Icon?: ReactNode;
  title: string;
  subtitle?: string;
  sideElements?: ReactNode;
  className?: string;
}

/**
 * GridHeader component for displaying section headers with icons
 * @param props - GridHeader component props
 * @returns A header component with icon and text
 */
export function GridHeader({
  Icon,
  title,
  subtitle,
  sideElements,
  className,
}: GridHeaderProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-4 whitespace-nowrap",
        className,
      )}
    >
      <div className="flex items-center gap-4">
        <div className="border-border bg-card flex h-10 w-10 items-center justify-center rounded-lg border">
          {Icon}
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-1">
            <span className="text-foreground font-semibold">{title}</span>
          </div>
          {subtitle && <div className="text-muted-foreground text-xs">{subtitle}</div>}
        </div>
      </div>
      {sideElements}
    </div>
  );
}

export function GridGroup({
  children,
  className,
}: GridCardProps & { children: ReactNode }) {
  return (
    <div className={cn("col-span-12 grid grid-rows-2 gap-4", className)}>{children}</div>
  );
}
