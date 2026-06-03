# Chart Components

This directory contains reusable chart components built on top of ECharts.

## Pie Chart with Drill-down

The `PieChart` component supports hierarchical data visualization with interactive drill-down functionality.

### Basic Usage

```tsx
import { PieChart } from '@/components/common/charts/pie'

// Sample hierarchical data
const data = [
  {
    name: 'Browsers',
    value: 1048,
    children: [
      { name: 'Chrome', value: 580 },
      { name: 'Edge', value: 200 },
      { name: 'Firefox', value: 150 },
      { name: 'Safari', value: 118 },
    ],
  },
  {
    name: 'Operating Systems',
    value: 735,
    children: [
      { name: 'Windows', value: 380 },
      { name: 'MacOS', value: 190 },
      { name: 'Linux', value: 165 },
    ],
  },
  { name: 'Others', value: 580 },
]

const MyComponent = () => {
  return (
    <div style={{ height: '400px', width: '100%' }}>
      <PieChart data={data} title='Technology Usage' labelPosition='outside' donut={true} radius={['40%', '70%']} />
    </div>
  )
}
```

### Features

- **Interactive Drill-down**: Click on a slice to see its children data as a new pie chart
- **Breadcrumb Navigation**: Click on the chart background to navigate back up
- **Animation**: Smooth transitions between different data levels
- **Customizable**: Various styling options including donut mode, label positions, and more

### Properties

| Property        | Type                              | Default         | Description                                               |
| --------------- | --------------------------------- | --------------- | --------------------------------------------------------- |
| `data`          | `DataItem[]`                      | Required        | Array of data items with optional children for drill-down |
| `title`         | `string`                          | `undefined`     | Chart title                                               |
| `showLegend`    | `boolean`                         | `true`          | Whether to display the legend                             |
| `showTooltip`   | `boolean`                         | `true`          | Whether to show tooltips on hover                         |
| `donut`         | `boolean`                         | `false`         | Whether to display as a donut chart                       |
| `radius`        | `[string, string]`                | `['0%', '70%']` | Inner and outer radius of the pie                         |
| `roseType`      | `'radius' \| 'area' \| undefined` | `undefined`     | Whether to display as a rose chart                        |
| `labelFontSize` | `number`                          | `8`             | Font size for labels                                      |
| `labelPosition` | `'inside' \| 'outside'`           | `'outside'`     | Position of the labels                                    |
