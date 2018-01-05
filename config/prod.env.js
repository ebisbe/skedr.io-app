const API_HOST = `mumktf5fmf.execute-api.eu-west-1.amazonaws.com`
const API_DOMAIN = `https://${API_HOST}`
const API_BASE_URL = `/production/`
module.exports = {
  NODE_ENV: '"production"',
  FLICKR_KEY: '"78ab8d949e94be81d67730224abbcdb1"',
  API_HOST: `"${API_HOST}"`,
  API_DOMAIN: `"${API_DOMAIN}"`,
  API_URL: `"${API_DOMAIN}${API_BASE_URL}"`,
  API_BASE_URL: `"${API_BASE_URL}"`,
  REGION: `"eu-west-1"`,
  USER_POOL_ID: `"eu-west-1_bz5icVezY"`,
  CLIENT_ID: `"7am49mtfubbsfu6eb77ba83fu"`,
  IDENTITY_POOL_ID: `"eu-west-1:83ea92ea-6d14-400d-9fc1-1521ae6e130a"`,
  GA: `"UA-53011336-4"`
}
