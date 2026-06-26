import { cn } from "@/lib";
import { Check } from "lucide-react";

export type ChipSelectProps = {
  text?: string | number;
  val?: string | number | any;
  active: boolean;
  disabled?: boolean;
  onSelect: (val?: any) => void;
  className?: string;
  iconClassName?: string;
  id?: string;
};

export default function ChipSelect({
  id,
  text,
  val,
  active,
  disabled,
  onSelect,
  className,
  iconClassName,
}: ChipSelectProps) {
  return (
    <button
      type="button"
      id={id}
      className={cn(
        "flex h-8 cursor-pointer items-center justify-center gap-1 bg-input px-4",
        "relative rounded-full border text-sm font-medium select-none",
        "transition-all hover:ring-2 hover:ring-primary hover:ring-offset-2 hover:ring-offset-background",
        {
          "border-primary bg-primary/25": active && !disabled,
          "cursor-not-allowed opacity-50": disabled,
        },
        className,
      )}
      onClick={() => !disabled && onSelect(val)}
      disabled={disabled}
    >
      <span className="px-1">{text}</span>
    </button>
  );
}
