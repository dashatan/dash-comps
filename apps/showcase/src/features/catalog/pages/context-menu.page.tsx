import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/common/context-menu";
import { CatalogPageShell } from "@/features/catalog/ui/catalog-page-shell";
import { ShowcaseSection } from "@/features/catalog/ui/showcase-section";

export function ContextMenuPage() {
  return (
    <CatalogPageShell slug="context-menu">
      <ShowcaseSection title="Right-click menu">
        <ContextMenu>
          <ContextMenuTrigger className="border-border rounded-lg border px-10 py-8 text-sm">
            Right-click here
          </ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuItem>Copy</ContextMenuItem>
            <ContextMenuItem>Paste</ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem>Delete</ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      </ShowcaseSection>
    </CatalogPageShell>
  );
}
