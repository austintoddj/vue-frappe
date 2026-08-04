import type { App, Plugin } from 'vue'
import VueFrappe from './components/VueFrappe.vue'

export interface VueFrappePluginOptions {
  /** Global component name. Defaults to `VueFrappe`. */
  name?: string
}

export const VueFrappePlugin: Plugin<[VueFrappePluginOptions?]> = {
  install(app: App, options: VueFrappePluginOptions = {}) {
    const name = options.name ?? 'VueFrappe'
    app.component(name, VueFrappe)

    // Keep the legacy kebab-case tag for drop-in upgrades from v1.
    if (name === 'VueFrappe') {
      app.component('vue-frappe', VueFrappe)
    }
  },
}

export default VueFrappePlugin
