import Button from "@/components/common/buttons";
import { BodyElementProps, TableData } from "@/components/compound/table/types";
import { cn } from "@/lib";
import { DivProps } from "@/lib/types";
import { ChevronDown } from "lucide-react";
import { useFormContext, useWatch } from "react-hook-form";

export default function ExpandButton({
  key,
  className,
}: BodyElementProps & { key: string | number; className?: string }) {
  const table = useFormContext<TableData>();
  const state = useWatch<TableData>();
  const { expandedRows } = state;
  const expanded = !!expandedRows && !!key && expandedRows[key];

  function handleClick() {
    if (!key) return;
    let newExpandedRows = { ...(expandedRows || {}) };
    if (expanded) delete newExpandedRows[key];
    else newExpandedRows[key] = true;
    table.setValue("expandedRows", newExpandedRows);
  }

  return (
    <div className="flex w-full items-center justify-center">
      <Button severity="input" variant="icon-button" size="md" onClick={handleClick}>
        <ChevronDown
          className={cn("size-5 transition-all", { "rotate-180": expanded }, className)}
        />
      </Button>
    </div>
  );
}

export function DividerHor(props: DivProps) {
  return <div {...props} className={cn("bg-border h-full w-px", props.className)} />;
}

export function Section(props: DivProps) {
  return (
    <div
      {...props}
      className={cn("flex h-full w-full items-start gap-2 p-4", props.className)}
    >
      <span className="text-hint text-xs font-semibold whitespace-nowrap">
        {props.title} :
      </span>
      {props.children}
    </div>
  );
}
