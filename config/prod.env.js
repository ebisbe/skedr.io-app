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
  GA: `"UA-53011336-4"`,
  API_NAME: `"production-skedr-api"`
}
