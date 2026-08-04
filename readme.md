# vue-frappe

[![npm version](https://img.shields.io/npm/v/vue-frappe.svg)](https://www.npmjs.com/package/vue-frappe)
[![npm downloads](https://img.shields.io/npm/dt/vue-frappe.svg)](https://www.npmjs.com/package/vue-frappe)
[![CI](https://github.com/austintoddj/vue-frappe/actions/workflows/ci.yml/badge.svg)](https://github.com/austintoddj/vue-frappe/actions/workflows/ci.yml)
[![license](https://img.shields.io/npm/l/vue-frappe.svg)](./license)

**Vue 3** component wrapper for [Frappe Charts](https://frappe.io/charts) — typed, tested, tree-shakeable, and built for modern tooling.

```bash
npm install vue-frappe frappe-charts
# or: yarn add vue-frappe frappe-charts
# or: pnpm add vue-frappe frappe-charts
```

---

## Why this package?

| Concern         | v1 (legacy)               | v2 (2026)                                      |
| --------------- | ------------------------- | ---------------------------------------------- |
| Vue             | Vue 2 Options API         | Vue 3 `<script setup>`                         |
| Types           | None                      | Full TypeScript surface + ambient frappe types |
| Build           | Raw source on npm         | Vite library mode (ESM + CJS + `.d.ts`)        |
| Tests           | None                      | Vitest + Vue Test Utils                        |
| Reactivity bug  | `update()` never applied  | `chart.update()` on prop changes               |
| Cleanup         | Leaked timers / listeners | `destroy()` on unmount                         |
| Package exports | `"main": "src/index.js"`  | Conditional `exports` map                      |
| CI              | Tag-only publish          | Lint · types · tests · build · size budget     |

---

## Quick start

### Local registration

```vue
<script setup lang="ts">
import { VueFrappe } from 'vue-frappe'
import type { Dataset } from 'vue-frappe'

const labels = [
  '12am-3am',
  '3am-6am',
  '6am-9am',
  '9am-12pm',
  '12pm-3pm',
  '3pm-6pm',
  '6pm-9pm',
  '9pm-12am',
]

const dataSets: Dataset[] = [
  {
    name: 'Bar Chart',
    chartType: 'bar',
    values: [25, 40, 30, 35, 8, 52, 17, -4],
  },
  {
    name: 'Line Chart',
    chartType: 'line',
    values: [25, 50, -10, 15, 18, 32, 27, 14],
  },
]
</script>

<template>
  <VueFrappe
    title="A statistical chart"
    type="axis-mixed"
    :labels="labels"
    :height="300"
    :colors="['#03a87c', '#ffa3ef']"
    :data-sets="dataSets"
  />
</template>
```

### Plugin (global)

```ts
import { createApp } from 'vue'
import { VueFrappePlugin } from 'vue-frappe'
import App from './App.vue'

createApp(App).use(VueFrappePlugin).mount('#app')
```

```vue
<template>
  <vue-frappe type="bar" :labels="['A', 'B']" :data-sets="[{ values: [1, 2] }]" />
</template>
```

> **Styles:** Frappe Charts injects styles from its package build. If charts look unstyled in your setup, check the Frappe Charts docs for your installed version.

---

## Props

| Prop               | Type                     | Default                             | Notes                                                                           |
| ------------------ | ------------------------ | ----------------------------------- | ------------------------------------------------------------------------------- |
| `type`             | `ChartType`              | `'bar'`                             | `line`, `bar`, `axis-mixed`, `pie`, `donut`, `percentage`, `heatmap`, `scatter` |
| `labels`           | `(string \| number)[]`   | `[]`                                | Axis / category labels                                                          |
| `dataSets`         | `Dataset[]`              | `[]`                                | Series data (non-heatmap)                                                       |
| `title`            | `string`                 | `''`                                | Chart title                                                                     |
| `height`           | `number`                 | `300`                               | Height in px                                                                    |
| `colors`           | `string[]`               | `['#7cd6fd', '#743ee2', '#ffa3ef']` | Hex or named colors                                                             |
| `yMarkers`         | `YMarker[] \| null`      | `null`                              | Y-axis markers                                                                  |
| `yRegions`         | `YRegion[] \| null`      | `null`                              | Y-axis regions                                                                  |
| `isNavigable`      | `boolean`                | `false`                             | Keyboard / focus navigation                                                     |
| `valuesOverPoints` | `boolean`                | `false`                             | Draw values on points/bars                                                      |
| `lineOptions`      | `LineOptions`            | see source                          | Line-specific options                                                           |
| `axisOptions`      | `AxisOptions`            | see source                          | Axis-specific options                                                           |
| `barOptions`       | `BarOptions`             | see source                          | Bar-specific options                                                            |
| `tooltipOptions`   | `TooltipOptions`         | see source                          | Tooltip formatters                                                              |
| `maxLegendPoints`  | `number`                 | `20`                                | Legend cap                                                                      |
| `maxSlices`        | `number`                 | `20`                                | Pie / percentage cap                                                            |
| `discreteDomains`  | `boolean`                | `true`                              | Discrete domain mode                                                            |
| `dataPoints`       | `Record<string, number>` | `{}`                                | Heatmap values                                                                  |
| `startDate`        | `Date \| null`           | `null`                              | Heatmap start                                                                   |
| `endDate`          | `Date \| null`           | `null`                              | Heatmap end                                                                     |
| `countLabel`       | `string`                 | `'Count'`                           | Heatmap legend label                                                            |
| `id`               | `string`                 | —                                   | Optional container `id` (not required)                                          |
| `updateDebounce`   | `number`                 | `0`                                 | Debounce ms for reactive data updates                                           |

Data props (`labels`, `dataSets`, `yMarkers`, `yRegions`, `dataPoints`, dates) call `chart.update()` when they change. Structural props (`type`, `height`, `colors`, options objects, …) re-create the chart.

---

## Events

| Event        | Payload                   | When                                       |
| ------------ | ------------------------- | ------------------------------------------ |
| `ready`      | `ChartInstance`           | After the chart is constructed             |
| `dataSelect` | `Record<string, unknown>` | Navigable chart fires Frappe `data-select` |

```vue
<VueFrappe
  is-navigable
  :labels="labels"
  :data-sets="dataSets"
  @ready="onReady"
  @data-select="onSelect"
/>
```

---

## Exposed methods (template ref)

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { VueFrappe, type VueFrappeExpose } from 'vue-frappe'

const chartRef = ref<VueFrappeExpose | null>(null)

function exportSvg() {
  chartRef.value?.export()
}
</script>

<template>
  <VueFrappe ref="chartRef" type="line" :labels="labels" :data-sets="dataSets" />
  <button type="button" @click="exportSvg">Export</button>
</template>
```

| Method              | Description                                    |
| ------------------- | ---------------------------------------------- |
| `chart`             | Underlying Frappe instance (or `null`)         |
| `createChart()`     | Force re-create from current props             |
| `update()`          | Push current data props into the chart         |
| `export()`          | Download SVG (Frappe built-in)                 |
| `addDataPoint()`    | Append a point                                 |
| `removeDataPoint()` | Remove a point by index                        |
| `updateDataset()`   | Replace one dataset’s values                   |
| `destroy()`         | Tear down (also runs automatically on unmount) |

---

## Heatmap example

```vue
<script setup lang="ts">
const dataPoints: Record<string, number> = {
  '2024-01-15': 4,
  '2024-02-02': 2,
  '2024-06-18': 7,
}
</script>

<template>
  <VueFrappe
    type="heatmap"
    :data-points="dataPoints"
    :start-date="new Date('2024-01-01')"
    :end-date="new Date('2024-12-31')"
    count-label="Commits"
    :height="200"
    :colors="['#ebedf0', '#c6e48b', '#7bc96f', '#239a3b', '#196127']"
  />
</template>
```

---

## Tooling

| Script                  | Purpose                                        |
| ----------------------- | ---------------------------------------------- |
| `npm run preflight`     | Full pre-commit checklist (`bin/preflight.sh`) |
| `npm run build`         | Typecheck + Vite library build                 |
| `npm test`              | Vitest (happy-dom)                             |
| `npm run test:coverage` | Coverage with thresholds                       |
| `npm run typecheck`     | `vue-tsc --noEmit`                             |
| `npm run lint`          | ESLint flat config                             |
| `npm run format`        | Prettier                                       |
| `npm run size`          | `size-limit` budget on the ESM bundle          |

Pre-commit hooks run `lint-staged` (ESLint + Prettier) via `simple-git-hooks`.  
Before a PR or release, run **`npm run preflight`**.

---

## Upgrading

vue-frappe follows [Semantic Versioning](https://semver.org) and increments versions as `MAJOR.MINOR.PATCH`.

- **Major** versions may contain breaking changes — follow the [upgrade guide](.github/UPGRADE.md).
- **Minor** and **patch** versions should never contain breaking changes.

Release notes live on the [GitHub Releases](https://github.com/austintoddj/vue-frappe/releases) page (created automatically when you push a `v*` tag).

---

## Contributing

Thank you for considering contributing to vue-frappe! The [contribution guide can be found here](.github/CONTRIBUTING.md).

```bash
npm install
npm run preflight
```

---

## License

vue-frappe is open-sourced software licensed under the [MIT license](license).
