import { useMemo, useState, type ReactNode } from "react";
import {
  Activity,
  ArrowUpRight,
  BarChart3,
  Bell,
  LayoutDashboard,
  Settings2,
  Shield,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";
import { Button } from "@/components/common/buttons";
import TabbedContent from "@/components/common/tabs";
import Segments from "@/components/common/tabs/segment";
import Tabs from "@/components/common/tabs/tab";
import TabScroller from "@/components/common/tabs/scroller/tab-scroller";
import { useShowcasePage } from "@/features/catalog/i18n";
import { CatalogPageShell } from "@/features/catalog/ui/catalog-page-shell";
import { ShowcaseSection } from "@/features/catalog/ui/showcase-section";
import { cn } from "@/lib";

type TabsTranslate = ReturnType<typeof useShowcasePage<"tabs">>;

const TABBED_SHELL_CLASS = {
  container: "h-full min-h-0",
  content: "min-h-0",
} as const;

const SCROLLER_ITEMS = Array.from({ length: 19 }, (_, index) => ({
  name: String(index + 1),
  value: String(index + 1),
}));

const ANALYTICS_BARS = [42, 68, 51, 84, 58, 76, 92, 71, 88, 63, 79, 95];

const SCROLLABLE_ACCENTS = [
  "bg-sky-500/15 text-sky-700 dark:text-sky-300",
  "bg-violet-500/15 text-violet-700 dark:text-violet-300",
  "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
  "bg-amber-500/15 text-amber-700 dark:text-amber-300",
  "bg-rose-500/15 text-rose-700 dark:text-rose-300",
  "bg-cyan-500/15 text-cyan-700 dark:text-cyan-300",
];

function ShowcaseRow({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex min-w-0 flex-col gap-2">
      <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
        {label}
      </p>
      {children}
    </div>
  );
}

function TabbedContentFrame({ children }: { children: ReactNode }) {
  return (
    <div className="border-border bg-background flex h-[28rem] w-full min-h-0 flex-col overflow-hidden rounded-xl border shadow-sm">
      {children}
    </div>
  );
}

function StatCard({
  label,
  value,
  trend,
  icon,
}: {
  label: string;
  value: string;
  trend: string;
  icon: ReactNode;
}) {
  return (
    <div className="border-border bg-muted/25 flex flex-col gap-2 rounded-xl border p-4">
      <div className="flex items-center justify-between gap-2">
        <span className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
          {label}
        </span>
        <span className="text-primary bg-primary/10 flex size-8 items-center justify-center rounded-lg">
          {icon}
        </span>
      </div>
      <span className="text-2xl font-bold tracking-tight">{value}</span>
      <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1 text-xs font-semibold">
        <TrendingUp className="size-3.5" />
        {trend}
      </span>
    </div>
  );
}

function OverviewPanel({ p }: { p: TabsTranslate }) {
  return (
    <div className="flex h-full flex-col gap-4 overflow-auto p-5">
      <div className="grid gap-3 sm:grid-cols-3">
        <StatCard
          label={p("panels.overview.stats.users.label")}
          value={p("panels.overview.stats.users.value")}
          trend={p("panels.overview.stats.users.trend")}
          icon={<Users className="size-4" />}
        />
        <StatCard
          label={p("panels.overview.stats.revenue.label")}
          value={p("panels.overview.stats.revenue.value")}
          trend={p("panels.overview.stats.revenue.trend")}
          icon={<BarChart3 className="size-4" />}
        />
        <StatCard
          label={p("panels.overview.stats.conversion.label")}
          value={p("panels.overview.stats.conversion.value")}
          trend={p("panels.overview.stats.conversion.trend")}
          icon={<Sparkles className="size-4" />}
        />
      </div>

      <div className="grid min-h-0 flex-1 gap-4 lg:grid-cols-5">
        <div className="border-border relative overflow-hidden rounded-xl border lg:col-span-3">
          <img
            src="/banners/workspace.jpg"
            alt={p("panels.overview.bannerAlt")}
            className="h-full min-h-36 w-full object-cover"
            loading="lazy"
          />
          <div className="from-background/10 via-background/40 to-background/90 absolute inset-0 bg-linear-to-t" />
          <div className="absolute inset-x-0 bottom-0 p-4">
            <p className="text-sm font-semibold">{p("panels.overview.bannerTitle")}</p>
            <p className="text-muted-foreground text-xs">
              {p("panels.overview.bannerSubtitle")}
            </p>
          </div>
        </div>

        <div className="border-border bg-muted/20 flex flex-col rounded-xl border p-4 lg:col-span-2">
          <p className="mb-3 text-sm font-semibold">{p("panels.overview.activityTitle")}</p>
          <ul className="flex flex-col gap-3">
            {[0, 1, 2].map((index) => (
              <li
                key={index}
                className="border-border bg-background flex items-start gap-3 rounded-lg border p-3"
              >
                <span className="bg-primary/10 text-primary flex size-8 shrink-0 items-center justify-center rounded-full">
                  <Activity className="size-4" />
                </span>
                <span className="text-sm leading-snug">
                  {p(`panels.overview.activities.${index}` as "panels.overview.activities.0")}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function AnalyticsPanel({ p }: { p: TabsTranslate }) {
  const sources = [
    { key: "direct", percent: 38 },
    { key: "search", percent: 28 },
    { key: "social", percent: 18 },
    { key: "referral", percent: 16 },
  ] as const;

  return (
    <div className="flex h-full flex-col gap-5 overflow-auto p-5">
      <div className="grid gap-3 sm:grid-cols-3">
        <StatCard
          label={p("panels.analytics.metrics.sessions.label")}
          value={p("panels.analytics.metrics.sessions.value")}
          trend={p("panels.analytics.metrics.sessions.trend")}
          icon={<LayoutDashboard className="size-4" />}
        />
        <StatCard
          label={p("panels.analytics.metrics.bounce.label")}
          value={p("panels.analytics.metrics.bounce.value")}
          trend={p("panels.analytics.metrics.bounce.trend")}
          icon={<ArrowUpRight className="size-4" />}
        />
        <StatCard
          label={p("panels.analytics.metrics.duration.label")}
          value={p("panels.analytics.metrics.duration.value")}
          trend={p("panels.analytics.metrics.duration.trend")}
          icon={<TrendingUp className="size-4" />}
        />
      </div>

      <div className="grid min-h-0 flex-1 gap-4 lg:grid-cols-5">
        <div className="border-border bg-muted/20 flex flex-col rounded-xl border p-4 lg:col-span-3">
          <p className="mb-4 text-sm font-semibold">{p("panels.analytics.chartTitle")}</p>
          <div className="flex h-44 items-end gap-2">
            {ANALYTICS_BARS.map((height, index) => (
              <div
                key={index}
                className="bg-primary/75 hover:bg-primary min-h-4 flex-1 rounded-t-md transition-colors"
                style={{ height: `${height}%` }}
              />
            ))}
          </div>
        </div>

        <div className="border-border bg-muted/20 flex flex-col rounded-xl border p-4 lg:col-span-2">
          <p className="mb-4 text-sm font-semibold">{p("panels.analytics.sourcesTitle")}</p>
          <div className="flex flex-col gap-4">
            {sources.map(({ key, percent }) => (
              <div key={key} className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span>{p(`panels.analytics.sources.${key}` as "panels.analytics.sources.direct")}</span>
                  <span className="text-muted-foreground text-xs">{percent}%</span>
                </div>
                <div className="bg-muted h-2 overflow-hidden rounded-full">
                  <div
                    className="bg-primary h-full rounded-full"
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function SettingRow({
  label,
  description,
  enabled,
}: {
  label: string;
  description: string;
  enabled: boolean;
}) {
  return (
    <div className="border-border flex items-center justify-between gap-4 border-b py-4 last:border-b-0">
      <div className="min-w-0">
        <p className="text-sm font-medium">{label}</p>
        <p className="text-muted-foreground text-xs">{description}</p>
      </div>
      <div
        className={cn(
          "relative h-6 w-11 shrink-0 rounded-full transition-colors",
          enabled ? "bg-primary" : "bg-muted",
        )}
      >
        <div
          className={cn(
            "bg-background absolute top-0.5 size-5 rounded-full shadow-sm transition-transform",
            enabled ? "translate-x-5" : "translate-x-0.5",
          )}
        />
      </div>
    </div>
  );
}

function SettingsPanel({ p }: { p: TabsTranslate }) {
  const items = ["notifications", "twoFactor", "analytics"] as const;

  return (
    <div className="flex h-full flex-col overflow-auto p-5">
      <div className="border-border bg-muted/20 rounded-xl border p-5">
        <div className="mb-4 flex items-center gap-3">
          <span className="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-xl">
            <Settings2 className="size-5" />
          </span>
          <div>
            <p className="font-semibold">{p("panels.settings.title")}</p>
            <p className="text-muted-foreground text-sm">{p("panels.settings.subtitle")}</p>
          </div>
        </div>
        {items.map((key, index) => (
          <SettingRow
            key={key}
            label={p(`panels.settings.items.${key}.label` as "panels.settings.items.notifications.label")}
            description={p(`panels.settings.items.${key}.description` as "panels.settings.items.notifications.description")}
            enabled={index !== 1}
          />
        ))}
      </div>

      <div className="mt-4 flex items-start gap-3 rounded-xl border border-amber-500/20 bg-amber-500/10 p-4">
        <Shield className="mt-0.5 size-4 shrink-0 text-amber-600 dark:text-amber-400" />
        <div>
          <p className="text-sm font-medium">{p("panels.settings.tipTitle")}</p>
          <p className="text-muted-foreground text-xs">{p("panels.settings.tipBody")}</p>
        </div>
      </div>
    </div>
  );
}

function ScrollableTabPanel({ p, index }: { p: TabsTranslate; index: number }) {
  const accent = SCROLLABLE_ACCENTS[index % SCROLLABLE_ACCENTS.length];
  const progress = 35 + ((index * 17) % 55);

  return (
    <div className="flex h-full flex-col gap-4 overflow-auto p-5">
      <div className={cn("flex items-center gap-4 rounded-xl p-5", accent)}>
        <span className="text-3xl font-bold tabular-nums">{index + 1}</span>
        <div>
          <p className="font-semibold">{p("panels.scrollable.title", { n: index + 1 })}</p>
          <p className="text-sm opacity-80">{p("panels.scrollable.subtitle", { n: index + 1 })}</p>
        </div>
      </div>

      <div className="border-border bg-muted/20 rounded-xl border p-5">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span>{p("panels.scrollable.metricLabel")}</span>
          <span className="font-semibold">{p("panels.scrollable.metricValue", { percent: progress })}</span>
        </div>
        <div className="bg-muted h-3 overflow-hidden rounded-full">
          <div
            className="bg-primary h-full rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <img
        src={`/grid/widget-${["analytics", "traffic", "campaign", "team-kpi", "storefront"][index % 5]}.jpg`}
        alt={p("panels.scrollable.imageAlt", { n: index + 1 })}
        className="border-border min-h-32 flex-1 rounded-xl border object-cover"
        loading="lazy"
      />
    </div>
  );
}

function PreservedInputPanel({
  label,
  placeholder,
  hint,
}: {
  label: string;
  placeholder: string;
  hint: string;
}) {
  const [value, setValue] = useState("");

  return (
    <div className="flex h-full flex-col gap-4 overflow-auto p-5">
      <div className="border-border bg-muted/20 rounded-xl border p-5">
        <div className="mb-3 flex items-center gap-3">
          <span className="bg-primary/10 text-primary flex size-9 items-center justify-center rounded-lg">
            <Bell className="size-4" />
          </span>
          <p className="text-sm font-medium">{label}</p>
        </div>
        <textarea
          className="border-border bg-background min-h-28 w-full resize-none rounded-lg border px-3 py-2 text-sm"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder={placeholder}
        />
        <p className="text-muted-foreground mt-2 text-xs">{hint}</p>
      </div>
    </div>
  );
}

function SegmentPreview({ p, index }: { p: TabsTranslate; index: number }) {
  const keys = ["daily", "weekly", "monthly"] as const;
  const key = keys[index] ?? "daily";

  return (
    <div className="border-border bg-muted/20 mt-3 rounded-xl border p-5">
      <p className="font-semibold">{p(`panels.segments.${key}.title` as "panels.segments.daily.title")}</p>
      <p className="text-muted-foreground mt-1 text-sm">
        {p(`panels.segments.${key}.description` as "panels.segments.daily.description")}
      </p>
    </div>
  );
}

function StandalonePreview({ p, index }: { p: TabsTranslate; index: number }) {
  const keys = ["overview", "analytics", "settings"] as const;
  const key = keys[index] ?? "overview";

  return (
    <div className="border-border bg-muted/20 rounded-xl border p-5">
      <p className="text-sm">{p(`panels.standalone.${key}` as "panels.standalone.overview")}</p>
    </div>
  );
}

export function TabsPage() {
  const p = useShowcasePage("tabs");
  const [activeIndex, setActiveIndex] = useState(0);
  const [standaloneIndex, setStandaloneIndex] = useState(0);
  const [segmentIndex, setSegmentIndex] = useState(0);
  const [segmentIndexPlain, setSegmentIndexPlain] = useState(0);
  const [scrollerValue, setScrollerValue] = useState("10");

  const richTabs = useMemo(
    () => [
      {
        name: "overview",
        header: p("tabbedContent.overview.header"),
        content: <OverviewPanel p={p} />,
      },
      {
        name: "analytics",
        header: p("tabbedContent.analytics.header"),
        content: <AnalyticsPanel p={p} />,
      },
      {
        name: "settings",
        header: p("tabbedContent.settings.header"),
        content: <SettingsPanel p={p} />,
      },
    ],
    [p],
  );

  const scrollableTabs = useMemo(
    () =>
      Array.from({ length: 12 }, (_, index) => ({
        name: `tab-${index + 1}`,
        header: p("scrollable.tabLabel", { n: index + 1 }),
        content: <ScrollableTabPanel p={p} index={index} />,
      })),
    [p],
  );

  const standaloneTabs = useMemo(
    () => [
      { name: "overview", content: p("shared.overview") },
      { name: "analytics", content: p("shared.analytics") },
      { name: "settings", content: p("shared.settings") },
    ],
    [p],
  );

  const standaloneScrollTabs = useMemo(
    () =>
      Array.from({ length: 10 }, (_, index) => ({
        name: `tab-${index + 1}`,
        content: p("scrollable.tabLabel", { n: index + 1 }),
      })),
    [p],
  );

  const segmentTabs = useMemo(
    () => [
      { header: p("segments.tabs.daily") },
      { header: p("segments.tabs.weekly") },
      { header: p("segments.tabs.monthly") },
    ],
    [p],
  );

  return (
    <CatalogPageShell slug="tabs">
      <ShowcaseSection
        title={p("tabbedContent.title")}
        description={p("tabbedContent.description")}
        layout="stack"
      >
        <TabbedContentFrame>
          <TabbedContent
            className={TABBED_SHELL_CLASS}
            defaultActiveTab={0}
            tabs={richTabs}
          />
        </TabbedContentFrame>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("disabled.title")}
        description={p("disabled.description")}
        layout="stack"
      >
        <TabbedContentFrame>
          <TabbedContent
            className={TABBED_SHELL_CLASS}
            disabled
            defaultActiveTab={1}
            tabs={richTabs}
          />
        </TabbedContentFrame>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("defaultActive.title")}
        description={p("defaultActive.description")}
        layout="stack"
      >
        <TabbedContentFrame>
          <TabbedContent
            className={TABBED_SHELL_CLASS}
            defaultActiveTab={1}
            tabs={richTabs}
          />
        </TabbedContentFrame>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("onChange.title")}
        description={p("onChange.description")}
        layout="stack"
      >
        <TabbedContentFrame>
          <TabbedContent
            className={TABBED_SHELL_CLASS}
            defaultActiveTab={0}
            tabs={richTabs}
            onChange={setActiveIndex}
          />
        </TabbedContentFrame>
        <p className="text-muted-foreground text-sm">
          {p("onChange.activeIndex", { index: activeIndex })}
        </p>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("keepMounted.title")}
        description={p("keepMounted.description")}
        layout="stack"
      >
        <TabbedContentFrame>
          <TabbedContent
            className={TABBED_SHELL_CLASS}
            keepMounted
            defaultActiveTab={0}
            tabs={[
              {
                name: "draft",
                header: p("keepMounted.draft.header"),
                content: (
                  <PreservedInputPanel
                    label={p("keepMounted.draft.content")}
                    placeholder={p("keepMounted.draft.placeholder")}
                    hint={p("keepMounted.draft.hint")}
                  />
                ),
              },
              {
                name: "published",
                header: p("keepMounted.published.header"),
                content: (
                  <PreservedInputPanel
                    label={p("keepMounted.published.content")}
                    placeholder={p("keepMounted.published.placeholder")}
                    hint={p("keepMounted.published.hint")}
                  />
                ),
              },
            ]}
          />
        </TabbedContentFrame>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("scrollable.title")}
        description={p("scrollable.description")}
        layout="stack"
      >
        <TabbedContentFrame>
          <TabbedContent
            className={TABBED_SHELL_CLASS}
            enableScroll
            defaultActiveTab={0}
            tabs={scrollableTabs}
          />
        </TabbedContentFrame>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("sideElements.title")}
        description={p("sideElements.description")}
        layout="stack"
      >
        <TabbedContentFrame>
          <TabbedContent
            className={TABBED_SHELL_CLASS}
            defaultActiveTab={0}
            sideElements={
              <Button size={32} variant="outlined">
                {p("sideElements.globalAction")}
              </Button>
            }
            tabs={[
              {
                name: "overview",
                header: p("shared.overview"),
                content: <OverviewPanel p={p} />,
              },
              {
                name: "analytics",
                header: p("shared.analytics"),
                content: <AnalyticsPanel p={p} />,
                sideElements: (
                  <Button size={32} severity="info">
                    {p("sideElements.tabAction")}
                  </Button>
                ),
              },
              {
                name: "settings",
                header: p("shared.settings"),
                content: <SettingsPanel p={p} />,
              },
            ]}
          />
        </TabbedContentFrame>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("headerElements.title")}
        description={p("headerElements.description")}
        layout="stack"
      >
        <TabbedContentFrame>
          <TabbedContent
            className={TABBED_SHELL_CLASS}
            defaultActiveTab={0}
            headerElements={
              <div className="bg-primary/5 text-primary border-primary/15 flex items-center gap-2 border-b px-4 py-2.5 text-sm font-medium">
                <Sparkles className="size-4" />
                {p("headerElements.banner")}
              </div>
            }
            tabs={richTabs}
          />
        </TabbedContentFrame>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("hideDivider.title")}
        description={p("hideDivider.description")}
        layout="stack"
      >
        <TabbedContentFrame>
          <TabbedContent
            className={TABBED_SHELL_CLASS}
            defaultActiveTab={0}
            tabs={[
              {
                name: "overview",
                header: p("shared.overview"),
                hideDivider: true,
                content: <OverviewPanel p={p} />,
              },
              {
                name: "analytics",
                header: p("shared.analytics"),
                content: <AnalyticsPanel p={p} />,
              },
              {
                name: "settings",
                header: p("shared.settings"),
                content: <SettingsPanel p={p} />,
              },
            ]}
          />
        </TabbedContentFrame>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("customStyles.title")}
        description={p("customStyles.description")}
        layout="stack"
      >
        <TabbedContentFrame>
          <TabbedContent
            className={{
              ...TABBED_SHELL_CLASS,
              container: cn(
                TABBED_SHELL_CLASS.container,
                "rounded-xl border border-violet-200/60 bg-violet-50/30 dark:border-violet-900/40 dark:bg-violet-950/20",
              ),
              tabs: "border-violet-300/60 dark:border-violet-800/60",
              slider: "bg-violet-500 dark:bg-violet-600",
              content: "bg-violet-50/20 dark:bg-violet-950/10",
            }}
            defaultActiveTab={0}
            tabs={richTabs}
          />
        </TabbedContentFrame>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("standalone.title")}
        description={p("standalone.description")}
        layout="stack"
      >
        <ShowcaseRow label={p("standalone.basic")}>
          <Tabs
            tabs={standaloneTabs}
            activeTab={standaloneIndex}
            onTabClick={(_event, index) => setStandaloneIndex(index)}
          />
          <StandalonePreview p={p} index={standaloneIndex} />
          <p className="text-muted-foreground text-sm">
            {p("standalone.activeIndex", { index: standaloneIndex })}
          </p>
        </ShowcaseRow>
        <ShowcaseRow label={p("standalone.disabled")}>
          <Tabs tabs={standaloneTabs} defaultActiveTab={1} disabled />
        </ShowcaseRow>
        <ShowcaseRow label={p("standalone.scrollable")}>
          <Tabs tabs={standaloneScrollTabs} enableScroll defaultActiveTab={0} />
        </ShowcaseRow>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("segments.title")}
        description={p("segments.description")}
        layout="stack"
      >
        <ShowcaseRow label={p("segments.withIndicator")}>
          <Segments onChange={setSegmentIndex} tabs={segmentTabs} />
          <SegmentPreview p={p} index={segmentIndex} />
        </ShowcaseRow>
        <ShowcaseRow label={p("segments.withoutIndicator")}>
          <Segments
            withoutIndicator
            onChange={setSegmentIndexPlain}
            tabs={segmentTabs}
          />
          <SegmentPreview p={p} index={segmentIndexPlain} />
        </ShowcaseRow>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("tabScroller.title")}
        description={p("tabScroller.description")}
        layout="stack"
      >
        <ShowcaseRow label={p("tabScroller.scrollToValue")}>
          <TabScroller
            items={SCROLLER_ITEMS}
            value={scrollerValue}
            onSelect={setScrollerValue}
            scrollTo="value"
          />
        </ShowcaseRow>
        <ShowcaseRow label={p("tabScroller.scrollToCenter")}>
          <TabScroller
            items={SCROLLER_ITEMS.slice(0, 8)}
            value={scrollerValue}
            onSelect={setScrollerValue}
            scrollTo="center"
          />
        </ShowcaseRow>
        <ShowcaseRow label={p("tabScroller.scrollToStart")}>
          <TabScroller
            items={SCROLLER_ITEMS.slice(0, 8)}
            value={scrollerValue}
            onSelect={setScrollerValue}
            scrollTo="start"
          />
        </ShowcaseRow>
        <ShowcaseRow label={p("tabScroller.narrowWindow")}>
          <TabScroller
            items={SCROLLER_ITEMS.slice(0, 12)}
            value={scrollerValue}
            onSelect={setScrollerValue}
            visibleCount={4}
            scrollTo="value"
          />
        </ShowcaseRow>
        <p className="text-muted-foreground text-sm">
          {p("tabScroller.selected", { value: scrollerValue })}
        </p>
      </ShowcaseSection>
    </CatalogPageShell>
  );
}
