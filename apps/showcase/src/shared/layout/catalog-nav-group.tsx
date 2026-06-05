import { NavLink } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/common/collapsible";
import type { CatalogCategory, CatalogGroup } from "@/features/catalog/registry";
import { cn } from "@/lib";

type CatalogNavGroupProps = {
  group: CatalogGroup;
  label: string;
  items: CatalogCategory[];
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  getItemLabel: (category: CatalogCategory) => string;
};

export function CatalogNavGroup({
  group,
  label,
  items,
  isOpen,
  onOpenChange,
  getItemLabel,
}: CatalogNavGroupProps) {
  return (
    <Collapsible
      open={isOpen}
      onOpenChange={onOpenChange}
      className="group/section"
      data-group={group}
    >
      <CollapsibleTrigger
        className={cn(
          "flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left transition-colors",
          "text-sidebar-foreground/80 hover:bg-sidebar-accent/45 hover:text-sidebar-foreground",
          "focus-visible:ring-sidebar-ring focus-visible:ring-2 focus-visible:outline-none",
        )}
      >
        <ChevronRight
          className={cn(
            "text-sidebar-foreground/45 size-3.5 shrink-0 transition-transform duration-200",
            isOpen && "rotate-90",
          )}
        />
        <span className="truncate text-xs font-semibold tracking-wide uppercase">
          {label}
        </span>
        <span className="bg-sidebar-accent/50 text-sidebar-foreground/55 ms-auto rounded-md px-1.5 py-0.5 text-[10px] font-medium tabular-nums">
          {items.length}
        </span>
      </CollapsibleTrigger>

      <CollapsibleContent className="data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
        <ul className="border-sidebar-border/70 mt-1.5 ms-2.5 space-y-0.5 border-s ps-2.5">
          {items.map((category) => {
            const itemLabel = getItemLabel(category);

            return (
              <li key={category.slug}>
                <NavLink
                  to={`/components/${category.slug}`}
                  className={({ isActive }) =>
                    cn(
                      "relative flex items-center gap-2 rounded-md px-2.5 py-1.5 text-[13px] leading-snug transition-colors",
                      isActive
                        ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium before:bg-primary before:absolute before:inset-y-1.5 before:-start-[9px] before:w-0.5 before:rounded-full"
                        : "text-sidebar-foreground/70 hover:bg-sidebar-accent/45 hover:text-sidebar-accent-foreground",
                    )
                  }
                >
                  <category.icon className="size-3.5 shrink-0 opacity-70" />
                  <span className="truncate">{itemLabel}</span>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </CollapsibleContent>
    </Collapsible>
  );
}
