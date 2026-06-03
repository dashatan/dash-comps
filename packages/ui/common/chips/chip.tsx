import { cn } from "@/lib";
import { forwardRef } from "react";
import { X } from "lucide-react";

export interface ChipProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
  name?: string;
  template?: React.ReactNode;
  children?: React.ReactNode;
  onRemove?: () => void;
}

const Chip = forwardRef<HTMLDivElement, ChipProps>(
  ({ label, template, children, onRemove, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        {...props}
        className={cn(
          "flex min-h-6 min-w-fit items-center justify-between gap-2 rounded-md p-1.5",
          "bg-muted text-muted-foreground cursor-default text-xs",
          className,
        )}
      >
        {label && <span>{label}</span>}
        {template}
        {children}
        {onRemove && (
          <div
            className="bg-muted hover:bg-muted-foreground/20 flex h-4 w-4 cursor-pointer items-center justify-center rounded-full transition-all"
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            aria-label="Remove"
          >
            <X className="h-3 w-3" />
          </div>
        )}
      </div>
    );
  },
);

Chip.displayName = "Chip";
export default Chip;
