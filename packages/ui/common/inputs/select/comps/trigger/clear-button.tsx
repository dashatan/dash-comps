import Badge from "@/components/common/badge/badge";
import { X } from "lucide-react";

type ClearButtonProps = {
  count?: number;
  onClear?: () => void;
};

export function ClearButton({ count, onClear }: ClearButtonProps) {
  if (!count) return null;

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        onClear?.();
      }}
      role="button"
      aria-label="Clear selection"
    >
      <Badge withRing className="px-3">
        <X className="-mt-0.5 size-3" />
        <span>{count}</span>
      </Badge>
    </div>
  );
}
