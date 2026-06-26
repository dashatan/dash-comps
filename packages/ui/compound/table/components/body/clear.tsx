import { X } from "lucide-react";
import { TableData, tableDefaultState } from "../../types";
import Button from "@/components/common/buttons";
import { useTableStore } from "../../context";

export default function ClearTable({
  onChange,
}: {
  onChange?: (data: TableData) => void;
}) {
  const totalRecords = useTableStore((s) => s.totalRecords);
  const reset = useTableStore((s) => s.reset);
  const getSnapshot = useTableStore((s) => s.getSnapshot);

  function handleClick() {
    reset({ ...tableDefaultState, showFilter: true, totalRecords });
    onChange?.(getSnapshot());
  }

  return (
    <div className="flex w-full items-center justify-center">
      <Button
        severity="input"
        variant="icon-button"
        size="md"
        onClick={handleClick}
      >
        <X className="size-6" />
      </Button>
    </div>
  );
}
