<template>
  <div class="sleep">
    <datepicker v-model="startDate" :format="datePickerFormat" name="startDate" placeholder="Select Start Date"></datepicker>
    〜
    <datepicker v-model="endDate" :format="datePickerFormat" name="endDate" placeholder="Select End Date"></datepicker>
    <line-chart :chart-data="dataCollection"></line-chart>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data () {
    return {
      dataCollection: null,
      startDate: null,
      endDate: null,
      datePickerFormat: 'yyyy-MM-dd'
    }
  },
  created () {
    this.fillData()
  },
  watch: {
    startDate: function (val) {
      this.fillData()
    },
    endDate: function (val) {
      this.fillData()
    }
  },
  methods: {
    async fillData () {
      if (!(this.startDate && this.endDate)) { return }

      const summaryDates = []
      const scores = []
      const backendUrl = 'http://localhost:3000'
      const url = `${backendUrl}/sleep?start=${this.formatDate(this.startDate)}&end=${this.formatDate(this.endDate)}`

      const sleepRes = await axios.get(url)
      if (sleepRes.data.sleep) {
        const sleepData = sleepRes.data.sleep
        for (const one of sleepData) {
          summaryDates.push(one.summary_date)
          scores.push(one.score)
        }
      }
      this.dataCollection = {
        labels: summaryDates,
        datasets: [
          {
            label: 'sleep score',
            backgroundColor: '#f87979',
            data: scores
          }
        ]
      }
    },
    formatDate (dt) {
      var y = dt.getFullYear()
      var m = ('00' + (dt.getMonth() + 1)).slice(-2)
      var d = ('00' + dt.getDate()).slice(-2)
      return (y + '-' + m + '-' + d)
    },
    pickDates () {
      const now = new Date()
      const daysBefore = 31
      this.startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - daysBefore, 0, 0, 0)
      this.endDate = now
    }
  }
}
</script>

<style>
.sleep {
  margin: 5% 10%;
}
</style>
