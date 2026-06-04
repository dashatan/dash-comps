import { cn } from "@/lib";
import { SelectItem } from "../select/types";
import { ReactNode, useEffect, useRef } from "react";

export type ListItemProps = SelectItem & {
  active: boolean;
  onChange: (value?: string | number) => void;
  template?: ReactNode;
  /** When false, skip scroll-into-view (e.g. when parent uses initialTopMostItemIndex). Default true. */
  scrollIntoView?: boolean;
};

export function ListItem({
  label,
  value,
  onChange,
  active,
  className,
  disabled,
  template,
  scrollIntoView: enableScrollIntoView = true,
}: ListItemProps) {
  const ref = useRef<HTMLLIElement>(null);
  if (!label && !template) return null;

  useEffect(() => {
    if (!active || !enableScrollIntoView) return;
    const el = ref.current;
    if (!el) return;
    const t = window.setTimeout(() => {
      el.scrollIntoView({ block: "center", behavior: "auto" });
    }, 60);
    return () => window.clearTimeout(t);
  }, [active, enableScrollIntoView]);

  return (
    <li
      ref={ref}
      className={cn(
        "w-full cursor-pointer list-none rounded-md p-3 text-sm font-medium text-foreground transition-all",
        {
          "bg-input-accent": active,
          "bg-input hover:bg-input-accent/50": !active,
          "pointer-events-none opacity-50": disabled,
        },
        className,
      )}
      onClick={() => onChange(active ? undefined : value)}
      id={`list-item-${value}`}
    >
      {template || label}
    </li>
  );
}
