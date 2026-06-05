import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/common/context-menu";
import { CatalogPageShell } from "@/features/catalog/ui/catalog-page-shell";
import { ShowcaseSection } from "@/features/catalog/ui/showcase-section";
import { useShowcasePage } from "@/features/catalog/i18n";

export function ContextMenuPage() {
  const p = useShowcasePage("context-menu");

  return (
    <CatalogPageShell slug="context-menu">
      <ShowcaseSection title={p("rightClickMenu.title")}>
        <ContextMenu>
          <ContextMenuTrigger className="border-border rounded-lg border px-10 py-8 text-sm">
            {p("rightClickMenu.trigger")}
          </ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuItem>{p("rightClickMenu.copy")}</ContextMenuItem>
            <ContextMenuItem>{p("rightClickMenu.paste")}</ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem>{p("rightClickMenu.delete")}</ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      </ShowcaseSection>
    </CatalogPageShell>
  );
}
