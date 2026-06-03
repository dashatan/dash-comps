import { MoreVertical } from "lucide-react";
import { ReactNode, useState } from "react";
import ActionMenuList from "./action-menu-list";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/common/overlay/popover";
import Button from "@/components/common/buttons";
import { cn } from "@/lib";

export interface ActionMenuProps {
  options?: {
    label: string;
    value: string;
    icon: ReactNode;
    className?: string;
    hide?: boolean;
    onClick?: () => void;
  }[];
  onChange?: (value: string) => void;
  triggerTemplate?: ReactNode;
}

export default function ActionMenu({
  onChange,
  options,
  triggerTemplate,
}: ActionMenuProps) {
  const [open, setOpen] = useState(false);
  if (!options?.filter((x) => !x.hide).length) return <></>;
  return (
    <div className="flex w-full items-center justify-center">
      <Popover open={open} onOpenChange={(e) => setOpen(e)}>
        <PopoverTrigger asChild>
          {triggerTemplate || (
            <Button severity="input" variant="icon-button" size="md">
              <MoreVertical size={16} />
            </Button>
          )}
        </PopoverTrigger>
        <PopoverContent align="end" withPortal>
          <ActionMenuList
            options={options}
            onChange={(e) => {
              setOpen(false);
              onChange && onChange(e);
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
