## vue-frappe

[![npm version](https://badge.fury.io/js/vue-frappe.svg)](https://badge.fury.io/js/vue-frappe) [![GitHub license](https://img.shields.io/github/license/austintoddj/vue-frappe)](https://github.com/austintoddj/vue-frappe/blob/master/license)

## Introduction

This package provides a Vue wrapper component for the popular [Frappe Charts](https://frappe.io/charts) library. 

## Usage

Install the package via [npm](https://www.npmjs.com/get-npm):

```bash
npm install vue-frappe
```

Import and use the component:

```es6
<template>
    <vue-frappe
        id="chart"
        title="A statistical chart"
        type="axis-mixed"
        :labels="[
            '12am-3am', '3am-6am', '6am-9am', '9am-12pm',
            '12pm-3pm', '3pm-6pm', '6pm-9pm', '9pm-12am'
        ]"
        :height="250"
        :colors="['#03a87c', '#ffa3ef']"
        :dataSets="this.data">
    </vue-frappe>
</template>

<script>
import { VueFrappe } from 'vue-frappe'

export default {
    components: {
        VueFrappe
    }

    data() {
        return {
            data: [
                {
                    name: 'Bar Chart', 
                    chartType: 'bar',
                    values: [25, 40, 30, 35, 8, 52, 17, -4]
                },
                {
                    name: 'Line Chart',
                    chartType: 'line',
                    values: [25, 50, -10, 15, 18, 32, 27, 14]
                }
            ]
        };
    }
};
</script>
```

## License

This package is open-sourced software licensed under the [MIT license](https://github.com/austintoddj/vue-frappe/blob/master/license).

## Credits

- Thanks to [Steve McDougall](https://twitter.com/@JustSteveKing) and his package [vue2-frappe](https://github.com/JustSteveKing/vue2-frappe)
