import { vi } from 'vitest'
import type { ChartData, ChartOptions } from '../../src/types'

export type MockChartInstance = {
  options: ChartOptions
  parent: HTMLElement
  data: ChartData
  update: ReturnType<typeof vi.fn>
  addDataPoint: ReturnType<typeof vi.fn>
  removeDataPoint: ReturnType<typeof vi.fn>
  updateDataset: ReturnType<typeof vi.fn>
  export: ReturnType<typeof vi.fn>
  destroy: ReturnType<typeof vi.fn>
}

export const chartInstances: MockChartInstance[] = []

export class Chart {
  options: ChartOptions
  parent: HTMLElement
  data: ChartData
  update = vi.fn((data: ChartData) => {
    this.data = data
  })
  addDataPoint = vi.fn()
  removeDataPoint = vi.fn()
  updateDataset = vi.fn()
  export = vi.fn()
  destroy = vi.fn()

  constructor(parent: string | HTMLElement, options: ChartOptions) {
    this.parent =
      typeof parent === 'string' ? (document.querySelector(parent) as HTMLElement) : parent
    this.options = options
    this.data = options.data ?? {}
    chartInstances.push(this)
  }
}

export function resetChartMocks(): void {
  chartInstances.length = 0
}
