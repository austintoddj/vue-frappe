<script setup lang="ts">
import { Chart } from 'frappe-charts'
import { computed, onBeforeUnmount, onMounted, shallowRef, watch, type PropType } from 'vue'
import type {
  AxisOptions,
  BarOptions,
  ChartInstance,
  ChartType,
  DataSelectPayload,
  Dataset,
  LineOptions,
  TooltipOptions,
  VueFrappeExpose,
  YMarker,
  YRegion,
} from '../types'
import { buildChartData, buildChartOptions } from '../utils/buildOptions'

const props = defineProps({
  id: {
    type: String,
    default: undefined,
  },
  dataSets: {
    type: Array as PropType<Dataset[]>,
    default: () => [],
  },
  labels: {
    type: Array as PropType<Array<string | number>>,
    default: () => [],
  },
  startDate: {
    type: Date as PropType<Date | null>,
    default: null,
  },
  endDate: {
    type: Date as PropType<Date | null>,
    default: null,
  },
  dataPoints: {
    type: Object as PropType<Record<string, number>>,
    default: () => ({}),
  },
  countLabel: {
    type: String,
    default: 'Count',
  },
  title: {
    type: String,
    default: '',
  },
  height: {
    type: Number,
    default: 300,
  },
  type: {
    type: String as PropType<ChartType>,
    default: 'bar',
  },
  yMarkers: {
    type: Array as PropType<YMarker[] | null>,
    default: null,
  },
  yRegions: {
    type: Array as PropType<YRegion[] | null>,
    default: null,
  },
  colors: {
    type: Array as PropType<string[]>,
    default: () => ['#7cd6fd', '#743ee2', '#ffa3ef'],
  },
  isNavigable: {
    type: Boolean,
    default: false,
  },
  valuesOverPoints: {
    type: Boolean,
    default: false,
  },
  lineOptions: {
    type: Object as PropType<LineOptions>,
    default: () => ({
      dotSize: 4,
      hideLine: 0,
      hideDots: 0,
      heatline: 0,
      regionFill: 0,
      areaFill: 0,
    }),
  },
  axisOptions: {
    type: Object as PropType<AxisOptions>,
    default: () => ({
      yAxisMode: '',
      xAxisMode: '',
      xIsSeries: 0,
    }),
  },
  maxLegendPoints: {
    type: Number,
    default: 20,
  },
  maxSlices: {
    type: Number,
    default: 20,
  },
  barOptions: {
    type: Object as PropType<BarOptions>,
    default: () => ({
      height: 20,
      depth: 2,
      spaceRatio: 0.5,
      stacked: 0,
    }),
  },
  discreteDomains: {
    type: Boolean,
    default: true,
  },
  tooltipOptions: {
    type: Object as PropType<TooltipOptions>,
    default: () => ({
      formatTooltipX: (d: unknown) => `${d}`.toUpperCase(),
      formatTooltipY: (d: unknown) => `${d} pts`,
    }),
  },
  updateDebounce: {
    type: Number,
    default: 0,
  },
})

const emit = defineEmits<{
  /** Fired when a navigable chart selects a data point. */
  dataSelect: [payload: DataSelectPayload]
  /** Fired after the chart instance is created. */
  ready: [chart: ChartInstance]
}>()

const containerRef = shallowRef<HTMLElement | null>(null)
const chart = shallowRef<ChartInstance | null>(null)

let debounceTimer: ReturnType<typeof setTimeout> | null = null
let dataSelectHandler: ((event: Event) => void) | null = null

const optionInput = computed(() => ({
  type: props.type,
  title: props.title,
  height: props.height,
  colors: props.colors,
  isNavigable: props.isNavigable,
  valuesOverPoints: props.valuesOverPoints,
  discreteDomains: props.discreteDomains,
  maxLegendPoints: props.maxLegendPoints,
  maxSlices: props.maxSlices,
  lineOptions: props.lineOptions,
  axisOptions: props.axisOptions,
  barOptions: props.barOptions,
  tooltipOptions: props.tooltipOptions,
  countLabel: props.countLabel,
  labels: props.labels,
  dataSets: props.dataSets,
  yMarkers: props.yMarkers,
  yRegions: props.yRegions,
  dataPoints: props.dataPoints,
  startDate: props.startDate,
  endDate: props.endDate,
}))

