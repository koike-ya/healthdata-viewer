<template>
  <div class="home">
    <button v-show="token === null" v-on:click="connectToOura">Ouraと連携する</button>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'Home',
  data: function () {
    return {
      sleepData: null,
      token: null,
      isTokenExists: false
    }
  },
  created: async function () {
    const backendUrl = 'http://localhost:3000'

    const isTokenExists = await axios.get(`${backendUrl}/isTokenExists`)
    if (isTokenExists.data.access_token) {
      const accessToken = isTokenExists.data.access_token
      this.token = accessToken
      this.$router.replace('sleep') // この後もコードは実行される
      return
    }

    const code = this.extractQueryValueFromURI('code')
    if (code) {
      const backendUrl = 'http://localhost:3000'
      const res = await axios.get(`${backendUrl}/fetchToken?code=${code}`)
      const accessToken = res.data.access_token
      this.token = accessToken
      this.$router.replace('sleep') // この後もコードは実行される
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
