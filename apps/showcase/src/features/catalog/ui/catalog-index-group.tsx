import { Link } from "@tanstack/react-router";
import { catalogLinkParams } from "@/shared/router/nav-link";
import { motion } from "framer-motion";
import { ChevronRight, ArrowUpRight } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/common/collapsible";
import { AnimatedList, AnimatedItem, HoverScale } from "@/shared/motion/primitives";
import type { CatalogCategory, CatalogGroup } from "@/features/catalog/registry";
import { cn } from "@/lib";

type CatalogIndexGroupProps = {
  group: CatalogGroup;
  label: string;
  items: CatalogCategory[];
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  getTitle: (category: CatalogCategory) => string;
  getDescription: (category: CatalogCategory) => string;
  groupComponentsLabel: string;
};

export function CatalogIndexGroup({
  group,
  label,
  items,
  isOpen,
  onOpenChange,
  getTitle,
  getDescription,
  groupComponentsLabel,
}: CatalogIndexGroupProps) {
  return (
    <Collapsible
      open={isOpen}
      onOpenChange={onOpenChange}
      className="border-border/60 bg-card/20 rounded-2xl border"
      data-group={group}
    >
      <div id={group} className="scroll-mt-24" />
      <CollapsibleTrigger
        className={cn(
          "flex w-full items-center gap-3 rounded-2xl px-5 py-4 text-left transition-colors",
          "hover:bg-card/40 focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none",
        )}
      >
        <ChevronRight
          className={cn(
            "text-muted-foreground size-4 shrink-0 transition-transform duration-200",
            isOpen && "rotate-90",
          )}
        />
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-semibold tracking-wide uppercase">{label}</h3>
          <p className="text-muted-foreground mt-0.5 text-xs tabular-nums">
            {items.length} {groupComponentsLabel}
          </p>
        </div>
      </CollapsibleTrigger>

      <CollapsibleContent>
        <div className="border-border/60 border-t px-4 pt-2 pb-4">
          <AnimatedList className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((category) => (
              <AnimatedItem key={category.slug}>
                <HoverScale scale={1.015}>
                  <Link
                    to="/components/$slug"
                    params={catalogLinkParams(category.slug)}
                    className="group border-border/70 bg-card/50 flex items-start gap-3 rounded-xl border p-4 backdrop-blur-sm transition-colors hover:border-primary/30"
                  >
                    <motion.div
                      whileHover={{ rotate: 8 }}
                      className="bg-primary/10 text-primary flex size-10 shrink-0 items-center justify-center rounded-lg"
                    >
                      <category.icon className="size-4" />
                    </motion.div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="text-sm font-semibold">{getTitle(category)}</h4>
                        <ArrowUpRight className="text-muted-foreground size-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
                      </div>
                      <p className="text-muted-foreground mt-1 line-clamp-2 text-xs">
                        {getDescription(category)}
                      </p>
                    </div>
                  </Link>
                </HoverScale>
              </AnimatedItem>
            ))}
          </AnimatedList>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
