import { useState } from "react";
import { Button } from "@/components/common/buttons";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/common/overlay/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/common/overlay/sheet";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/common/overlay/popover";
import { useShowcasePage } from "@/features/catalog/i18n";
import { CatalogPageShell } from "@/features/catalog/ui/catalog-page-shell";
import { ShowcaseSection } from "@/features/catalog/ui/showcase-section";

export function OverlayPage() {
  const p = useShowcasePage("overlay");
  const [open, setOpen] = useState(false);

  return (
    <CatalogPageShell slug="overlay">
      <ShowcaseSection title={p("dialog.title")}>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>{p("dialog.openDialog")}</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{p("dialog.confirmAction")}</DialogTitle>
            </DialogHeader>
            <p className="text-muted-foreground text-sm">{p("dialog.description")}</p>
            <Button onClick={() => setOpen(false)}>{p("dialog.close")}</Button>
          </DialogContent>
        </Dialog>
      </ShowcaseSection>
      <ShowcaseSection title={p("sheet.title")} delay={0.05}>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outlined">{p("sheet.openSheet")}</Button>
          </SheetTrigger>
          <SheetContent side="right">
            <SheetHeader>
              <SheetTitle>{p("sheet.sidePanel")}</SheetTitle>
            </SheetHeader>
            <p className="text-muted-foreground text-sm">{p("sheet.description")}</p>
          </SheetContent>
        </Sheet>
      </ShowcaseSection>
      <ShowcaseSection title={p("popover.title")} delay={0.1}>
        <Popover>
          <PopoverTrigger asChild>
            <Button severity="secondary">{p("popover.button")}</Button>
          </PopoverTrigger>
          <PopoverContent className="w-56">
            <p className="text-sm font-medium">{p("popover.content")}</p>
            <p className="text-muted-foreground text-xs">{p("popover.description")}</p>
          </PopoverContent>
        </Popover>
      </ShowcaseSection>
    </CatalogPageShell>
  );
}
