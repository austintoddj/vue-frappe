import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [
    vue(),
    dts({
      include: ['src/**/*.ts', 'src/**/*.vue', 'src/types/frappe-charts.d.ts'],
      exclude: ['src/shims-vue.d.ts'],
      outDir: 'dist',
      rollupTypes: true,
      tsconfigPath: './tsconfig.build.json',
      insertTypesEntry: true,
      copyDtsFiles: false,
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'VueFrappe',
      formats: ['es', 'cjs'],
      fileName: (format) => (format === 'es' ? 'vue-frappe.js' : 'vue-frappe.cjs'),
    },
    rollupOptions: {
      external: ['vue', 'frappe-charts', /^frappe-charts\//],
      output: {
        globals: {
          vue: 'Vue',
          'frappe-charts': 'frappe',
        },
        exports: 'named',
      },
    },
    sourcemap: true,
    minify: false,
    emptyOutDir: true,
  },
})