function clearDebounce(): void {
  if (debounceTimer !== null) {
    clearTimeout(debounceTimer)
    debounceTimer = null
  }
}

function detachDataSelect(): void {
  if (containerRef.value && dataSelectHandler) {
    containerRef.value.removeEventListener('data-select', dataSelectHandler)
  }
  dataSelectHandler = null
}

function attachDataSelect(parent: HTMLElement): void {
  detachDataSelect()
  dataSelectHandler = (event: Event) => {
    const custom = event as CustomEvent<DataSelectPayload>
    emit('dataSelect', custom.detail ?? {})
  }
  parent.addEventListener('data-select', dataSelectHandler)
}

function destroy(): void {
  clearDebounce()
  detachDataSelect()

  if (chart.value) {
    try {
      chart.value.destroy()
    } catch {
      // Chart may already be torn down; ignore.
    }
    chart.value = null
  }

  if (containerRef.value) {
    containerRef.value.innerHTML = ''
  }
}

function createChart(): void {
  if (!containerRef.value) {
    return
  }

  destroy()

  const options = buildChartOptions(optionInput.value)
  // Frappe's constructor returns a chart subclass instance, not `Chart` itself.
  const instance = new Chart(
    containerRef.value,
    options as unknown as Record<string, unknown>,
  ) as unknown as ChartInstance
  chart.value = instance
  attachDataSelect(containerRef.value)
  emit('ready', instance)
}

function update(): void {
  if (!chart.value) {
    createChart()
    return
  }

  chart.value.update(buildChartData(optionInput.value))
}

function scheduleUpdate(): void {
  if (props.updateDebounce <= 0) {
    update()
    return
  }

  clearDebounce()
  debounceTimer = setTimeout(() => {
    debounceTimer = null
    update()
  }, props.updateDebounce)
}

function exportChart(): void {
  chart.value?.export()
}

function addDataPoint(
  label: string | number,
  valueFromEachDataset: number[],
  index?: number,
): void {
  chart.value?.addDataPoint(label, valueFromEachDataset, index)
}

function removeDataPoint(index?: number): void {
  chart.value?.removeDataPoint(index)
}

function updateDataset(datasetValues: number[], index?: number): void {
  chart.value?.updateDataset(datasetValues, index)
}

/**
 * Structural options that require a full re-create rather than `chart.update()`.
 */
const structuralKeys = computed(
  () =>
    [
      props.type,
      props.title,
      props.height,
      props.colors,
      props.isNavigable,
      props.valuesOverPoints,
      props.discreteDomains,
      props.maxLegendPoints,
      props.maxSlices,
      props.lineOptions,
      props.axisOptions,
      props.barOptions,
      props.tooltipOptions,
      props.countLabel,
    ] as const,
)

watch(
  () => [props.labels, props.dataSets, props.yMarkers, props.yRegions, props.dataPoints] as const,
  () => scheduleUpdate(),
  { deep: true },
)

watch(
  () => [props.startDate, props.endDate] as const,
  () => scheduleUpdate(),
)

watch(
  structuralKeys,
  () => {
    if (chart.value) {
      createChart()
    }
  },
  { deep: true },
)

onMounted(() => {
  createChart()
})

onBeforeUnmount(() => {
  destroy()
})

defineExpose<VueFrappeExpose>({
  get chart() {
    return chart.value
  },
  createChart,
  update,
  export: exportChart,
  addDataPoint,
  removeDataPoint,
  updateDataset,
  destroy,
})
</script>

<template>
  <div :id="id" ref="containerRef" class="vue-frappe" data-testid="vue-frappe" />
</template>
