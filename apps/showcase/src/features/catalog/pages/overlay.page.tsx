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
import { CatalogPageShell } from "@/features/catalog/ui/catalog-page-shell";
import { ShowcaseSection } from "@/features/catalog/ui/showcase-section";

export function OverlayPage() {
  const [open, setOpen] = useState(false);

  return (
    <CatalogPageShell slug="overlay">
      <ShowcaseSection title="Dialog">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Open dialog</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm action</DialogTitle>
            </DialogHeader>
            <p className="text-muted-foreground text-sm">Dialog from @/components/common/overlay/dialog.</p>
            <Button onClick={() => setOpen(false)}>Close</Button>
          </DialogContent>
        </Dialog>
      </ShowcaseSection>
      <ShowcaseSection title="Sheet" delay={0.05}>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outlined">Open sheet</Button>
          </SheetTrigger>
          <SheetContent side="right">
            <SheetHeader>
              <SheetTitle>Side panel</SheetTitle>
            </SheetHeader>
            <p className="text-muted-foreground text-sm">Sheet slides in from the edge.</p>
          </SheetContent>
        </Sheet>
      </ShowcaseSection>
      <ShowcaseSection title="Popover" delay={0.1}>
        <Popover>
          <PopoverTrigger asChild>
            <Button severity="secondary">Popover</Button>
          </PopoverTrigger>
          <PopoverContent className="w-56">
            <p className="text-sm font-medium">Popover content</p>
            <p className="text-muted-foreground text-xs">Anchored floating panel.</p>
          </PopoverContent>
        </Popover>
      </ShowcaseSection>
    </CatalogPageShell>
  );
}
