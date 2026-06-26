import BasicTextInput from "@/components/common/inputs/text/basic";
import { cn, useLanguage } from "@/lib";
import { SearchNormal1 } from "iconsax-reactjs";

export type TableSearchBoxProps = {
  className?: string;
  value?: string;
  onChange?: (val: string) => void;
};

export function TableSearchBox({
  className,
  onChange,
  value,
}: TableSearchBoxProps) {
  const { t } = useLanguage();
  return (
    <div
      className={cn(
        "flex h-14 w-60 items-center overflow-hidden rounded-md border-2 border-input-border bg-input ps-2 pe-4 text-foreground/70",
        className,
      )}
    >
      <BasicTextInput
        className="text-foreground/70 placeholder:text-foreground/70"
        placeholder={t("common.search") + "..."}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
      />
      <SearchNormal1 className="size-5 text-sidebar-icon" />
    </div>
  );
}
