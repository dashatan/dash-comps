import { useState, type ReactNode } from "react";
import {
  Copy,
  Download,
  ExternalLink,
  Heart,
  Share2,
  Star,
  Trash2,
} from "lucide-react";
import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/components/common/context-menu";
import { showcaseCarouselImages } from "@/features/catalog/data/carousel-samples";
import { useShowcasePage } from "@/features/catalog/i18n";
import { CatalogPageShell } from "@/features/catalog/ui/catalog-page-shell";
import { ShowcaseSection } from "@/features/catalog/ui/showcase-section";
import { cn } from "@/lib";

const GALLERY_PRODUCT_KEYS = [
  "watch",
  "headphones",
  "camera",
  "sneaker",
] as const;

const MENU_CONTENT_CLASS = "w-52";

type SortOption = "name" | "date" | "size";
type ViewOption = "list" | "grid";

function ShowcaseRow({
  label,
  children,
  className,
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex min-w-0 flex-col gap-2", className)}>
      <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
        {label}
      </p>
      {children}
    </div>
  );
}

function TextTrigger({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <ContextMenuTrigger
      className={cn(
        "w-full rounded-lg border border-border bg-muted/40 px-6 py-5 text-center text-sm",
        "cursor-context-menu select-none",
        "focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
        className,
      )}
    >
      {children}
    </ContextMenuTrigger>
  );
}

function ImageTrigger({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    <ContextMenuTrigger asChild>
      <button
        type="button"
        className={cn(
          "overflow-hidden rounded-xl border border-border",
          "cursor-context-menu transition hover:opacity-95 active:scale-[0.99]",
          "focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
          className,
        )}
        aria-label={alt}
      >
        <img
          src={src}
          alt=""
          aria-hidden
          className="h-full w-full object-cover"
        />
      </button>
    </ContextMenuTrigger>
  );
}

