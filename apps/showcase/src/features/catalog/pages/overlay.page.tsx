import { useMemo, useState, type ReactNode } from "react";
import { Bell, ShoppingCart, SlidersHorizontal } from "lucide-react";
import { Avatar } from "@/components/common/avatar";
import Badge from "@/components/common/badge";
import { Button } from "@/components/common/buttons";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/common/overlay/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/common/overlay/popover";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/common/overlay/sheet";
import {
  showcaseOverlayCartItems,
  showcaseOverlayFilterOptions,
  showcaseOverlayImages,
  showcaseOverlayMember,
  showcaseOverlayNotifications,
  showcaseOverlayStats,
  showcasePopoverAligns,
  showcaseSheetSides,
  type ShowcaseOverlayFilterOption,
  type ShowcasePopoverAlign,
  type ShowcaseSheetSide,
} from "@/features/catalog/data/overlay-samples";
import { useShowcasePage } from "@/features/catalog/i18n";
import { CatalogPageShell } from "@/features/catalog/ui/catalog-page-shell";
import { ShowcaseSection } from "@/features/catalog/ui/showcase-section";
import { cn } from "@/lib";

function ShowcaseRow({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex min-w-0 flex-col gap-2">
      <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
        {label}
      </p>
      <div className="flex flex-wrap items-center gap-3">{children}</div>
    </div>
  );
}

function SheetSideDemo({
  side,
  label,
  body,
}: {
  side: ShowcaseSheetSide;
  label: string;
  body: string;
}) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outlined">{label}</Button>
      </SheetTrigger>
      <SheetContent side={side} className="w-full sm:w-96">
        <SheetHeader>
          <SheetTitle>{label}</SheetTitle>
          <SheetDescription>{body}</SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}

function PopoverAlignDemo({
  align,
  label,
  panelLabel,
}: {
  align: ShowcasePopoverAlign;
  label: string;
  panelLabel: string;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button severity="secondary" variant="outlined">
          {label}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align={align}
        className="w-52 border bg-card p-3 shadow-md"
      >
        <p className="text-sm font-medium">{panelLabel}</p>
        <p className="mt-1 text-xs text-muted-foreground">
          align=&quot;{align}&quot;
        </p>
      </PopoverContent>
    </Popover>
  );
}

