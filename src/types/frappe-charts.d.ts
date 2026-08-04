/**
 * Minimal ambient types for frappe-charts (upstream ships none).
 * Public API types live in `src/types/index.ts` and are exported from the package.
 */
declare module 'frappe-charts' {
  export class Chart {
    constructor(parent: string | HTMLElement, options: Record<string, unknown>)
  }
}

declare module 'frappe-charts/dist/frappe-charts.min.esm' {
  export { Chart } from 'frappe-charts'
}

declare module 'frappe-charts/dist/frappe-charts.esm' {
  export { Chart } from 'frappe-charts'
}