export function ContextMenuPage() {
  const p = useShowcasePage("context-menu");

  const [showGrid, setShowGrid] = useState(true);
  const [showLabels, setShowLabels] = useState(false);
  const [showBadges, setShowBadges] = useState(true);
  const [sortBy, setSortBy] = useState<SortOption>("name");
  const [viewAs, setViewAs] = useState<ViewOption>("grid");

  return (
    <CatalogPageShell slug="context-menu">
      <ShowcaseSection
        title={p("basic.title")}
        description={p("basic.description")}
      >
        <ContextMenu>
          <TextTrigger>{p("basic.trigger")}</TextTrigger>
          <ContextMenuContent className={MENU_CONTENT_CLASS}>
            <ContextMenuItem>{p("basic.copy")}</ContextMenuItem>
            <ContextMenuItem>{p("basic.paste")}</ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem variant="destructive">
              {p("basic.delete")}
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("imageTrigger.title")}
        description={p("imageTrigger.description")}
        delay={0.05}
      >
        <ContextMenu>
          <ImageTrigger
            src={showcaseCarouselImages.card.coast}
            alt={p("imageTrigger.alt")}
            className="h-48 w-full"
          />
          <ContextMenuContent className={MENU_CONTENT_CLASS}>
            <ContextMenuItem>
              <ExternalLink className="size-4 shrink-0" />
              {p("imageTrigger.open")}
            </ContextMenuItem>
            <ContextMenuItem>
              <Copy className="size-4 shrink-0" />
              {p("imageTrigger.copyImage")}
            </ContextMenuItem>
            <ContextMenuItem>
              <Download className="size-4 shrink-0" />
              {p("imageTrigger.saveAs")}
            </ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem>
              <Star className="size-4 shrink-0" />
              {p("imageTrigger.setWallpaper")}
            </ContextMenuItem>
            <ContextMenuItem variant="destructive">
              <Trash2 className="size-4 shrink-0" />
              {p("imageTrigger.remove")}
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("shortcuts.title")}
        description={p("shortcuts.description")}
        delay={0.1}
      >
        <ContextMenu>
          <TextTrigger>{p("shortcuts.trigger")}</TextTrigger>
          <ContextMenuContent className={MENU_CONTENT_CLASS}>
            <ContextMenuLabel>{p("shortcuts.label")}</ContextMenuLabel>
            <ContextMenuItem>
              {p("shortcuts.undo")}
              <ContextMenuShortcut>
                {p("shortcuts.undoShortcut")}
              </ContextMenuShortcut>
            </ContextMenuItem>
            <ContextMenuItem>
              {p("shortcuts.redo")}
              <ContextMenuShortcut>
                {p("shortcuts.redoShortcut")}
              </ContextMenuShortcut>
            </ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem>
              {p("shortcuts.cut")}
              <ContextMenuShortcut>
                {p("shortcuts.cutShortcut")}
              </ContextMenuShortcut>
            </ContextMenuItem>
            <ContextMenuItem>
              {p("shortcuts.copy")}
              <ContextMenuShortcut>
                {p("shortcuts.copyShortcut")}
              </ContextMenuShortcut>
            </ContextMenuItem>
            <ContextMenuItem>
              {p("shortcuts.paste")}
              <ContextMenuShortcut>
                {p("shortcuts.pasteShortcut")}
              </ContextMenuShortcut>
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("labels.title")}
        description={p("labels.description")}
        delay={0.15}
      >
        <ContextMenu>
          <TextTrigger>{p("labels.trigger")}</TextTrigger>
          <ContextMenuContent className={MENU_CONTENT_CLASS}>
            <ContextMenuLabel>{p("labels.fileActions")}</ContextMenuLabel>
            <ContextMenuItem>{p("labels.open")}</ContextMenuItem>
            <ContextMenuItem>{p("labels.rename")}</ContextMenuItem>
            <ContextMenuItem>{p("labels.share")}</ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuLabel>{p("labels.dangerZone")}</ContextMenuLabel>
            <ContextMenuItem>{p("labels.archive")}</ContextMenuItem>
            <ContextMenuItem variant="destructive">
              {p("labels.delete")}
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("checkbox.title")}
        description={p("checkbox.description")}
        delay={0.2}
        layout="stack"
      >
        <ContextMenu>
          <TextTrigger>{p("checkbox.trigger")}</TextTrigger>
          <ContextMenuContent className={MENU_CONTENT_CLASS}>
            <ContextMenuLabel>{p("checkbox.label")}</ContextMenuLabel>
            <ContextMenuCheckboxItem
              checked={showGrid}
              onCheckedChange={setShowGrid}
            >
              {p("checkbox.showGrid")}
            </ContextMenuCheckboxItem>
            <ContextMenuCheckboxItem
              checked={showLabels}
              onCheckedChange={setShowLabels}
            >
              {p("checkbox.showLabels")}
            </ContextMenuCheckboxItem>
            <ContextMenuCheckboxItem
              checked={showBadges}
              onCheckedChange={setShowBadges}
            >
              {p("checkbox.showBadges")}
            </ContextMenuCheckboxItem>
          </ContextMenuContent>
        </ContextMenu>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("radio.title")}
        description={p("radio.description")}
        delay={0.25}
        layout="stack"
      >
        <ContextMenu>
          <TextTrigger>{p("radio.trigger")}</TextTrigger>
          <ContextMenuContent className={MENU_CONTENT_CLASS}>
            <ContextMenuLabel>{p("radio.sortLabel")}</ContextMenuLabel>
            <ContextMenuRadioGroup
              value={sortBy}
              onValueChange={(value) => setSortBy(value as SortOption)}
            >
              <ContextMenuRadioItem value="name">
                {p("radio.name")}
              </ContextMenuRadioItem>
              <ContextMenuRadioItem value="date">
                {p("radio.date")}
              </ContextMenuRadioItem>
              <ContextMenuRadioItem value="size">
                {p("radio.size")}
              </ContextMenuRadioItem>
            </ContextMenuRadioGroup>
            <ContextMenuSeparator />
            <ContextMenuLabel>{p("radio.viewLabel")}</ContextMenuLabel>
            <ContextMenuRadioGroup
              value={viewAs}
              onValueChange={(value) => setViewAs(value as ViewOption)}
            >
              <ContextMenuRadioItem value="list">
                {p("radio.list")}
              </ContextMenuRadioItem>
              <ContextMenuRadioItem value="grid">
                {p("radio.grid")}
              </ContextMenuRadioItem>
            </ContextMenuRadioGroup>
          </ContextMenuContent>
        </ContextMenu>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("submenu.title")}
        description={p("submenu.description")}
        delay={0.3}
      >
        <ContextMenu>
          <ImageTrigger
            src={showcaseCarouselImages.product.watch}
            alt={p("submenu.alt")}
            className="h-40 w-40"
          />
          <ContextMenuContent className={MENU_CONTENT_CLASS}>
            <ContextMenuItem>{p("submenu.addToCart")}</ContextMenuItem>
            <ContextMenuSub>
              <ContextMenuSubTrigger>
                <Share2 className="size-4 shrink-0" />
                {p("submenu.share")}
              </ContextMenuSubTrigger>
              <ContextMenuSubContent className={MENU_CONTENT_CLASS}>
                <ContextMenuItem>{p("submenu.copyLink")}</ContextMenuItem>
                <ContextMenuItem>{p("submenu.email")}</ContextMenuItem>
                <ContextMenuItem>{p("submenu.social")}</ContextMenuItem>
              </ContextMenuSubContent>
            </ContextMenuSub>
            <ContextMenuSub>
              <ContextMenuSubTrigger>
                <Download className="size-4 shrink-0" />
                {p("submenu.export")}
              </ContextMenuSubTrigger>
              <ContextMenuSubContent className={MENU_CONTENT_CLASS}>
                <ContextMenuItem>{p("submenu.png")}</ContextMenuItem>
                <ContextMenuItem>{p("submenu.jpeg")}</ContextMenuItem>
                <ContextMenuItem>{p("submenu.webp")}</ContextMenuItem>
              </ContextMenuSubContent>
            </ContextMenuSub>
          </ContextMenuContent>
        </ContextMenu>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("disabled.title")}
        description={p("disabled.description")}
        delay={0.35}
      >
        <ContextMenu>
          <TextTrigger>{p("disabled.trigger")}</TextTrigger>
          <ContextMenuContent className={MENU_CONTENT_CLASS}>
            <ContextMenuLabel>{p("disabled.label")}</ContextMenuLabel>
            <ContextMenuItem>{p("disabled.duplicate")}</ContextMenuItem>
            <ContextMenuItem disabled>
              {p("disabled.moveDisabled")}
            </ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuLabel inset>
              {p("disabled.insetLabel")}
            </ContextMenuLabel>
            <ContextMenuItem inset>{p("disabled.inspect")}</ContextMenuItem>
            <ContextMenuItem inset disabled>
              {p("disabled.devtools")}
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("gallery.title")}
        description={p("gallery.description")}
        delay={0.4}
        layout="stack"
        className="w-full"
      >
        <ShowcaseRow label={p("gallery.rowLabel")}>
          <div className="grid w-full grid-cols-2 gap-3 sm:grid-cols-4">
            {GALLERY_PRODUCT_KEYS.map((key) => (
              <ContextMenu key={key}>
                <ImageTrigger
                  src={showcaseCarouselImages.product[key]}
                  alt={p(`gallery.products.${key}`)}
                  className="aspect-square w-full"
                />
                <ContextMenuContent className={MENU_CONTENT_CLASS}>
                  <ContextMenuItem>
                    <Heart className="size-4 shrink-0" />
                    {p("gallery.favorite")}
                  </ContextMenuItem>
                  <ContextMenuItem>
                    <Download className="size-4 shrink-0" />
                    {p("gallery.download")}
                  </ContextMenuItem>
                  <ContextMenuItem>
                    <Share2 className="size-4 shrink-0" />
                    {p("gallery.share")}
                  </ContextMenuItem>
                  <ContextMenuSeparator />
                  <ContextMenuItem variant="destructive">
                    <Trash2 className="size-4 shrink-0" />
                    {p("gallery.delete")}
                  </ContextMenuItem>
                </ContextMenuContent>
              </ContextMenu>
            ))}
          </div>
        </ShowcaseRow>
      </ShowcaseSection>
    </CatalogPageShell>
  );
}
