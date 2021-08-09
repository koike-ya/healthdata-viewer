const express = require('express')
const mongo = require('./mongo')
const axios = require('axios');
const fetchFromOura = require('./fetchFromOura');
const util = require('./util')

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
  console.log(`accessToken: ${accessToken}`)
  res.send({'access_token': accessToken})
})

app.get('/fetchToken', async function(req, res) {
  res.header('Access-Control-Allow-Origin', '*');

  // codeがないときは、tokenがすでにあるかの問い合わせ
  if (!('code' in req.query)) {
    res.send('no code is provided')
    return
  }

  accessToken = await fetchFromOura.fetchAccessToken(req)
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
  const [oldest, newest] = await mongo.readOldestAndNewestTimestamp('sleep')
  console.log(`oldest: ${oldest}\nnewest: ${newest}`)

  let queryList = []
  if (oldest === null || newest === null) {
    queryList.push([start, end])
  } else {
    queryList = util.calculateURLQueryDates(start, end, util.formatDate(oldest), util.formatDate(newest))
  }

  let data
  if (queryList !== []) {
    for (const [queryStart, queryEnd] of queryList) {
      const url = `https://api.ouraring.com/v1/sleep?start=${queryStart}&end=${queryEnd}`
      console.log(url)
      const ouraRes = await axios.get(url, {
        headers: authHeaders
      })
      data = ouraRes.data.sleep
      data.forEach((row) => {
        row.summary_date = util.parseDate(row.summary_date)
      })
      if (data.length) {
        await mongo.insertData('sleep', data).catch(console.dir)
      }
    }
  }
  filter = { summary_date: { $gte: util.parseDate(start), $lte: util.parseDate(end) }}
  data = await mongo.readWithFilter('sleep', filter)
  console.log(`data length: ${data.length}`)
  res.send(data)
  
})
