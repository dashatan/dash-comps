import { useMemo, type ReactNode } from "react";
import { cn } from "@/lib";
import BarChart from "@/components/common/charts/bar";
import LineChart from "@/components/common/charts/line";
import AreaChart from "@/components/common/charts/area";
import PieChart from "@/components/common/charts/pie";
import DoughnutChart from "@/components/common/charts/doughnut";
import TreeMapChart from "@/components/common/charts/tree-map";
import MapChart from "@/components/common/charts/map";
import {
  showcaseActiveUsers,
  showcaseBudgetAllocation,
  showcaseCampaignRose,
  showcaseCategoryShare,
  showcaseChannelSeries,
  showcaseDayLabels,
  showcaseEcommerceOrders,
  showcaseEnergyMix,
  showcaseFunnelSteps,
  showcaseGeoPaths,
  showcaseHospitalAdmissions,
  showcaseLongCategoryLabels,
  showcaseLongCategoryValues,
  showcaseMarketShare,
  showcaseMonthKeys,
  showcasePaymentMethods,
  showcasePieDrillDown,
  showcaseProductSales,
  showcaseProfitLoss,
  showcaseProjectStatus,
  showcaseProvinceSales,
  showcaseQuarterKeys,
  showcaseRevenueSeries,
  showcaseSaasMrr,
  showcaseServerLatency,
  showcaseTaskCompletion,
  showcaseTrafficSources,
  showcaseUsStateTechJobs,
  showcaseWebsiteSections,
  showcaseWeekLabels,
  showcaseWorldGdp,
} from "@/features/catalog/data/chart-samples";
import { CatalogPageShell } from "@/features/catalog/ui/catalog-page-shell";
import { ShowcaseSection } from "@/features/catalog/ui/showcase-section";
import { ShowcaseGeoMap } from "@/features/catalog/ui/showcase-geo-map";
import { useShowcasePage } from "@/features/catalog/i18n";

function ChartStack({ children }: { children: ReactNode }) {
  return <div className="flex w-full min-w-0 flex-col gap-8">{children}</div>;
}

function ChartFrame({
  label,
  description,
  heightClass = "h-64",
  widthClass = "w-full",
  children,
}: {
  label: string;
  description?: string;
  heightClass?: string;
  widthClass?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("flex min-w-0 flex-col gap-2", widthClass)}>
      <div>
        <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          {label}
        </p>
        {description ? (
          <p className="mt-0.5 text-xs text-muted-foreground/80">
            {description}
          </p>
        ) : null}
      </div>
      <div className={cn("w-full min-w-[240px]", heightClass)}>{children}</div>
    </div>
  );
}

function ChartGrid({
  columns = 2,
  children,
}: {
  columns?: 1 | 2 | 3;
  children: ReactNode;
}) {
  const gridClass =
    columns === 1
      ? "grid-cols-1"
      : columns === 3
        ? "grid-cols-1 @xl:grid-cols-3"
        : "grid-cols-1 @lg:grid-cols-2";

  return (
    <div className={cn("grid w-full min-w-0 gap-8", gridClass)}>{children}</div>
  );
}

