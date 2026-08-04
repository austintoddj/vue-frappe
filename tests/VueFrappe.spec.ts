import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { defineComponent, nextTick, ref } from 'vue'
import VueFrappe from '../src/components/VueFrappe.vue'
import type { VueFrappeExpose } from '../src/types'
import { chartInstances, resetChartMocks } from './mocks/frappe-charts'

vi.mock('frappe-charts', async () => {
  const mock = await import('./mocks/frappe-charts')
  return {
    Chart: mock.Chart,
  }
})

const sampleDatasets = [
  {
    name: 'Bar Chart',
    chartType: 'bar' as const,
    values: [25, 40, 30],
  },
  {
    name: 'Line Chart',
    chartType: 'line' as const,
    values: [25, 50, 10],
  },
]

const sampleLabels = ['12am-3am', '3am-6am', '6am-9am']

function mountChart(props: Record<string, unknown> = {}) {
  return mount(VueFrappe, {
    props: {
      labels: sampleLabels,
      dataSets: sampleDatasets,
      type: 'bar',
      height: 250,
      colors: ['#03a87c', '#ffa3ef'],
      ...props,
    },
    attachTo: document.body,
  })
}

describe('VueFrappe', () => {
  beforeEach(() => {
    resetChartMocks()
    document.body.innerHTML = ''
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('creates a chart on mount with the expected options', async () => {
    const wrapper = mountChart({ title: 'Stats', id: 'chart-root' })
    await flushPromises()

    expect(chartInstances).toHaveLength(1)
    const instance = chartInstances[0]!
    expect(instance.options.type).toBe('bar')
    expect(instance.options.title).toBe('Stats')
    expect(instance.options.height).toBe(250)
    expect(instance.options.colors).toEqual(['#03a87c', '#ffa3ef'])
    expect(instance.options.data?.labels).toEqual(sampleLabels)
    expect(instance.options.data?.datasets).toEqual(sampleDatasets)
    expect(wrapper.find('[data-testid="vue-frappe"]').attributes('id')).toBe('chart-root')

    wrapper.unmount()
  })

  it('calls chart.update when data props change (bugfix from v1)', async () => {
    const wrapper = mountChart()
    await flushPromises()
    const instance = chartInstances[0]!

    await wrapper.setProps({
      labels: [...sampleLabels, '9am-12pm'],
      dataSets: [
        {
          name: 'Bar Chart',
          chartType: 'bar',
          values: [25, 40, 30, 12],
        },
      ],
    })
    await nextTick()

    expect(instance.update).toHaveBeenCalledTimes(1)
    expect(instance.update).toHaveBeenCalledWith(
      expect.objectContaining({
        labels: [...sampleLabels, '9am-12pm'],
      }),
    )

    wrapper.unmount()
  })

  it('debounces updates when updateDebounce is set', async () => {
    vi.useFakeTimers()
    const wrapper = mountChart({ updateDebounce: 50 })
    await flushPromises()
    const instance = chartInstances[0]!

    await wrapper.setProps({ labels: ['a'] })
    await wrapper.setProps({ labels: ['a', 'b'] })
    expect(instance.update).not.toHaveBeenCalled()

    await vi.advanceTimersByTimeAsync(50)
    expect(instance.update).toHaveBeenCalledTimes(1)
    expect(instance.update).toHaveBeenLastCalledWith(
      expect.objectContaining({ labels: ['a', 'b'] }),
    )

    wrapper.unmount()
  })

  it('recreates the chart when structural props change', async () => {
    const wrapper = mountChart({ type: 'bar' })
    await flushPromises()
    expect(chartInstances).toHaveLength(1)

    await wrapper.setProps({ type: 'line' })
    await nextTick()

    expect(chartInstances).toHaveLength(2)
    expect(chartInstances[0]!.destroy).toHaveBeenCalled()
    expect(chartInstances[1]!.options.type).toBe('line')

    wrapper.unmount()
  })

  it('exposes chart methods via template ref', async () => {
    const exposed = ref<VueFrappeExpose | null>(null)

    const Host = defineComponent({
      components: { VueFrappe },
      setup() {
        return { exposed }
      },
      template: `
        <VueFrappe
          ref="exposed"
          :labels="['A', 'B']"
          :data-sets="[{ name: 'S', values: [1, 2] }]"
          type="bar"
        />
      `,
    })

    const wrapper = mount(Host, { attachTo: document.body })
    await flushPromises()

    expect(exposed.value?.chart).toBeTruthy()
    exposed.value?.addDataPoint('C', [3])
    exposed.value?.removeDataPoint(0)
    exposed.value?.updateDataset([9, 8], 0)
    exposed.value?.export()
    exposed.value?.update()

    const instance = chartInstances[0]!
    expect(instance.addDataPoint).toHaveBeenCalledWith('C', [3], undefined)
    expect(instance.removeDataPoint).toHaveBeenCalledWith(0)
    expect(instance.updateDataset).toHaveBeenCalledWith([9, 8], 0)
    expect(instance.export).toHaveBeenCalled()
    expect(instance.update).toHaveBeenCalled()

    wrapper.unmount()
  })

  it('destroys the chart on unmount', async () => {
    const wrapper = mountChart()
    await flushPromises()
    const instance = chartInstances[0]!

    wrapper.unmount()
    expect(instance.destroy).toHaveBeenCalled()
  })

  it('emits ready with the chart instance', async () => {
    const wrapper = mountChart()
    await flushPromises()

    expect(wrapper.emitted('ready')).toHaveLength(1)
    expect(wrapper.emitted('ready')?.[0]?.[0]).toBe(chartInstances[0])

    wrapper.unmount()
  })

  it('forwards data-select DOM events as dataSelect', async () => {
    const wrapper = mountChart({ isNavigable: true })
    await flushPromises()

    const el = wrapper.find('[data-testid="vue-frappe"]').element
    el.dispatchEvent(
      new CustomEvent('data-select', {
        detail: { index: 2, label: '6am-9am' },
      }),
    )
    await nextTick()

    expect(wrapper.emitted('dataSelect')).toHaveLength(1)
    expect(wrapper.emitted('dataSelect')?.[0]?.[0]).toEqual({
      index: 2,
      label: '6am-9am',
    })

    wrapper.unmount()
  })

  it('builds heatmap options when type is heatmap', async () => {
    const start = new Date('2024-01-01')
    const end = new Date('2024-12-31')
    const wrapper = mountChart({
      type: 'heatmap',
      dataPoints: { '2024-03-01': 5 },
      startDate: start,
      endDate: end,
      countLabel: 'Commits',
      dataSets: undefined,
      labels: undefined,
    })
    await flushPromises()

    const instance = chartInstances[0]!
    expect(instance.options.type).toBe('heatmap')
    expect(instance.options.data).toEqual({
      dataPoints: { '2024-03-01': 5 },
      start,
      end,
      countLabel: 'Commits',
    })
    expect(instance.options.valuesOverPoints).toBeUndefined()

    wrapper.unmount()
  })
})
