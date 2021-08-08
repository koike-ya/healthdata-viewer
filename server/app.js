const express = require('express')
const mongo = require('./mongo')
const axios = require('axios');
const fetchAccessToken = require('./fetchAccessToken')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Response')
})

app.get('/isTokenExists', async function(req, res) {
  res.header('Access-Control-Allow-Origin', '*');

  const accessToken = await mongo.readAccessToken()
  res.send({'access_token': accessToken})
})

app.get('/fetchToken', async function(req, res) {
  res.header('Access-Control-Allow-Origin', '*');

  // codeがないときは、tokenがすでにあるかの問い合わせ
  if (!('code' in req.query)) {
    res.send('no code is provided')
    return
  }

  accessToken = await fetchAccessToken.fetchAccessToken(req)
  if (accessToken) {
    await mongo.insertAccessToken(accessToken).catch(console.dir)
  }
  console.log(accessToken)
  res.send({'access_token': accessToken})
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

app.get('/sleep', async function(req, res) {
  res.header('Access-Control-Allow-Origin', '*');

  const token = await mongo.readAccessToken()
  const authHeaders = {'Authorization': `Bearer ${token}`}
  const start = req.query.start
  const end = req.query.end
  // const [oldest, newest] = await mongo.readOldestAndNewestTimestamp('sleep')
  const [queryStart, queryEnd] = [start, end]
  const url = `https://api.ouraring.com/v1/sleep?start=${queryStart}&end=${queryEnd}`
  console.log(url)
  const ouraRes = await axios.get(url, {
    headers: authHeaders
  })
  // mongo.insertData('sleep', ouraRes.data.sleep)
  res.send(ouraRes.data)
})
