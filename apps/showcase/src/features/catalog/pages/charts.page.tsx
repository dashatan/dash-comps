import BarChart from "@/components/common/charts/bar";
import PieChart from "@/components/common/charts/pie";
import DoughnutChart from "@/components/common/charts/doughnut";
import { CatalogPageShell } from "@/features/catalog/ui/catalog-page-shell";
import { ShowcaseSection } from "@/features/catalog/ui/showcase-section";

const labels = ["Jan", "Feb", "Mar", "Apr"];
const seriesA = [12, 20, 15, 28];
const seriesB = [8, 14, 22, 18];

export function ChartsPage() {
  return (
    <CatalogPageShell slug="charts">
      <ShowcaseSection title="Bar" className="w-full">
        <div className="h-64 w-full min-w-[280px]">
          <BarChart
            series={[
              { name: "A", data: seriesA },
              { name: "B", data: seriesB },
            ]}
            xAxisData={labels}
          />
        </div>
      </ShowcaseSection>
      <ShowcaseSection title="Pie" delay={0.05}>
        <div className="h-56 w-72">
          <PieChart
            data={[
              { name: "A", value: 40 },
              { name: "B", value: 25 },
              { name: "C", value: 35 },
            ]}
          />
        </div>
      </ShowcaseSection>
      <ShowcaseSection title="Doughnut" delay={0.1}>
        <div className="h-56 w-72">
          <DoughnutChart
            data={[
              { name: "Done", value: 70 },
              { name: "Pending", value: 30 },
            ]}
          />
        </div>
      </ShowcaseSection>
    </CatalogPageShell>
  );
}
