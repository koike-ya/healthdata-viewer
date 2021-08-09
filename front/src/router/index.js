import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import SleepChart from '../views/SleepChart.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: Home
  },
  {
    path: '/sleep',
    component: SleepChart
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router
