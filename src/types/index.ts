/** Chart types supported by Frappe Charts (and this wrapper). */
export type ChartType =
  'line' | 'bar' | 'axis-mixed' | 'pie' | 'donut' | 'percentage' | 'heatmap' | 'scatter'

export interface Dataset {
  name?: string
  /** Prefer `chartType` — some Frappe versions also accept `type`. */
  chartType?: 'line' | 'bar' | 'scatter'
  type?: 'line' | 'bar' | 'scatter'
  values: number[]
}

export interface YMarker {
  label?: string
  value: number
  options?: {
    labelPos?: string
  }
}

export interface YRegion {
  label?: string
  start: number
  end: number
  options?: {
    labelPos?: string
  }
}

export interface ChartData {
  labels?: Array<string | number>
  datasets?: Dataset[]
  yMarkers?: YMarker[] | null
  yRegions?: YRegion[] | null
  dataPoints?: Record<string, number>
  start?: Date | null
  end?: Date | null
  countLabel?: string
}

export interface LineOptions {
  dotSize?: number
  hideLine?: number | boolean
  hideDots?: number | boolean
  heatline?: number | boolean
  regionFill?: number | boolean
  areaFill?: number | boolean
}

export interface AxisOptions {
  yAxisMode?: string
  xAxisMode?: string
  xIsSeries?: number | boolean
  shortenYAxisNumbers?: number | boolean
}

export interface BarOptions {
  height?: number
  depth?: number
  spaceRatio?: number
  stacked?: number | boolean
}

export interface TooltipOptions {
  formatTooltipX?: ((value: unknown) => string) | null
  formatTooltipY?: ((value: unknown) => string) | null
}

export interface ChartOptions {
  type?: ChartType
  title?: string
  height?: number
  colors?: string[]
  data?: ChartData
  isNavigable?: boolean | number
  valuesOverPoints?: boolean | number
  discreteDomains?: boolean | number
  animate?: boolean | number
  maxLegendPoints?: number
  maxSlices?: number
  lineOptions?: LineOptions
  axisOptions?: AxisOptions
  barOptions?: BarOptions
  tooltipOptions?: TooltipOptions
}

/** Subset of the Frappe chart instance this wrapper relies on. */
export interface ChartInstance {
  update: (data: ChartData) => void
  addDataPoint: (label: string | number, valueFromEachDataset: number[], index?: number) => void
  removeDataPoint: (index?: number) => void
  updateDataset: (datasetValues: number[], index?: number) => void
  updateDatasets?: (datasets: number[][]) => void
  export: () => void
  destroy: () => void
  parent: HTMLElement
  data: ChartData
}

/** Props accepted by the `<VueFrappe>` component. */
export interface VueFrappeProps {
  /**
   * Optional DOM id for the chart container.
   * Prefer leaving this unset — the component mounts on a template ref.
   */
  id?: string
  /** Chart series datasets (ignored for `heatmap`). */
  dataSets?: Dataset[]
  /** X-axis / category labels. */
  labels?: Array<string | number>
  /** Heatmap start date. */
  startDate?: Date | null
  /** Heatmap end date. */
  endDate?: Date | null
  /** Heatmap data points keyed by date string. */
  dataPoints?: Record<string, number>
  /** Heatmap count legend label. */
  countLabel?: string
  /** Chart title rendered above the plot. */
  title?: string
  /** Chart height in pixels. */
  height?: number
  /** Frappe chart type. */
  type?: ChartType
  /** Horizontal markers on the Y axis. */
  yMarkers?: YMarker[] | null
  /** Highlighted Y-axis regions. */
  yRegions?: YRegion[] | null
  /** Series colors (hex or named). */
  colors?: string[]
  /** Enable keyboard / focus navigation. */
  isNavigable?: boolean
  /** Draw values above points / bars. */
  valuesOverPoints?: boolean
  /** Line-specific options. */
  lineOptions?: LineOptions
  /** Axis-specific options. */
  axisOptions?: AxisOptions
  /** Cap for legend items. */
  maxLegendPoints?: number
  /** Cap for pie / percentage slices. */
  maxSlices?: number
  /** Bar-specific options. */
  barOptions?: BarOptions
  /** Discrete domain mode (heatmap / axis). */
  discreteDomains?: boolean
  /** Tooltip formatters. */
  tooltipOptions?: TooltipOptions
  /**
   * Debounce (ms) applied when reactive props change and the chart is updated.
   * Set to `0` to update immediately.
   */
  updateDebounce?: number
}

/** Methods exposed via template ref. */
export interface VueFrappeExpose {
  /** Underlying Frappe chart instance (or `null` before mount / after destroy). */
  chart: ChartInstance | null
  /** Re-create the chart from current props. */
  createChart: () => void
  /** Push current prop data into the existing chart. */
  update: () => void
  /** Export the chart as an SVG download (Frappe built-in). */
  export: () => void
  /** Append a data point. */
  addDataPoint: (label: string | number, valueFromEachDataset: number[], index?: number) => void
  /** Remove a data point by index. */
  removeDataPoint: (index?: number) => void
  /** Replace values for a single dataset. */
  updateDataset: (datasetValues: number[], index?: number) => void
  /** Tear down listeners (also runs automatically on unmount). */
  destroy: () => void
}

export type DataSelectPayload = Record<string, unknown>
