const express = require('express')
const axios = require('axios');
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Response')
})

app.post('/', (req, res) => {
  res.send('Response')
})

app.get('/auth', async function(req, res) {
  res.header('Access-Control-Allow-Origin', '*');

  if (!('code' in req.query)) {
    res.send('no code provided.')
    return
  }

  const baseUrl = 'https://cloud.ouraring.com'
  const url = `${baseUrl}/oauth/token`
  let body = new URLSearchParams();
  body.append('grant_type', 'authorization_code')
  body.append('code', req.query.code)
  body.append('client_id', process.env.OURA_CLIENT_ID)
  body.append('client_secret', process.env.OURA_CLIENT_SECRET)

  try {
    const accessTokenRes = await axios.post(url, body)
    console.log(accessTokenRes.data);
    res.send({
      access_token: accessTokenRes.data.access_token
    })
  } catch (error) {
    console.error(error);
    res.send({
      error: error
    })
  }
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
