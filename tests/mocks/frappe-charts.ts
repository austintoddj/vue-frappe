import { vi, type Mock } from 'vitest'
import type { ChartData, ChartInstance, ChartOptions } from '../../src/types'

export type MockChartInstance = {
  options: ChartOptions
  parent: HTMLElement
  data: ChartData
  update: Mock<ChartInstance['update']>
  addDataPoint: Mock<ChartInstance['addDataPoint']>
  removeDataPoint: Mock<ChartInstance['removeDataPoint']>
  updateDataset: Mock<ChartInstance['updateDataset']>
  export: Mock<ChartInstance['export']>
  destroy: Mock<ChartInstance['destroy']>
}

export const chartInstances: MockChartInstance[] = []

export class Chart {
  options: ChartOptions
  parent: HTMLElement
  data: ChartData
  update: Mock<ChartInstance['update']> = vi.fn((data: ChartData) => {
    this.data = data
  })
  addDataPoint: Mock<ChartInstance['addDataPoint']> = vi.fn()
  removeDataPoint: Mock<ChartInstance['removeDataPoint']> = vi.fn()
  updateDataset: Mock<ChartInstance['updateDataset']> = vi.fn()
  export: Mock<ChartInstance['export']> = vi.fn()
  destroy: Mock<ChartInstance['destroy']> = vi.fn()

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
