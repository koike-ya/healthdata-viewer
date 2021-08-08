<template>
  <div class="home">
    <button v-on:click="connectToOura">Ouraと連携する</button>
    <p>{{ routes }}</p>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'Home',
  components: {
  },
  data: function () {
    return {
      routes: undefined
    }
  },
  mounted: async function () {
    const code = this.extractQueryValueFromURI('code')
    if (code) {
      const backendUrl = 'http://localhost:3000'
      const res = await axios.get(`${backendUrl}/auth?code=${code}`)
      const accessToken = res.data.access_token
      console.log(accessToken)
    }
  },
  methods: {
    connectToOura: async function () {
      const baseUrl = 'https://cloud.ouraring.com'
      const url = `${baseUrl}/oauth/authorize?response_type=code&client_id=${process.env.VUE_APP_OURA_CLIENT_ID}`
      window.open(url, '_blank')
    },
    extractQueryValueFromURI: function (key) {
      const uri = window.location.href.split('?')
      if (uri.length === 2) {
        const params = uri[1].split('&')
        for (const p of params) {
          const list = p.split('=')
          if (list.length === 2 && list[0] === key) {
            return list[1]
          }
        }
      }
    }
  }
}
</script>

<style>
</style>
