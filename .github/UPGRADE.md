# Upgrade Guide

vue-frappe follows [Semantic Versioning](https://semver.org) (`MAJOR.MINOR.PATCH`).

- **Major** versions may contain breaking changes — follow this guide.
- **Minor** and **patch** versions should not contain breaking changes.

## Table of Contents

- [Upgrading to 2.0.0 from 1.x](#upgrading-to-200-from-1x)

## Upgrading to 2.0.0 from 1.x

> **Important:** 2.0 is a **breaking release** (Vue 3 only, built distribution, peer dependencies).

### 1. Install peers and the new package

```bash
npm install vue-frappe@^2 frappe-charts@^1.6 vue@^3
# or: yarn add vue-frappe@^2 frappe-charts@^1.6 vue@^3
# or: pnpm add vue-frappe@^2 frappe-charts@^1.6 vue@^3
```

`vue` and `frappe-charts` are **peer dependencies** — they are no longer bundled for you.

### 2. Vue 3 only

Vue 2 is not supported. Migrate the host app to Vue 3 first if needed.

### 3. Imports

Default and named imports still work:

```ts
import VueFrappe from 'vue-frappe'
// or
import { VueFrappe, VueFrappePlugin } from 'vue-frappe'
```

Optional global registration:

```ts
import { createApp } from 'vue'
import { VueFrappePlugin } from 'vue-frappe'

createApp(App).use(VueFrappePlugin).mount('#app')
// custom name: .use(VueFrappePlugin, { name: 'VChart' })
```

### 4. API changes

| v1                       | v2                                           |
| ------------------------ | -------------------------------------------- |
| Vue 2 Options API        | Vue 3 (`<script setup>` friendly)            |
| Raw `src/` on npm        | Built `dist/` (ESM + CJS + `.d.ts`)          |
| `id` required for mount  | `id` optional; mounts on a DOM ref           |
| `unbindWindowEvents()`   | Prefer `destroy()` (Frappe’s real API)       |
| Prop changes often no-op | `chart.update()` runs on data/option changes |

### 5. Behavior fixes you get “for free”

- Prop watchers call `chart.update()` (v1 built data and dropped it).
- Per-instance debounce timers (no module-level leak).
- Chart `destroy()` and container cleanup on unmount.

### 6. Verify

```bash
# in this repo, or run your app’s typecheck / smoke render
npm run preflight
```

Release notes for each tag are on the [GitHub Releases](https://github.com/austintoddj/vue-frappe/releases) page.
