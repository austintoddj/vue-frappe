import VueFrappe from './components/VueFrappe.vue'
import { VueFrappePlugin } from './plugin'

export { VueFrappe, VueFrappePlugin }
export { buildChartData, buildChartOptions, isHeatmap } from './utils/buildOptions'
export type {
  AxisOptions,
  BarOptions,
  ChartData,
  ChartInstance,
  ChartOptions,
  ChartType,
  DataSelectPayload,
  Dataset,
  LineOptions,
  TooltipOptions,
  VueFrappeExpose,
  VueFrappeProps,
  YMarker,
  YRegion,
} from './types'
export type { VueFrappePluginOptions } from './plugin'

/** Default export is the component (v1-compatible). */
export default VueFrappe
