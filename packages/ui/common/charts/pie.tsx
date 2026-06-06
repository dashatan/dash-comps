import { EChartsOption } from 'echarts'
import type { DefaultLabelFormatterCallbackParams, ECharts } from 'echarts'
import { BaseChart, ChartProps } from './base'
import { useState, useEffect, useCallback, useMemo } from 'react'
import { getTheme } from './helpers'
import { cn } from '@/lib'
import { InferChartPayloadFromData } from '@/components/common/charts/infer'

export interface PieDataItem {
  name: string
  value: number
  children?: PieDataItem[]
}

export type PieChartProps<D extends readonly PieDataItem[] = readonly PieDataItem[]> = Omit<
  ChartProps<InferChartPayloadFromData<D>>,
  'options'
> & {
  data: D
  title?: string
  showLegend?: boolean
  showTooltip?: boolean
  showLabel?: boolean
  showRadius?: boolean
  centerText?: boolean
  donut?: boolean
  minAngle?: number
  radius?: [string, string]
  roseType?: 'radius' | 'area' | undefined
  labelFontSize?: number
  labelPosition?: 'inside' | 'outside'
  options?: EChartsOption
}

type PieClickParams = Pick<DefaultLabelFormatterCallbackParams, 'dataIndex' | 'data'>

function isPieDataItem(data: DefaultLabelFormatterCallbackParams['data']): data is PieDataItem {
  return data != null && typeof data === 'object' && 'name' in data && 'value' in data
}

function PieChartInner<const D extends readonly PieDataItem[]>({
  data,
  title,
  showLegend = true,
  showTooltip = true,
  showLabel = true,
  showRadius = true,
  donut = false,
  minAngle = 6,
  radius = ['40%', '70%'],
  roseType,
  labelFontSize = 8,
  labelPosition = 'outside',
  centerText = true,
  options,
  onChartReady,
  ...props
}: PieChartProps<D>) {
  const theme = getTheme()
  const [chartInstance, setChartInstance] = useState<ECharts | null>(null)
  const [activeData, setActiveData] = useState<PieDataItem[]>([...data])
  const [parentData, setParentData] = useState<PieDataItem[][]>([])

  useEffect(() => {
    setActiveData([...data])
  }, [data])

  const [centerLabel, setCenterLabel] = useState<{ name: string; value: number } | null>(null)

  const handleDrillDown = useCallback(
    (params: { dataIndex: number }) => {
      setCenterLabel(null)
      const { dataIndex } = params
      const selectedItem = activeData[dataIndex]
      if (selectedItem?.children?.length) {
        setParentData((prev) => [...prev, activeData])
        const newData = selectedItem.children
        setActiveData(newData)
      }
    },
    [activeData],
  )

  const handleDrillUp = useCallback(() => {
    if (parentData.length > 0) {
      setCenterLabel(null)
      const lastParent = parentData[parentData.length - 1]
      setActiveData(lastParent)
      setParentData((prev) => prev.slice(0, -1))
    }
  }, [parentData])

  const handleMouseOver = useCallback(
    (params: DefaultLabelFormatterCallbackParams) => {
      if (!centerText) return
      const data = isPieDataItem(params.data) ? params.data : null
      if (!data) return
      setCenterLabel({ name: data.name, value: data.value })
    },
    [centerText],
  )

  const handleMouseOut = useCallback(() => {
    setCenterLabel(null)
  }, [])

  const handleChartReady = useCallback(
    (instance: ECharts) => {
      setChartInstance(instance)
      onChartReady?.(instance)
    },
    [onChartReady],
  )

  const handleChartClick = useCallback(
    (params: PieClickParams) => {
      const item = isPieDataItem(params.data) ? params.data : undefined
      const hasChildren = (item?.children?.length ?? 0) > 0
      if (hasChildren) handleDrillDown(params)
      else handleDrillUp()
    },
    [handleDrillDown, handleDrillUp],
  )

  useEffect(() => {
    if (!chartInstance) return

    chartInstance.on('click', handleChartClick)
    chartInstance.on('mouseover', handleMouseOver)
    chartInstance.on('mouseout', handleMouseOut)

    return () => {
      chartInstance.off('click', handleChartClick)
      chartInstance.off('mouseover', handleMouseOver)
      chartInstance.off('mouseout', handleMouseOut)
    }
  }, [chartInstance, handleChartClick, handleDrillDown, handleDrillUp, handleMouseOver, handleMouseOut])

  const generatedOptions = useMemo<EChartsOption>(
    () => ({
      title: {
        text: title,
        left: 'center',
        subtextStyle: {
          color: theme.textColor,
          fontSize: 12,
        },
        ...options?.title,
      },
      tooltip: { show: showTooltip, trigger: 'item', ...options?.tooltip },
      legend: {
        show: showLegend,
        orient: 'horizontal',
        scrollDataIndex: 1,
        left: 'left',
        bottom: '0',
        type: 'scroll',
        align: 'left',
        ...options?.legend,
      },
      series: [
        {
          name: title,
          type: 'pie',
          radius: donut ? radius : '70%',
          roseType,
          data: activeData,
          labelLayout: {
            hideOverlap: false,
          },
          minAngle,
          label: {
            show: showLabel,
            position: labelPosition,
            fontSize: labelFontSize,
            overflow: 'none',
            lineHeight: 4,
            alignTo: 'edge',
            edgeDistance: '5%',
            ...(options?.label as object),
          },
          labelLine: {
            show: showLabel && labelPosition === 'outside',
            length: 10,
            length2: 2,
            smooth: true,
            ...(options?.labelLine as object),
          },
          itemStyle: {
            borderRadius: showRadius ? 4 : 0,
            borderWidth: 2,
            borderColor: theme.backgroundColor,
            ...(options?.itemStyle as object),
          },
          emphasis: {
            label: {
              show: showLabel,
              fontSize: labelFontSize,
              fontWeight: 'bold',
              ...((options?.emphasis as { label?: object })?.label),
            },
            ...(options?.emphasis as object),
          },
          animation: true,
          animationType: 'expansion',
          animationEasing: 'backIn',
          animationDuration: 600,
          updateAnimation: true,
          updateAnimationDuration: 600,
          animationDelay: (idx: number) => idx * 10,
          ...(options?.series as object),
        },
      ],
    }),
    [
      activeData,
      donut,
      labelFontSize,
      labelPosition,
      radius,
      roseType,
      showLabel,
      showLegend,
      showRadius,
      showTooltip,
      theme,
      title,
      options,
    ],
  )

  return (
    <div style={{ height: '100%', width: '100%' }} className={cn('relative', props.className)}>
      <BaseChart<InferChartPayloadFromData<D>>
        options={generatedOptions}
        onChartReady={handleChartReady}
        className={cn('z-5', props.className)}
        {...props}
      />
      {centerText ? <CenterText centerText={centerLabel} /> : null}
    </div>
  )
}

export const PieChart = PieChartInner

export default PieChart

function CenterText({ centerText }: { centerText: { name: string; value: number } | null }) {
  if (!centerText) return null

  return (
    <div className='absolute top-1/2 left-1/2 z-4 flex -translate-x-1/2 -translate-y-1/2 transform flex-col items-center justify-center'>
      <span className='text-foreground/70 text-xs font-bold'>{centerText.name}</span>
      <span className='text-2xl font-bold'>{centerText.value}</span>
    </div>
  )
}
