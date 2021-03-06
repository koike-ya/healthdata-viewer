import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { Line, mixins } from 'vue-chartjs'
import vuejsDatepicker from 'vuejs-datepicker'
const { reactiveProp } = mixins

Vue.config.productionTip = false

Vue.component('line-chart', {
  extends: Line,
  mixins: [reactiveProp],
  props: {
    chartData: {
      type: Object,
      default: null
    },
    options: {
      type: Object,
      default: null
    }
  },
  mounted () {
    this.renderChart(this.chartData, this.options)
  }
})

Vue.component('datepicker', vuejsDatepicker)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
