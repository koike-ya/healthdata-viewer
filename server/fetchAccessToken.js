const axios = require('axios');

exports.fetchAccessToken = async function(req) {
  const baseUrl = 'https://cloud.ouraring.com'
  const url = `${baseUrl}/oauth/token`
  let body = new URLSearchParams();
  body.append('grant_type', 'authorization_code')
  body.append('code', req.query.code)
  body.append('client_id', process.env.OURA_CLIENT_ID)
  body.append('client_secret', process.env.OURA_CLIENT_SECRET)

  try {
    const accessTokenRes = await axios.post(url, body)
    // const accessTokenRes = { data: { access_token: 'sample token' }}
    if ('access_token' in accessTokenRes.data) {
      return accessTokenRes.data.access_token
    }
  } catch (error) {
    console.error(error);
  }
}