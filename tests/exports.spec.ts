import { describe, expect, it } from 'vitest'
import * as pkg from '../src/index'
import VueFrappeDefault, {
  VueFrappe,
  VueFrappePlugin,
  buildChartData,
  buildChartOptions,
  isHeatmap,
} from '../src/index'

describe('package exports', () => {
  it('exposes the component as default and named export', () => {
    expect(VueFrappeDefault).toBe(VueFrappe)
    expect(VueFrappe).toBeTruthy()
    expect(pkg.default).toBe(VueFrappe)
  })

  it('exposes plugin and pure helpers', () => {
    expect(typeof VueFrappePlugin.install).toBe('function')
    expect(typeof buildChartData).toBe('function')
    expect(typeof buildChartOptions).toBe('function')
    expect(typeof isHeatmap).toBe('function')
  })
})