export function OverlayPage() {
  const p = useShowcasePage("overlay");
  const [controlledOpen, setControlledOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<
    ShowcaseOverlayFilterOption[]
  >(["electronics", "workspace"]);

  const cartTotal = useMemo(
    () =>
      showcaseOverlayCartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
      ),
    [],
  );

  const toggleFilter = (option: ShowcaseOverlayFilterOption) => {
    setSelectedFilters((current) =>
      current.includes(option)
        ? current.filter((value) => value !== option)
        : [...current, option],
    );
  };

  return (
    <CatalogPageShell slug="overlay">
      <ShowcaseSection
        title={p("compound.title")}
        description={p("compound.description")}
        layout="stack"
      >
        <Dialog>
          <DialogTrigger asChild>
            <Button size="lg">{p("compound.primaryAction")}</Button>
          </DialogTrigger>
          <DialogContent
            title={p("compound.heading")}
            className="w-full sm:w-[42rem]"
          >
            <div className="flex flex-col gap-4 p-4 sm:flex-row">
              <div className="relative h-48 shrink-0 overflow-hidden rounded-xl sm:h-auto sm:w-56">
                <img
                  src={showcaseOverlayImages.workspace}
                  alt={p("compound.heading")}
                  className="h-full w-full object-cover"
                />
                <Badge
                  severity="primary"
                  className="absolute start-3 top-3"
                  size="sm"
                >
                  {p("compound.badge")}
                </Badge>
              </div>
              <div className="flex min-w-0 flex-1 flex-col gap-3">
                <DialogDescription className="text-sm leading-relaxed">
                  {p("compound.subheading")}
                </DialogDescription>
                <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
                  {showcaseOverlayStats.map((stat) => (
                    <li
                      key={stat.key}
                      className="flex items-center justify-between rounded-lg border border-border px-3 py-2"
                    >
                      <span>{p(`stats.${stat.key}`)}</span>
                      <span className="font-semibold text-foreground">
                        {stat.value}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outlined">
                {p("compound.secondaryAction")}
              </Button>
              <Button>{p("compound.primaryAction")}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("dialog.basic.title")}
        description={p("dialog.basic.description")}
      >
        <Dialog>
          <DialogTrigger asChild>
            <Button>{p("dialog.basic.open")}</Button>
          </DialogTrigger>
          <DialogContent
            title={p("dialog.basic.heading")}
            className="w-full sm:w-[32rem]"
          >
            <div className="p-4 text-sm leading-relaxed text-muted-foreground">
              {p("dialog.basic.body")}
            </div>
          </DialogContent>
        </Dialog>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("dialog.confirmation.title")}
        description={p("dialog.confirmation.description")}
        layout="stack"
      >
        <Dialog>
          <DialogTrigger asChild>
            <Button severity="danger" variant="outlined">
              {p("dialog.confirmation.open")}
            </Button>
          </DialogTrigger>
          <DialogContent
            title={p("dialog.confirmation.heading")}
            className="w-full sm:w-[28rem]"
          >
            <DialogDescription className="px-4 pb-2 text-sm leading-relaxed">
              {p("dialog.confirmation.body")}
            </DialogDescription>
            <DialogFooter>
              <Button variant="outlined">
                {p("dialog.confirmation.cancel")}
              </Button>
              <Button severity="danger">
                {p("dialog.confirmation.confirm")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("dialog.controlled.title")}
        description={p("dialog.controlled.description")}
        layout="stack"
      >
        <ShowcaseRow
          label={
            controlledOpen
              ? p("dialog.controlled.stateOpen")
              : p("dialog.controlled.stateClosed")
          }
        >
          <Button onClick={() => setControlledOpen(true)}>
            {p("dialog.controlled.open")}
          </Button>
          <Badge severity={controlledOpen ? "success" : "secondary"}>
            {controlledOpen
              ? p("dialog.controlled.stateOpen")
              : p("dialog.controlled.stateClosed")}
          </Badge>
        </ShowcaseRow>
        <Dialog open={controlledOpen} onOpenChange={setControlledOpen}>
          <DialogContent
            title={p("dialog.controlled.heading")}
            className="w-full sm:w-[30rem]"
          >
            <DialogDescription className="px-4 pb-2 text-sm leading-relaxed">
              {p("dialog.controlled.body")}
            </DialogDescription>
            <DialogFooter>
              <Button
                variant="outlined"
                onClick={() => setControlledOpen(false)}
              >
                {p("dialog.controlled.close")}
              </Button>
              <Button onClick={() => setControlledOpen(false)}>
                {p("dialog.controlled.download")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("dialog.hideHeader.title")}
        description={p("dialog.hideHeader.description")}
      >
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outlined">{p("dialog.hideHeader.open")}</Button>
          </DialogTrigger>
          <DialogContent
            hideHeader
            className="w-full overflow-hidden sm:w-[36rem]"
          >
            <img
              src={showcaseOverlayImages.heroTravel}
              alt={p("dialog.hideHeader.alt")}
              className="h-72 w-full object-cover sm:h-96"
            />
          </DialogContent>
        </Dialog>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("dialog.large.title")}
        description={p("dialog.large.description")}
        layout="stack"
      >
        <Dialog>
          <DialogTrigger asChild>
            <Button severity="secondary">{p("dialog.large.open")}</Button>
          </DialogTrigger>
          <DialogContent
            title={p("dialog.large.heading")}
            className="h-11/12 w-11/12"
          >
            <div className="grid min-h-0 flex-1 gap-4 p-4 lg:grid-cols-[1.2fr_1fr]">
              <img
                src={showcaseOverlayImages.analytics}
                alt={p("dialog.large.previewAlt")}
                className="h-64 w-full rounded-xl object-cover lg:h-full lg:min-h-80"
              />
              <div className="flex min-w-0 flex-col gap-4">
                <p className="text-sm text-muted-foreground">
                  {p("dialog.large.descriptionText")}
                </p>
                <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                  {showcaseOverlayStats.map((stat) => (
                    <div
                      key={stat.key}
                      className="rounded-xl border border-border bg-muted/20 p-4"
                    >
                      <p className="text-xs tracking-wide text-muted-foreground uppercase">
                        {p(`stats.${stat.key}`)}
                      </p>
                      <p className="mt-1 text-2xl font-bold">{stat.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("sheet.sides.title")}
        description={p("sheet.sides.description")}
      >
        {showcaseSheetSides.map((side) => (
          <SheetSideDemo
            key={side}
            side={side}
            label={p(`sheet.sides.${side}`)}
            body={p(`sheet.sides.${side}Body`)}
          />
        ))}
      </ShowcaseSection>

      <ShowcaseSection
        title={p("sheet.memberDetail.title")}
        description={p("sheet.memberDetail.description")}
        layout="stack"
      >
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outlined">{p("sheet.memberDetail.open")}</Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-full sm:w-96">
            <SheetHeader>
              <div className="flex items-center gap-4">
                <Avatar
                  user={showcaseOverlayMember.user}
                  src={showcaseOverlayMember.src}
                  size="xl"
                  alt={p("sheet.memberDetail.heading")}
                />
                <div className="min-w-0">
                  <SheetTitle>{p("sheet.memberDetail.heading")}</SheetTitle>
                  <SheetDescription>
                    {p("sheet.memberDetail.role")}
                  </SheetDescription>
                </div>
              </div>
            </SheetHeader>
            <div className="mt-6 flex flex-col gap-4">
              <p className="text-sm leading-relaxed text-muted-foreground">
                {p("sheet.memberDetail.bio")}
              </p>
              <dl className="grid grid-cols-3 gap-3 text-center">
                <div className="rounded-lg border border-border p-3">
                  <dt className="text-xs text-muted-foreground">
                    {p("sheet.memberDetail.email")}
                  </dt>
                  <dd className="mt-1 truncate text-sm font-medium">
                    {showcaseOverlayMember.email}
                  </dd>
                </div>
                <div className="rounded-lg border border-border p-3">
                  <dt className="text-xs text-muted-foreground">
                    {p("sheet.memberDetail.projects")}
                  </dt>
                  <dd className="mt-1 text-sm font-semibold">
                    {showcaseOverlayMember.projects}
                  </dd>
                </div>
                <div className="rounded-lg border border-border p-3">
                  <dt className="text-xs text-muted-foreground">
                    {p("sheet.memberDetail.tasks")}
                  </dt>
                  <dd className="mt-1 text-sm font-semibold">
                    {showcaseOverlayMember.tasks}
                  </dd>
                </div>
              </dl>
            </div>
            <SheetFooter className="mt-auto gap-2 pt-6">
              <Button variant="outlined">
                {p("sheet.memberDetail.message")}
              </Button>
              <Button>{p("sheet.memberDetail.assign")}</Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("sheet.filters.title")}
        description={p("sheet.filters.description")}
        layout="stack"
      >
        <Sheet>
          <SheetTrigger asChild>
            <Button severity="secondary" variant="outlined">
              <SlidersHorizontal className="me-2 size-4" />
              {p("sheet.filters.open")}
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-full sm:w-80">
            <SheetHeader>
              <SheetTitle>{p("sheet.filters.heading")}</SheetTitle>
            </SheetHeader>
            <div className="mt-6 flex flex-col gap-2">
              {showcaseOverlayFilterOptions.map((option) => {
                const active = selectedFilters.includes(option);
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => toggleFilter(option)}
                    className={cn(
                      "flex items-center justify-between rounded-lg border border-border px-3 py-2.5 text-start text-sm transition-colors",
                      active
                        ? "border-primary bg-primary/10 text-foreground"
                        : "text-muted-foreground hover:bg-muted/40",
                    )}
                  >
                    {p(`sheet.filters.options.${option}`)}
                    {active ? (
                      <Badge severity="primary" size="xs">
                        {selectedFilters.indexOf(option) + 1}
                      </Badge>
                    ) : null}
                  </button>
                );
              })}
            </div>
            <SheetFooter className="mt-auto gap-2 pt-6">
              <Button variant="outlined" onClick={() => setSelectedFilters([])}>
                {p("sheet.filters.reset")}
              </Button>
              <Button>{p("sheet.filters.apply")}</Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("sheet.cart.title")}
        description={p("sheet.cart.description")}
        layout="stack"
      >
        <Sheet>
          <SheetTrigger asChild>
            <Button>
              <ShoppingCart className="me-2 size-4" />
              {p("sheet.cart.open")}
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-auto rounded-t-2xl">
            <SheetHeader>
              <SheetTitle>{p("sheet.cart.heading")}</SheetTitle>
            </SheetHeader>
            <ul className="mt-4 flex flex-col gap-3">
              {showcaseOverlayCartItems.map((item) => (
                <li
                  key={item.key}
                  className="flex items-center gap-3 rounded-xl border border-border p-3"
                >
                  <img
                    src={item.image}
                    alt={p(`sheet.cart.items.${item.key}`)}
                    className="size-16 shrink-0 rounded-lg object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">
                      {p(`sheet.cart.items.${item.key}`)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      ×{item.quantity}
                    </p>
                  </div>
                  <p className="text-sm font-semibold">
                    ${item.price * item.quantity}
                  </p>
                </li>
              ))}
            </ul>
            <SheetFooter className="mt-4 flex-row items-center justify-between border-t border-border pt-4">
              <div>
                <p className="text-xs text-muted-foreground">
                  {p("sheet.cart.total")}
                </p>
                <p className="text-lg font-bold">${cartTotal}</p>
              </div>
              <Button>{p("sheet.cart.checkout")}</Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("popover.basic.title")}
        description={p("popover.basic.description")}
      >
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outlined">{p("popover.basic.trigger")}</Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 border bg-card p-4 shadow-md">
            <p className="text-sm font-medium">{p("popover.basic.content")}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {p("popover.basic.hint")}
            </p>
          </PopoverContent>
        </Popover>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("popover.portal.title")}
        description={p("popover.portal.description")}
        layout="stack"
      >
        <div className="h-40 w-full overflow-hidden rounded-xl border border-border bg-muted/20 p-4">
          <p className="mb-3 text-xs tracking-wide text-muted-foreground uppercase">
            {p("popover.portal.overflowLabel")}
          </p>
          <Popover>
            <PopoverTrigger asChild>
              <Button size="sm">{p("popover.portal.trigger")}</Button>
            </PopoverTrigger>
            <PopoverContent
              withPortal
              className="w-64 border bg-card p-4 shadow-md"
            >
              <p className="text-sm font-medium">
                {p("popover.portal.content")}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {p("popover.portal.hint")}
              </p>
            </PopoverContent>
          </Popover>
        </div>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("popover.profile.title")}
        description={p("popover.profile.description")}
      >
        <Popover>
          <PopoverTrigger asChild>
            <Button severity="secondary">{p("popover.profile.trigger")}</Button>
          </PopoverTrigger>
          <PopoverContent
            withPortal
            className="w-72 border bg-card p-0 shadow-md"
          >
            <div className="flex items-center gap-3 border-b p-4">
              <Avatar
                user={showcaseOverlayMember.user}
                src={showcaseOverlayMember.src}
                size="lg"
                alt={p("popover.profile.name")}
              />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">
                  {p("popover.profile.name")}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {p("popover.profile.role")}
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-1 p-2">
              <Button variant="text" className="justify-start">
                {p("popover.profile.viewProfile")}
              </Button>
              <Button variant="text" className="justify-start">
                {p("popover.profile.message")}
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("popover.notifications.title")}
        description={p("popover.notifications.description")}
        layout="stack"
      >
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outlined">
              <Bell className="me-2 size-4" />
              {p("popover.notifications.trigger")}
            </Button>
          </PopoverTrigger>
          <PopoverContent
            withPortal
            className="w-80 border bg-card p-0 shadow-md"
          >
            <div className="flex items-center justify-between border-b px-4 py-3">
              <p className="text-sm font-semibold">
                {p("popover.notifications.trigger")}
              </p>
              <Button variant="text" size="sm">
                {p("popover.notifications.markAll")}
              </Button>
            </div>
            <ul className="divide-y divide-border">
              {showcaseOverlayNotifications.map((item) => (
                <li key={item.key} className="flex gap-3 px-4 py-3">
                  <Avatar user={item.user} src={item.avatar} size="md" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm leading-snug">
                      <span className="font-medium">
                        {item.user.first_name} {item.user.last_name}
                      </span>{" "}
                      {p(`popover.notifications.items.${item.key}`)}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {item.time}
                    </p>
                  </div>
                  {item.unread ? (
                    <span className="mt-1 size-2 shrink-0 rounded-full bg-primary" />
                  ) : null}
                </li>
              ))}
            </ul>
            <div className="border-t p-2">
              <Button variant="text" className="w-full justify-center">
                {p("popover.notifications.viewAll")}
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("popover.product.title")}
        description={p("popover.product.description")}
      >
        <Popover>
          <PopoverTrigger asChild>
            <Button>{p("popover.product.trigger")}</Button>
          </PopoverTrigger>
          <PopoverContent
            withPortal
            className="w-72 border bg-card p-0 shadow-md"
          >
            <img
              src={showcaseOverlayImages.productCamera}
              alt={p("popover.product.name")}
              className="h-40 w-full object-cover"
            />
            <div className="flex flex-col gap-2 p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-sm font-semibold">
                    {p("popover.product.name")}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {p("popover.product.descriptionText")}
                  </p>
                </div>
                <Badge severity="success">{p("popover.product.price")}</Badge>
              </div>
              <Button size="sm">{p("popover.product.addToCart")}</Button>
            </div>
          </PopoverContent>
        </Popover>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("popover.alignment.title")}
        description={p("popover.alignment.description")}
      >
        {showcasePopoverAligns.map((align) => (
          <PopoverAlignDemo
            key={align}
            align={align}
            label={p(`popover.alignment.${align}`)}
            panelLabel={p("popover.alignment.panel")}
          />
        ))}
      </ShowcaseSection>
    </CatalogPageShell>
  );
}
