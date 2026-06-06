export * from "./echarts-utils";
export * from "./tooltip";
export * from "./infer";

import LineChart from "./line";
import BarChart from "./bar";
import PieChart from "./pie";
import AreaChart from "./area";
import MapChart from "./map";
import GeoMapChart from "./map/geo-map";
import DoughnutChart from "./doughnut";
import TreeMapChart from "./tree-map";

export namespace Chart {
  export const Line = LineChart;
  export const Bar = BarChart;
  export const Pie = PieChart;
  export const Area = AreaChart;
  export const Map = MapChart;
  export const GeoMap = GeoMapChart;
  export const Doughnut = DoughnutChart;
  export const TreeMap = TreeMapChart;
}
