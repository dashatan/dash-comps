import { EChartsOption } from 'echarts'
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
  ...props
}: PieChartProps<D>) {
  const theme = getTheme()
  const [chartInstance, setChartInstance] = useState<echarts.ECharts | null>(null)
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
  }, [parentData, title])

  const handleCenterText = useCallback(
    (name: string, value: number) => {
      if (!chartInstance) return
      const commonOptions = {
        type: 'text',
        left: 'center',
        style: { text: name, fontSize: 12, fontFamily: theme.fontFamily, fontWeight: 'lighter', fill: theme.textColor },
      }
      chartInstance?.setOption({
        graphic: [
          {
            type: 'group',
            left: 'center',
            top: 'center',
            z: 100,
            children: [
              { ...commonOptions, top: '15' },
              { ...commonOptions, top: '35', style: { ...commonOptions.style, fontSize: 24, fontWeight: 'bold', text: value } },
            ],
          },
        ],
      })
    },
    [chartInstance, theme]
  )

  const handleClearCenterText = useCallback(() => {
    chartInstance?.setOption?.({
      graphic: [
        {
          type: 'group',
          left: 'center',
          top: 'center',
          z: 100,
          children: [
            { type: 'text', style: { text: '' } },
            { type: 'text', style: { text: '' } },
          ],
        },
      ],
    })
  }, [chartInstance])

  const handleMouseOver = useCallback((params: { data?: { name?: string; value?: number } }) => {
    const { name = "", value = 0 } = params?.data || {};
    setCenterLabel({ name, value });
  }, []);

  const handleMouseOut = useCallback(() => {
    setCenterLabel(null);
  }, []);

  const handleChartReady = useCallback(
    (instance: echarts.ECharts) => {
      setChartInstance(instance)
      props.onChartReady?.(instance)
    },
    [props.onChartReady]
  )

  const handleChartClick = (params: any) => {
    const hasChildren = params?.data?.children?.length > 0
    if (hasChildren) handleDrillDown(params)
    else handleDrillUp()
  }

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
  }, [chartInstance, handleDrillDown, handleDrillUp, handleMouseOver, handleMouseOut])

  // Generate options with current data state
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
          // Label styling
          label: {
            show: showLabel,
            position: labelPosition,
            fontSize: labelFontSize,
            overflow: 'none',
            lineHeight: 4,
            alignTo: 'edge',
            edgeDistance: '5%',
            ...(options?.label as any),
          },

          // Label connector lines
          labelLine: {
            show: showLabel && labelPosition === 'outside',
            length: 10,
            length2: 2,
            smooth: true,
            ...(options?.labelLine as any),
          },

          // Segment styling
          itemStyle: {
            borderRadius: showRadius ? 4 : 0,
            borderWidth: 2,
            borderColor: theme.backgroundColor,

            ...(options?.itemStyle as any),
          },

          // Hover state styling
          emphasis: {
            label: {
              show: showLabel,
              fontSize: labelFontSize,
              fontWeight: 'bold',
              ...(options?.emphasis as any)?.label,
            },

            ...(options?.emphasis as any),
          },

          // Animation configuration for smooth drill transitions
          animation: true,
          animationType: 'expansion',
          animationEasing: 'backIn',
          animationDuration: 600,
          updateAnimation: true,
          updateAnimationDuration: 600,
          animationDelay: (idx: number) => idx * 10,

          ...(options?.series as any),
        },
      ],
    }),
    [activeData, donut, labelFontSize, labelPosition, parentData.length, radius, roseType, showLegend, theme, title, options]
  )

  return (
    <div style={{ height: '100%', width: '100%' }} className={cn('relative', props.className)}>
      <BaseChart<InferChartPayloadFromData<D>>
        options={generatedOptions}
        onChartReady={handleChartReady}
        className={cn('z-5', props.className)}
        {...props}
      />
      <CenterText centerText={centerLabel} />
    </div>
  )
}

export const PieChart = PieChartInner

export default PieChart

function CenterText({ centerText }: { centerText: { name: string; value: number } | null }) {
  return (
    <div className='absolute top-1/2 left-1/2 z-4 flex -translate-x-1/2 -translate-y-1/2 transform flex-col items-center justify-center'>
      <span className='text-foreground/70 text-xs font-bold'>{centerText?.name}</span>
      <span className='text-2xl font-bold'>{centerText?.value}</span>
    </div>
  )
}
