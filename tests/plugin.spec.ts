import { describe, expect, it, vi } from 'vitest'
import { createApp, defineComponent, h } from 'vue'
import { mount } from '@vue/test-utils'
import { VueFrappePlugin } from '../src/plugin'
import VueFrappe from '../src/components/VueFrappe.vue'

vi.mock('frappe-charts', async () => {
  const mock = await import('./mocks/frappe-charts')
  return { Chart: mock.Chart }
})

describe('VueFrappePlugin', () => {
  it('registers VueFrappe and vue-frappe globally', () => {
    const app = createApp({ render: () => null })
    app.use(VueFrappePlugin)

    expect(app._context.components['VueFrappe']).toBeTruthy()
    expect(app._context.components['vue-frappe']).toBeTruthy()
  })

  it('allows a custom global component name', () => {
    const app = createApp({ render: () => null })
    app.use(VueFrappePlugin, { name: 'FrappeChart' })

    expect(app._context.components['FrappeChart']).toBeTruthy()
    expect(app._context.components['vue-frappe']).toBeUndefined()
  })

  it('works when used as a local component import', () => {
    const Host = defineComponent({
      components: { VueFrappe },
      setup() {
        return () =>
          h(VueFrappe, {
            labels: ['A'],
            dataSets: [{ name: 'S', values: [1] }],
            type: 'bar',
          })
      },
    })

    const wrapper = mount(Host, { attachTo: document.body })
    expect(wrapper.find('[data-testid="vue-frappe"]').exists()).toBe(true)
    wrapper.unmount()
  })
})
