import { useFormContext } from "react-hook-form";
import { X } from "lucide-react";
import { TableData, tableDefaultState } from "@/components/compound/table/types";
import Button from "@/components/common/buttons";

export default function ClearTable({
  onChange,
}: {
  onChange?: (data: TableData) => void;
}) {
  const table = useFormContext<TableData>();
  const totalRecords = table.watch("totalRecords");

  function handleClick() {
    const newData: TableData = { ...tableDefaultState, showFilter: true, totalRecords };
    table.reset(newData);
    onChange && onChange(newData);
  }
  return (
    <div className="flex w-full items-center justify-center">
      <Button severity="input" variant="icon-button" size="md" onClick={handleClick}>
        <X className="size-6" />
      </Button>
    </div>
  );
}
