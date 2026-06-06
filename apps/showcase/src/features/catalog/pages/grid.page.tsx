import { type ReactNode } from "react";
import {
  Activity,
  BarChart3,
  LayoutGrid,
  ShoppingBag,
  TrendingUp,
  Users,
} from "lucide-react";
import { Button } from "@/components/common/buttons";
import {
  GridCard,
  GridContainer,
  GridGroup,
  GridHeader,
} from "@/components/common/grid";
import { showcaseGridImages } from "@/features/catalog/data/grid-samples";
import { useShowcasePage } from "@/features/catalog/i18n";
import { CatalogPageShell } from "@/features/catalog/ui/catalog-page-shell";
import { ShowcaseSection } from "@/features/catalog/ui/showcase-section";
import { cn } from "@/lib";

type GridTranslate = ReturnType<typeof useShowcasePage<"grid">>;

/** Explicit 12-col spans — showcase always renders multi-column layouts. */
const span = {
  quarter: "col-span-3",
  third: "col-span-4",
  half: "col-span-6",
  twoThirds: "col-span-8",
  full: "col-span-12",
} as const;

/** Simulates the dashboard content pane — GridContainer needs a sized flex parent. */
function DashboardViewport({
  children,
  className,
  height = "h-[28rem]",
}: {
  children: ReactNode;
  className?: string;
  height?: string;
}) {
  return (
    <div className={cn("flex w-full min-h-0 flex-col", height, className)}>
      {children}
    </div>
  );
}

function WidgetImage({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    <img
      src={src}
      alt={alt}
      className={cn("min-h-0 w-full flex-1 rounded-lg object-cover", className)}
      loading="lazy"
    />
  );
}

function KpiValue({
  label,
  value,
  trend,
}: {
  label: string;
  value: string;
  trend?: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-2xl font-semibold tabular-nums">{value}</span>
      {trend ? (
        <span className="text-xs text-emerald-600 dark:text-emerald-400">
          {trend}
        </span>
      ) : null}
    </div>
  );
}

function ActivityRow({
  image,
  alt,
  title,
  meta,
}: {
  image: string;
  alt: string;
  title: string;
  meta: string;
}) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <img
        src={image}
        alt={alt}
        className="size-10 shrink-0 rounded-md object-cover"
        loading="lazy"
      />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{title}</p>
        <p className="truncate text-xs text-muted-foreground">{meta}</p>
      </div>
    </div>
  );
}

function MetricWidget({
  p,
  widgetKey,
  icon,
  variant = "default",
  className,
  imageSrc,
}: {
  p: GridTranslate;
  widgetKey: "revenue" | "orders" | "users" | "conversion";
  icon: ReactNode;
  variant?: "default" | "elevated";
  className?: string;
  imageSrc?: string;
}) {
  return (
    <GridCard variant={variant} className={cn("min-h-0", className)}>
      <GridHeader
        Icon={icon}
        title={p(`widgets.${widgetKey}.title`)}
        subtitle={p(`widgets.${widgetKey}.subtitle`)}
      />
      <KpiValue
        label={p(`widgets.${widgetKey}.metricLabel`)}
        value={p(`widgets.${widgetKey}.metricValue`)}
        trend={p(`widgets.${widgetKey}.trend`)}
      />
      {imageSrc ? (
        <WidgetImage
          src={imageSrc}
          alt={p(`widgets.${widgetKey}.imageAlt`)}
          className="max-h-24"
        />
      ) : null}
    </GridCard>
  );
}

