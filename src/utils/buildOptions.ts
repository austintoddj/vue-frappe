import type { ChartData, ChartOptions, ChartType, VueFrappeProps } from '../types'

type BuildInput = Required<
  Pick<
    VueFrappeProps,
    | 'type'
    | 'title'
    | 'height'
    | 'colors'
    | 'isNavigable'
    | 'valuesOverPoints'
    | 'discreteDomains'
    | 'maxLegendPoints'
    | 'maxSlices'
    | 'lineOptions'
    | 'axisOptions'
    | 'barOptions'
    | 'tooltipOptions'
    | 'countLabel'
  >
> &
  Pick<
    VueFrappeProps,
    'labels' | 'dataSets' | 'yMarkers' | 'yRegions' | 'dataPoints' | 'startDate' | 'endDate'
  >

export function isHeatmap(type: ChartType): boolean {
  return type === 'heatmap'
}

export function buildChartData(input: BuildInput): ChartData {
  if (isHeatmap(input.type)) {
    return {
      dataPoints: input.dataPoints ?? {},
      start: input.startDate ?? undefined,
      end: input.endDate ?? undefined,
      countLabel: input.countLabel,
    }
  }

  return {
    labels: input.labels ?? [],
    datasets: input.dataSets ?? [],
    yMarkers: input.yMarkers ?? undefined,
    yRegions: input.yRegions ?? undefined,
  }
}

export function buildChartOptions(input: BuildInput): ChartOptions {
  const base: ChartOptions = {
    type: input.type,
    title: input.title,
    height: input.height,
    colors: input.colors,
    isNavigable: input.isNavigable,
    discreteDomains: input.discreteDomains,
    data: buildChartData(input),
  }

  if (isHeatmap(input.type)) {
    return base
  }

  return {
    ...base,
    valuesOverPoints: input.valuesOverPoints,
    barOptions: input.barOptions,
    lineOptions: input.lineOptions,
    axisOptions: input.axisOptions,
    maxLegendPoints: input.maxLegendPoints,
    maxSlices: input.maxSlices,
    tooltipOptions: input.tooltipOptions,
  }
}
