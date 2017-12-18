var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

const API_HOST = `localhost:1337`
const API_DOMAIN = `http://${API_HOST}`
const API_BASE_URL = `/`
module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  API_HOST: `"${API_HOST}"`,
  API_DOMAIN: `"${API_DOMAIN}"`,
  API_URL: `"${API_DOMAIN}${API_BASE_URL}"`,
})