export function GridPage() {
  const p = useShowcasePage("grid");

  return (
    <CatalogPageShell slug="grid">
      <ShowcaseSection
        title={p("twoByTwo.title")}
        description={p("twoByTwo.description")}
        layout="stack"
        className="w-full"
        contentClassName="p-0"
      >
        <DashboardViewport>
          <GridContainer aria-label={p("twoByTwo.ariaLabel")}>
            <MetricWidget
              p={p}
              widgetKey="revenue"
              icon={<TrendingUp className="size-5" />}
              className={span.half}
              imageSrc={showcaseGridImages.kpi.revenue}
            />
            <MetricWidget
              p={p}
              widgetKey="orders"
              icon={<ShoppingBag className="size-5" />}
              variant="elevated"
              className={span.half}
              imageSrc={showcaseGridImages.kpi.orders}
            />
            <MetricWidget
              p={p}
              widgetKey="users"
              icon={<Users className="size-5" />}
              className={span.half}
              imageSrc={showcaseGridImages.kpi.users}
            />
            <MetricWidget
              p={p}
              widgetKey="conversion"
              icon={<BarChart3 className="size-5" />}
              variant="elevated"
              className={span.half}
              imageSrc={showcaseGridImages.kpi.conversion}
            />
          </GridContainer>
        </DashboardViewport>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("asymmetric.title")}
        description={p("asymmetric.description")}
        layout="stack"
        className="w-full"
        contentClassName="p-0"
      >
        <DashboardViewport height="h-[32rem]">
          <GridContainer aria-label={p("asymmetric.ariaLabel")}>
            <GridCard className={cn(span.third, "row-span-2 min-h-0")}>
              <GridHeader
                Icon={<BarChart3 className="size-5" />}
                title={p("asymmetric.chartTitle")}
                subtitle={p("asymmetric.chartSubtitle")}
                sideElements={
                  <Button size="sm" variant="outlined">
                    {p("asymmetric.export")}
                  </Button>
                }
              />
              <WidgetImage
                src={showcaseGridImages.chart}
                alt={p("asymmetric.chartTitle")}
              />
            </GridCard>
            <GridCard
              variant="elevated"
              className={cn(span.third, "min-h-0")}
            >
              <GridHeader
                Icon={<TrendingUp className="size-5" />}
                title={p("widgets.revenue.title")}
                subtitle={p("widgets.revenue.subtitle")}
              />
              <KpiValue
                label={p("widgets.revenue.metricLabel")}
                value={p("widgets.revenue.metricValue")}
                trend={p("widgets.revenue.trend")}
              />
            </GridCard>
            <GridCard className={cn(span.third, "min-h-0")}>
              <GridHeader
                Icon={<Users className="size-5" />}
                title={p("widgets.users.title")}
                subtitle={p("widgets.users.subtitle")}
              />
              <KpiValue
                label={p("widgets.users.metricLabel")}
                value={p("widgets.users.metricValue")}
                trend={p("widgets.users.trend")}
              />
            </GridCard>
            <GridCard className={cn(span.twoThirds, "min-h-0")}>
              <GridHeader
                Icon={<Activity className="size-5" />}
                title={p("asymmetric.activityTitle")}
                subtitle={p("asymmetric.activitySubtitle")}
              />
              <WidgetImage
                src={showcaseGridImages.campaign}
                alt={p("asymmetric.activityTitle")}
                className="max-h-28"
              />
            </GridCard>
          </GridContainer>
        </DashboardViewport>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("threeColumn.title")}
        description={p("threeColumn.description")}
        layout="stack"
        className="w-full"
        contentClassName="p-0"
      >
        <DashboardViewport>
          <GridContainer aria-label={p("threeColumn.ariaLabel")}>
            {(["watch", "headphones", "camera"] as const).map((key) => (
              <GridCard
                key={key}
                variant="elevated"
                className={cn(span.third, "min-h-0")}
              >
                <GridHeader
                  Icon={<ShoppingBag className="size-5" />}
                  title={p(`products.${key}.title`)}
                  subtitle={p(`products.${key}.subtitle`)}
                />
                <WidgetImage
                  src={showcaseGridImages.product[key]}
                  alt={p(`products.${key}.imageAlt`)}
                />
              </GridCard>
            ))}
            <GridCard className={cn(span.full, "min-h-0")}>
              <GridHeader
                Icon={<LayoutGrid className="size-5" />}
                title={p("threeColumn.summaryTitle")}
                subtitle={p("threeColumn.summarySubtitle")}
                sideElements={
                  <Button size="sm">{p("threeColumn.viewReport")}</Button>
                }
              />
              <WidgetImage
                src={showcaseGridImages.team}
                alt={p("threeColumn.summaryTitle")}
                className="max-h-32"
              />
            </GridCard>
          </GridContainer>
        </DashboardViewport>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("gridGroup.title")}
        description={p("gridGroup.description")}
        layout="stack"
        className="w-full"
        contentClassName="p-0"
      >
        <DashboardViewport>
          <GridContainer aria-label={p("gridGroup.ariaLabel")}>
            <MetricWidget
              p={p}
              widgetKey="revenue"
              icon={<TrendingUp className="size-5" />}
              className={cn(span.half, "min-h-0")}
              imageSrc={showcaseGridImages.kpi.revenue}
            />
            <MetricWidget
              p={p}
              widgetKey="orders"
              icon={<ShoppingBag className="size-5" />}
              variant="elevated"
              className={cn(span.half, "min-h-0")}
              imageSrc={showcaseGridImages.kpi.orders}
            />
            <GridGroup className="grid-cols-12">
              <GridCard className={cn(span.twoThirds, "min-h-0")}>
                <GridHeader
                  Icon={<TrendingUp className="size-5" />}
                  title={p("gridGroup.performanceTitle")}
                  subtitle={p("gridGroup.performanceSubtitle")}
                />
                <WidgetImage
                  src={showcaseGridImages.traffic}
                  alt={p("gridGroup.performanceTitle")}
                />
              </GridCard>
              <GridCard
                variant="elevated"
                className={cn(span.third, "min-h-0")}
              >
                <GridHeader
                  Icon={<BarChart3 className="size-5" />}
                  title={p("gridGroup.goalTitle")}
                  subtitle={p("gridGroup.goalSubtitle")}
                />
                <KpiValue
                  label={p("gridGroup.goalLabel")}
                  value={p("gridGroup.goalValue")}
                  trend={p("gridGroup.goalTrend")}
                />
                <WidgetImage
                  src={showcaseGridImages.chart}
                  alt={p("gridGroup.goalTitle")}
                  className="max-h-20"
                />
              </GridCard>
            </GridGroup>
          </GridContainer>
        </DashboardViewport>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("responsive.title")}
        description={p("responsive.description")}
        layout="stack"
        className="w-full"
      >
        <div className="grid w-full gap-6 lg:grid-cols-2">
          <div className="flex flex-col gap-2">
            <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
              {p("responsive.widePanel")}
            </p>
            <DashboardViewport height="h-80">
              <GridContainer aria-label={p("responsive.wideAriaLabel")}>
                <GridCard className={cn(span.twoThirds, "min-h-0")}>
                  <GridHeader
                    Icon={<BarChart3 className="size-5" />}
                    title={p("responsive.analyticsTitle")}
                    subtitle={p("responsive.analyticsSubtitle")}
                  />
                  <WidgetImage
                    src={showcaseGridImages.analytics}
                    alt={p("responsive.analyticsTitle")}
                  />
                </GridCard>
                <GridCard
                  variant="elevated"
                  className={cn(span.third, "min-h-0")}
                >
                  <GridHeader
                    Icon={<Activity className="size-5" />}
                    title={p("responsive.liveTitle")}
                    subtitle={p("responsive.liveSubtitle")}
                  />
                  <div className="flex flex-col gap-3">
                    <ActivityRow
                      image={showcaseGridImages.avatar.mina}
                      alt={p("responsive.events.first")}
                      title={p("responsive.events.first")}
                      meta={p("responsive.events.firstMeta")}
                    />
                    <ActivityRow
                      image={showcaseGridImages.avatar.reza}
                      alt={p("responsive.events.second")}
                      title={p("responsive.events.second")}
                      meta={p("responsive.events.secondMeta")}
                    />
                  </div>
                </GridCard>
              </GridContainer>
            </DashboardViewport>
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
              {p("responsive.narrowPanel")}
            </p>
            <DashboardViewport height="h-80">
              <GridContainer aria-label={p("responsive.narrowAriaLabel")}>
                <GridCard className={cn(span.half, "min-h-0")}>
                  <GridHeader
                    Icon={<ShoppingBag className="size-5" />}
                    title={p("responsive.storeTitle")}
                    subtitle={p("responsive.storeSubtitle")}
                  />
                  <WidgetImage
                    src={showcaseGridImages.storefront}
                    alt={p("responsive.storeTitle")}
                  />
                </GridCard>
                <GridCard
                  variant="elevated"
                  className={cn(span.half, "min-h-0")}
                >
                  <GridHeader
                    Icon={<Users className="size-5" />}
                    title={p("widgets.users.title")}
                    subtitle={p("widgets.users.subtitle")}
                  />
                  <KpiValue
                    label={p("widgets.users.metricLabel")}
                    value={p("widgets.users.metricValue")}
                    trend={p("widgets.users.trend")}
                  />
                </GridCard>
              </GridContainer>
            </DashboardViewport>
          </div>
        </div>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("fullDashboard.title")}
        description={p("fullDashboard.description")}
        layout="stack"
        className="w-full"
        contentClassName="p-0"
      >
        <DashboardViewport height="h-[32rem]">
          <GridContainer aria-label={p("fullDashboard.ariaLabel")}>
            <GridCard className={cn(span.quarter, "min-h-0")}>
              <GridHeader
                Icon={<TrendingUp className="size-5" />}
                title={p("widgets.revenue.title")}
                subtitle={p("widgets.revenue.subtitle")}
              />
              <KpiValue
                label={p("widgets.revenue.metricLabel")}
                value={p("widgets.revenue.metricValue")}
                trend={p("widgets.revenue.trend")}
              />
            </GridCard>
            <GridCard
              variant="elevated"
              className={cn(span.quarter, "min-h-0")}
            >
              <GridHeader
                Icon={<ShoppingBag className="size-5" />}
                title={p("widgets.orders.title")}
                subtitle={p("widgets.orders.subtitle")}
              />
              <KpiValue
                label={p("widgets.orders.metricLabel")}
                value={p("widgets.orders.metricValue")}
                trend={p("widgets.orders.trend")}
              />
            </GridCard>
            <GridCard className={cn(span.quarter, "min-h-0")}>
              <GridHeader
                Icon={<Users className="size-5" />}
                title={p("widgets.users.title")}
                subtitle={p("widgets.users.subtitle")}
              />
              <KpiValue
                label={p("widgets.users.metricLabel")}
                value={p("widgets.users.metricValue")}
                trend={p("widgets.users.trend")}
              />
            </GridCard>
            <GridCard
              variant="elevated"
              className={cn(span.quarter, "min-h-0")}
            >
              <GridHeader
                Icon={<BarChart3 className="size-5" />}
                title={p("widgets.conversion.title")}
                subtitle={p("widgets.conversion.subtitle")}
              />
              <KpiValue
                label={p("widgets.conversion.metricLabel")}
                value={p("widgets.conversion.metricValue")}
                trend={p("widgets.conversion.trend")}
              />
            </GridCard>
            <GridCard className={cn(span.twoThirds, "min-h-0")}>
              <GridHeader
                Icon={<BarChart3 className="size-5" />}
                title={p("fullDashboard.analyticsTitle")}
                subtitle={p("fullDashboard.analyticsSubtitle")}
                sideElements={
                  <Button size="sm" variant="outlined">
                    {p("fullDashboard.dateRange")}
                  </Button>
                }
              />
              <WidgetImage
                src={showcaseGridImages.analytics}
                alt={p("fullDashboard.analyticsTitle")}
              />
            </GridCard>
            <GridCard
              variant="elevated"
              className={cn(span.third, "min-h-0")}
            >
              <GridHeader
                Icon={<Activity className="size-5" />}
                title={p("fullDashboard.activityTitle")}
                subtitle={p("fullDashboard.activitySubtitle")}
              />
              <div className="flex min-h-0 flex-1 flex-col justify-center gap-3">
                <ActivityRow
                  image={showcaseGridImages.product.watch}
                  alt={p("products.watch.imageAlt")}
                  title={p("fullDashboard.activityItems.first")}
                  meta={p("fullDashboard.activityItems.firstMeta")}
                />
                <ActivityRow
                  image={showcaseGridImages.product.headphones}
                  alt={p("products.headphones.imageAlt")}
                  title={p("fullDashboard.activityItems.second")}
                  meta={p("fullDashboard.activityItems.secondMeta")}
                />
                <ActivityRow
                  image={showcaseGridImages.product.camera}
                  alt={p("products.camera.imageAlt")}
                  title={p("fullDashboard.activityItems.third")}
                  meta={p("fullDashboard.activityItems.thirdMeta")}
                />
              </div>
            </GridCard>
          </GridContainer>
        </DashboardViewport>
      </ShowcaseSection>
    </CatalogPageShell>
  );
}