export function ChartsPage() {
  const p = useShowcasePage("charts");

  const months = useMemo(
    () => showcaseMonthKeys.map((key) => p(`shared.months.${key}`)),
    [p],
  );

  const quarters = useMemo(
    () => showcaseQuarterKeys.map((key) => p(`shared.quarters.${key}`)),
    [p],
  );

  const halfYearMonths = months.slice(0, 6);

  return (
    <CatalogPageShell slug="charts">
      <ShowcaseSection
        title={p("useCases.title")}
        description={p("useCases.description")}
        layout="stack"
        className="w-full"
      >
        <ChartGrid columns={1}>
          <ChartFrame
            label={p("useCases.frames.saas")}
            description={p("useCases.descriptions.saas")}
            heightClass="h-80"
          >
            <BarChart
              title={p("useCases.titles.saasMrr")}
              xAxis={months}
              series={[
                { name: p("useCases.series.mrr"), data: showcaseSaasMrr.mrr },
                {
                  name: p("useCases.series.newLogos"),
                  data: showcaseSaasMrr.newLogos,
                },
                {
                  name: p("useCases.series.churn"),
                  data: showcaseSaasMrr.churn,
                },
              ]}
              barWidth="42%"
              borderRadius={6}
            />
          </ChartFrame>

          <ChartGrid columns={2}>
            <ChartFrame
              label={p("useCases.frames.ecommerce")}
              description={p("useCases.descriptions.ecommerce")}
              heightClass="h-72"
            >
              <AreaChart
                title={p("useCases.titles.ecommerce")}
                xAxis={[...showcaseWeekLabels]}
                series={[
                  {
                    name: p("useCases.series.electronics"),
                    data: showcaseEcommerceOrders.electronics,
                    stack: "orders",
                  },
                  {
                    name: p("useCases.series.fashion"),
                    data: showcaseEcommerceOrders.fashion,
                    stack: "orders",
                  },
                  {
                    name: p("useCases.series.home"),
                    data: showcaseEcommerceOrders.home,
                    stack: "orders",
                  },
                ]}
              />
            </ChartFrame>
            <ChartFrame
              label={p("useCases.frames.payments")}
              heightClass="h-72"
              widthClass="max-w-md @lg:max-w-none"
            >
              <PieChart
                data={[...showcasePaymentMethods]}
                donut
                radius={["45%", "72%"]}
                labelPosition="outside"
                showLegend={false}
              />
            </ChartFrame>
          </ChartGrid>

          <ChartGrid columns={2}>
            <ChartFrame
              label={p("useCases.frames.healthcare")}
              description={p("useCases.descriptions.healthcare")}
              heightClass="h-64"
            >
              <LineChart
                title={p("useCases.titles.admissions")}
                xAxis={[...showcaseWeekLabels]}
                series={[
                  {
                    name: p("useCases.series.emergency"),
                    data: showcaseHospitalAdmissions.emergency,
                  },
                  {
                    name: p("useCases.series.surgery"),
                    data: showcaseHospitalAdmissions.surgery,
                  },
                  {
                    name: p("useCases.series.pediatrics"),
                    data: showcaseHospitalAdmissions.pediatrics,
                  },
                ]}
                type="smooth"
                colors={["#ef4444", "#3b82f6", "#22c55e"]}
              />
            </ChartFrame>
            <ChartFrame label={p("useCases.frames.ops")} heightClass="h-64">
              <LineChart
                title={p("useCases.titles.latency")}
                xAxis={showcaseServerLatency.labels.slice(0, 12)}
                series={[
                  {
                    name: p("useCases.series.api"),
                    data: showcaseServerLatency.api.slice(0, 12),
                  },
                  {
                    name: p("useCases.series.database"),
                    data: showcaseServerLatency.db.slice(0, 12),
                  },
                ]}
                showArea={false}
                animation={false}
              />
            </ChartFrame>
          </ChartGrid>
        </ChartGrid>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("layouts.title")}
        description={p("layouts.description")}
        layout="stack"
        className="w-full"
      >
        <ChartStack>
          <ChartFrame
            label={p("layouts.frames.fullBleed")}
            heightClass="h-[22rem]"
          >
            <LineChart
              title={p("layouts.titles.annualRevenue")}
              xAxis={months}
              series={[
                {
                  name: p("bar.series.revenue"),
                  data: showcaseRevenueSeries.revenue,
                },
                {
                  name: p("bar.series.expenses"),
                  data: showcaseRevenueSeries.expenses,
                },
              ]}
              type="smooth"
            />
          </ChartFrame>

          <div className="flex w-full min-w-0 flex-col gap-8 @lg:flex-row">
            <ChartFrame
              label={p("layouts.frames.compact")}
              widthClass="w-full @lg:w-64"
              heightClass="h-48"
            >
              <DoughnutChart
                data={[
                  { name: p("doughnut.done"), value: 72 },
                  { name: p("doughnut.pending"), value: 28 },
                ]}
                radius={["50%", "88%"]}
                showTooltip
                showLabelFromPercent={8}
              />
            </ChartFrame>
            <ChartFrame
              label={p("layouts.frames.halfColumn")}
              widthClass="w-full @lg:flex-1"
              heightClass="h-48"
            >
              <BarChart
                xAxis={quarters}
                series={[
                  {
                    name: p("bar.series.revenue"),
                    data: showcaseRevenueSeries.revenue.slice(0, 4),
                  },
                ]}
                barWidth="35%"
                showLegend={false}
                borderRadius={8}
              />
            </ChartFrame>
          </div>

          <ChartFrame label={p("layouts.frames.tall")} heightClass="h-[28rem]">
            <AreaChart
              title={p("area.chartTitles.energy")}
              xAxis={months}
              series={[
                {
                  name: p("area.series.solar"),
                  data: showcaseEnergyMix.solar,
                  stack: "mix",
                  smooth: true,
                },
                {
                  name: p("area.series.wind"),
                  data: showcaseEnergyMix.wind,
                  stack: "mix",
                  smooth: true,
                },
                {
                  name: p("area.series.hydro"),
                  data: showcaseEnergyMix.hydro,
                  stack: "mix",
                  smooth: true,
                },
                {
                  name: p("area.series.gas"),
                  data: showcaseEnergyMix.gas,
                  stack: "mix",
                  smooth: true,
                },
              ]}
            />
          </ChartFrame>
        </ChartStack>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("bar.title")}
        description={p("bar.description")}
        layout="stack"
        className="w-full"
      >
        <ChartGrid columns={3}>
          <ChartFrame label={p("bar.frames.vertical")} heightClass="h-72">
            <BarChart
              title={p("bar.chartTitles.revenue")}
              xAxis={months}
              series={[
                {
                  name: p("bar.series.revenue"),
                  data: showcaseRevenueSeries.revenue,
                },
                {
                  name: p("bar.series.expenses"),
                  data: showcaseRevenueSeries.expenses,
                },
              ]}
            />
          </ChartFrame>
          <ChartFrame label={p("bar.frames.narrowBars")} heightClass="h-72">
            <BarChart
              xAxis={halfYearMonths}
              series={[
                {
                  name: p("bar.series.revenue"),
                  data: showcaseRevenueSeries.revenue.slice(0, 6),
                },
              ]}
              barWidth="28%"
              barCategoryGap="40%"
              showLegend={false}
            />
          </ChartFrame>
          <ChartFrame label={p("bar.frames.wideBars")} heightClass="h-72">
            <BarChart
              xAxis={halfYearMonths}
              series={[
                {
                  name: p("bar.series.profit"),
                  data: showcaseRevenueSeries.profit.slice(0, 6),
                },
              ]}
              barWidth="78%"
              showLegend={false}
              borderRadius={10}
            />
          </ChartFrame>
          <ChartFrame label={p("bar.frames.horizontal")} heightClass="h-80">
            <BarChart
              title={p("bar.chartTitles.products")}
              xAxis={[...showcaseProductSales.labels]}
              series={[
                {
                  name: p("bar.series.unitsSold"),
                  data: showcaseProductSales.units,
                },
              ]}
              horizontal
            />
          </ChartFrame>
          <ChartFrame label={p("bar.frames.stacked")} heightClass="h-80">
            <BarChart
              title={p("bar.chartTitles.channels")}
              xAxis={halfYearMonths}
              series={[
                {
                  name: p("bar.series.organic"),
                  data: showcaseChannelSeries.organic,
                  stack: "leads",
                },
                {
                  name: p("bar.series.paid"),
                  data: showcaseChannelSeries.paid,
                  stack: "leads",
                },
                {
                  name: p("bar.series.referral"),
                  data: showcaseChannelSeries.referral,
                  stack: "leads",
                },
                {
                  name: p("bar.series.email"),
                  data: showcaseChannelSeries.email,
                  stack: "leads",
                },
              ]}
            />
          </ChartFrame>
          <ChartFrame label={p("bar.frames.withBackground")} heightClass="h-80">
            <BarChart
              xAxis={quarters}
              series={[
                {
                  name: p("bar.series.revenue"),
                  data: showcaseRevenueSeries.revenue.slice(0, 4),
                  showBackground: true,
                  backgroundStyle: { borderRadius: 6 },
                },
              ]}
              showLegend={false}
              barWidth="50%"
            />
          </ChartFrame>
          <ChartFrame label={p("bar.frames.rotatedLabels")} heightClass="h-80">
            <BarChart
              title={p("bar.chartTitles.plans")}
              xAxis={[...showcaseLongCategoryLabels]}
              series={[
                {
                  name: p("bar.series.unitsSold"),
                  data: [...showcaseLongCategoryValues],
                },
              ]}
              rotateLabels
              rotateLabelsAngle={35}
              labelFontSize={9}
              showLegend={false}
              barWidth="55%"
            />
          </ChartFrame>
          <ChartFrame label={p("bar.frames.negative")} heightClass="h-80">
            <BarChart
              title={p("bar.chartTitles.profitLoss")}
              xAxis={[...showcaseProfitLoss.labels]}
              series={[
                {
                  name: p("bar.series.netProfit"),
                  data: showcaseProfitLoss.values,
                  label: { show: true, position: "insideTop", fontSize: 10 },
                },
              ]}
              showLegend={false}
            />
          </ChartFrame>
          <ChartFrame label={p("bar.frames.customTooltip")} heightClass="h-80">
            <BarChart
              xAxis={halfYearMonths.slice(0, 4)}
              series={[
                {
                  name: p("bar.series.revenue"),
                  data: showcaseRevenueSeries.revenue.slice(0, 4),
                },
              ]}
              showLegend={false}
              tooltipTitle={(_, ctx) =>
                ctx.points?.[0]?.seriesName ?? p("bar.series.revenue")
              }
              tooltipItems={(_, ctx) =>
                (ctx.points ?? []).map((point) => ({
                  name: point.seriesName,
                  value:
                    typeof point.value === "number"
                      ? point.value
                      : String(point.value ?? ""),
                  withColorDot: true,
                  icon: "chart",
                }))
              }
            />
          </ChartFrame>
        </ChartGrid>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("line.title")}
        description={p("line.description")}
        layout="stack"
        className="w-full"
      >
        <ChartGrid columns={2}>
          <ChartFrame label={p("line.frames.smooth")} heightClass="h-72">
            <LineChart
              title={p("line.chartTitles.activeUsers")}
              xAxis={showcaseDayLabels}
              series={[
                {
                  name: p("line.series.mobile"),
                  data: showcaseActiveUsers.mobile,
                },
                {
                  name: p("line.series.desktop"),
                  data: showcaseActiveUsers.desktop,
                },
                {
                  name: p("line.series.tablet"),
                  data: showcaseActiveUsers.tablet,
                },
              ]}
              type="smooth"
            />
          </ChartFrame>
          <ChartFrame label={p("line.frames.step")} heightClass="h-72">
            <LineChart
              title={p("line.chartTitles.funnel")}
              xAxis={showcaseDayLabels.slice(0, 8)}
              series={[
                {
                  name: p("line.series.visits"),
                  data: showcaseFunnelSteps.visits,
                },
                {
                  name: p("line.series.signups"),
                  data: showcaseFunnelSteps.signups,
                },
                {
                  name: p("line.series.trials"),
                  data: showcaseFunnelSteps.trials,
                },
              ]}
              type="step"
              showArea={false}
            />
          </ChartFrame>
          <ChartFrame label={p("line.frames.noArea")} heightClass="h-64">
            <LineChart
              xAxis={months.slice(0, 8)}
              series={[
                {
                  name: p("line.series.revenue"),
                  data: showcaseRevenueSeries.revenue.slice(0, 8),
                },
              ]}
              showArea={false}
              showLegend={false}
            />
          </ChartFrame>
          <ChartFrame label={p("line.frames.multiColor")} heightClass="h-64">
            <LineChart
              xAxis={quarters}
              series={[
                {
                  name: p("bar.series.revenue"),
                  data: showcaseRevenueSeries.revenue.slice(0, 4),
                },
                {
                  name: p("bar.series.expenses"),
                  data: showcaseRevenueSeries.expenses.slice(0, 4),
                },
                {
                  name: p("bar.series.profit"),
                  data: showcaseRevenueSeries.profit.slice(0, 4),
                },
              ]}
              colors={["#6366f1", "#f97316", "#10b981"]}
              showArea={false}
            />
          </ChartFrame>
        </ChartGrid>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("area.title")}
        description={p("area.description")}
        layout="stack"
        className="w-full"
      >
        <ChartGrid columns={2}>
          <ChartFrame label={p("area.frames.stacked")} heightClass="h-72">
            <AreaChart
              title={p("area.chartTitles.traffic")}
              xAxis={[...showcaseWeekLabels]}
              series={[
                {
                  name: p("area.series.direct"),
                  data: showcaseTrafficSources.direct,
                  stack: "total",
                },
                {
                  name: p("area.series.search"),
                  data: showcaseTrafficSources.search,
                  stack: "total",
                },
                {
                  name: p("area.series.social"),
                  data: showcaseTrafficSources.social,
                  stack: "total",
                },
                {
                  name: p("area.series.email"),
                  data: showcaseTrafficSources.email,
                  stack: "total",
                },
                {
                  name: p("area.series.paid"),
                  data: showcaseTrafficSources.paid,
                  stack: "total",
                },
              ]}
            />
          </ChartFrame>
          <ChartFrame label={p("area.frames.smooth")} heightClass="h-72">
            <AreaChart
              title={p("area.chartTitles.growth")}
              xAxis={halfYearMonths}
              series={[
                {
                  name: p("area.series.revenue"),
                  data: showcaseRevenueSeries.revenue.slice(0, 6),
                  smooth: true,
                  areaStyle: { opacity: 0.45 },
                },
              ]}
              showLegend={false}
            />
          </ChartFrame>
        </ChartGrid>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("pie.title")}
        description={p("pie.description")}
        layout="stack"
        className="w-full"
      >
        <ChartGrid columns={3}>
          <ChartFrame label={p("pie.frames.basic")} heightClass="h-80">
            <PieChart
              title={p("pie.chartTitles.categories")}
              data={[...showcaseCategoryShare]}
              labelPosition="outside"
            />
          </ChartFrame>
          <ChartFrame label={p("pie.frames.donutDrillDown")} heightClass="h-80">
            <PieChart
              title={p("pie.chartTitles.technology")}
              data={showcasePieDrillDown}
              donut
              radius={["38%", "68%"]}
              labelPosition="outside"
            />
          </ChartFrame>
          <ChartFrame label={p("pie.frames.rose")} heightClass="h-80">
            <PieChart
              title={p("pie.chartTitles.campaigns")}
              data={[...showcaseCampaignRose]}
              roseType="radius"
              labelPosition="outside"
            />
          </ChartFrame>
          <ChartFrame label={p("pie.frames.insideLabels")} heightClass="h-72">
            <PieChart
              data={[...showcaseCategoryShare.slice(0, 5)]}
              labelPosition="inside"
              showLegend={false}
              minAngle={8}
            />
          </ChartFrame>
          <ChartFrame label={p("pie.frames.thinDonut")} heightClass="h-72">
            <PieChart
              data={[...showcasePaymentMethods.slice(0, 4)]}
              donut
              radius={["62%", "78%"]}
              centerText={false}
              showLegend
            />
          </ChartFrame>
          <ChartFrame label={p("pie.frames.noRadius")} heightClass="h-72">
            <PieChart
              data={[...showcaseCategoryShare.slice(0, 4)]}
              showRadius={false}
              labelPosition="outside"
              showLegend={false}
            />
          </ChartFrame>
        </ChartGrid>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("doughnut.title")}
        description={p("doughnut.description")}
        layout="stack"
        className="w-full"
      >
        <ChartGrid columns={3}>
          <ChartFrame
            label={p("doughnut.frames.completion")}
            heightClass="h-72"
            widthClass="max-w-sm"
          >
            <DoughnutChart
              title={p("doughnut.chartTitles.tasks")}
              data={[...showcaseTaskCompletion]}
              showTooltip
              radius={["52%", "88%"]}
            />
          </ChartFrame>
          <ChartFrame
            label={p("doughnut.frames.withLegend")}
            heightClass="h-72"
          >
            <DoughnutChart
              title={p("doughnut.chartTitles.projects")}
              data={[...showcaseProjectStatus]}
              showLegend
              showTooltip
              radius={["48%", "82%"]}
            />
          </ChartFrame>
          <ChartFrame label={p("doughnut.frames.budget")} heightClass="h-72">
            <DoughnutChart
              title={p("doughnut.chartTitles.budget")}
              data={[...showcaseBudgetAllocation]}
              showLegend
              showTooltip
              borderRadius={6}
              borderWidth={4}
            />
          </ChartFrame>
          <ChartFrame
            label={p("doughnut.frames.percentLabels")}
            heightClass="h-72"
            widthClass="max-w-sm"
          >
            <DoughnutChart
              data={[
                { name: p("doughnut.done"), value: 847 },
                { name: p("doughnut.pending"), value: 453 },
              ]}
              showTooltip
              showLabelFromPercent={5}
              radius={["58%", "92%"]}
            />
          </ChartFrame>
          <ChartFrame label={p("doughnut.frames.rose")} heightClass="h-72">
            <DoughnutChart
              data={[...showcaseCampaignRose.slice(0, 6)]}
              roseType="area"
              showTooltip
              radius={["20%", "78%"]}
            />
          </ChartFrame>
          <ChartFrame
            label={p("doughnut.frames.thickRing")}
            heightClass="h-72"
            widthClass="max-w-xs"
          >
            <DoughnutChart
              data={[
                { name: p("doughnut.done"), value: 92 },
                { name: p("doughnut.pending"), value: 8 },
              ]}
              radius={["70%", "94%"]}
              showTooltip
              showLabelFromPercent={3}
              borderRadius={12}
            />
          </ChartFrame>
        </ChartGrid>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("treeMap.title")}
        description={p("treeMap.description")}
        layout="stack"
        className="w-full"
      >
        <ChartGrid columns={1}>
          <ChartFrame
            label={p("treeMap.frames.marketShare")}
            heightClass="h-[26rem]"
          >
            <TreeMapChart
              title={p("treeMap.chartTitles.marketShare")}
              data={showcaseMarketShare}
            />
          </ChartFrame>
          <ChartFrame
            label={p("treeMap.frames.websiteTraffic")}
            heightClass="h-80"
          >
            <TreeMapChart
              title={p("treeMap.chartTitles.websiteTraffic")}
              data={showcaseWebsiteSections}
              breadcrumb
              roam
              nodeClick={false}
            />
          </ChartFrame>
        </ChartGrid>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("map.title")}
        description={p("map.description")}
        layout="stack"
        className="w-full"
      >
        <ChartGrid columns={2}>
          <ChartFrame
            label={p("map.frames.iranSales")}
            description={p("map.descriptions.iran")}
            heightClass="h-[26rem]"
          >
            <MapChart
              data={showcaseProvinceSales}
              rangeText={[p("map.rangeLow"), p("map.rangeHigh")]}
              aspectScale={0.9}
            />
          </ChartFrame>
          <ChartFrame
            label={p("map.frames.iranLabels")}
            description={p("map.descriptions.iranLabels")}
            heightClass="h-[26rem]"
          >
            <MapChart
              data={showcaseProvinceSales}
              showLabel
              roam={false}
              tooltipTitle={(data) =>
                data?.name ? String(data.name) : undefined
              }
              tooltipItems={(data) => [
                {
                  icon: "map-pin",
                  name: p("map.tooltip.province"),
                  value: String(data.name),
                },
                {
                  icon: "chart",
                  name: p("map.tooltip.sales"),
                  value: data.value.toLocaleString(),
                  withColorDot: true,
                },
              ]}
            />
          </ChartFrame>
          <ChartFrame
            label={p("map.frames.usTechJobs")}
            description={p("map.descriptions.us")}
            heightClass="h-[24rem]"
          >
            <ShowcaseGeoMap
              geoPath={showcaseGeoPaths.usa}
              mapId="showcase-usa"
              data={showcaseUsStateTechJobs}
              rangeText={[p("map.rangeLow"), p("map.rangeHigh")]}
              aspectScale={0.75}
            />
          </ChartFrame>
          <ChartFrame
            label={p("map.frames.worldGdp")}
            description={p("map.descriptions.world")}
            heightClass="h-[24rem]"
          >
            <ShowcaseGeoMap
              geoPath={showcaseGeoPaths.world}
              mapId="showcase-world"
              data={showcaseWorldGdp}
              rangeText={[p("map.rangeLow"), p("map.rangeHigh")]}
              aspectScale={0.65}
              roam
              tooltipItems={(data) => [
                {
                  icon: "map-pin",
                  name: p("map.tooltip.country"),
                  value: data.name,
                },
                {
                  icon: "chart",
                  name: p("map.tooltip.gdp"),
                  value: `$${data.value.toLocaleString()}B`,
                  withColorDot: true,
                },
              ]}
            />
          </ChartFrame>
          <ChartFrame
            label={p("map.frames.compactWorld")}
            widthClass="w-full @lg:max-w-md"
            heightClass="h-56"
          >
            <ShowcaseGeoMap
              geoPath={showcaseGeoPaths.world}
              mapId="showcase-world-compact"
              data={showcaseWorldGdp.slice(0, 12)}
              roam={false}
              aspectScale={0.55}
            />
          </ChartFrame>
          <ChartFrame
            label={p("map.frames.sidebarUs")}
            widthClass="w-full @lg:w-80"
            heightClass="h-56"
          >
            <ShowcaseGeoMap
              geoPath={showcaseGeoPaths.usa}
              mapId="showcase-usa-sidebar"
              data={showcaseUsStateTechJobs.slice(0, 10)}
              roam={false}
              showLabel
              aspectScale={0.85}
            />
          </ChartFrame>
        </ChartGrid>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("states.title")}
        description={p("states.description")}
        layout="stack"
        className="w-full"
      >
        <ChartGrid columns={3}>
          <ChartFrame label={p("states.frames.loading")} heightClass="h-56">
            <BarChart
              xAxis={halfYearMonths.slice(0, 4)}
              series={[
                {
                  name: p("bar.series.revenue"),
                  data: showcaseRevenueSeries.revenue.slice(0, 4),
                },
              ]}
              loading
              showLegend={false}
            />
          </ChartFrame>
          <ChartFrame label={p("states.frames.noLegend")} heightClass="h-56">
            <LineChart
              xAxis={halfYearMonths.slice(0, 4)}
              series={[
                {
                  name: p("line.series.revenue"),
                  data: showcaseRevenueSeries.revenue.slice(0, 4),
                },
              ]}
              showLegend={false}
              showArea={false}
            />
          </ChartFrame>
          <ChartFrame label={p("states.frames.noTooltip")} heightClass="h-56">
            <DoughnutChart
              data={[...showcaseTaskCompletion.slice(0, 3)]}
              showTooltip={false}
              radius={["50%", "85%"]}
            />
          </ChartFrame>
        </ChartGrid>
      </ShowcaseSection>
    </CatalogPageShell>
  );
}
