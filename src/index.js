import { Chart } from './components/Charts'

export default {
    install (Vue, options) {
        Vue.component('vue-frappe', Chart)
    }
}
