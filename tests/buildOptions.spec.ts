import { describe, expect, it } from 'vitest'
import { buildChartData, buildChartOptions, isHeatmap } from '../src/utils/buildOptions'
import type { VueFrappeProps } from '../src/types'

function base(
  overrides: Partial<
    Required<
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
  > = {},
) {
  return {
    type: 'bar' as const,
    title: 'Revenue',
    height: 280,
    colors: ['#111'],
    isNavigable: false,
    valuesOverPoints: true,
    discreteDomains: true,
    maxLegendPoints: 10,
    maxSlices: 8,
    lineOptions: { dotSize: 3 },
    axisOptions: { xIsSeries: 1 },
    barOptions: { stacked: 1 },
    tooltipOptions: {},
    countLabel: 'Count',
    labels: ['A', 'B'],
    dataSets: [{ name: 'S', values: [1, 2] }],
    yMarkers: [{ value: 1 }],
    yRegions: null,
    dataPoints: { '2024-01-01': 3 },
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-12-31'),
    ...overrides,
  }
}

describe('isHeatmap', () => {
  it('returns true only for heatmap', () => {
    expect(isHeatmap('heatmap')).toBe(true)
    expect(isHeatmap('bar')).toBe(false)
    expect(isHeatmap('line')).toBe(false)
  })
})

describe('buildChartData', () => {
  it('builds axis chart data from labels and datasets', () => {
    const data = buildChartData(base())
    expect(data).toEqual({
      labels: ['A', 'B'],
      datasets: [{ name: 'S', values: [1, 2] }],
      yMarkers: [{ value: 1 }],
      yRegions: undefined,
    })
  })

  it('builds heatmap data from dataPoints and date range', () => {
    const start = new Date('2024-01-01')
    const end = new Date('2024-12-31')
    const data = buildChartData(
      base({
        type: 'heatmap',
        startDate: start,
        endDate: end,
        dataPoints: { '2024-06-01': 4 },
        countLabel: 'Commits',
      }),
    )

    expect(data).toEqual({
      dataPoints: { '2024-06-01': 4 },
      start,
      end,
      countLabel: 'Commits',
    })
  })
})

describe('buildChartOptions', () => {
  it('includes series options for non-heatmap charts', () => {
    const options = buildChartOptions(base({ type: 'line' }))
    expect(options.type).toBe('line')
    expect(options.valuesOverPoints).toBe(true)
    expect(options.lineOptions).toEqual({ dotSize: 3 })
    expect(options.barOptions).toEqual({ stacked: 1 })
    expect(options.data?.labels).toEqual(['A', 'B'])
  })

  it('omits series options for heatmap charts', () => {
    const options = buildChartOptions(base({ type: 'heatmap' }))
    expect(options.type).toBe('heatmap')
    expect(options.valuesOverPoints).toBeUndefined()
    expect(options.lineOptions).toBeUndefined()
    expect(options.data?.dataPoints).toEqual({ '2024-01-01': 3 })
  })
})
