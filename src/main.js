// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import apolloProvider from './settings/apolloProvider'
import axios from 'axios'
import Axios from 'vue-axios'
import router from './router'
import vuetify from './settings/vuetify'
import store from './store'
import Raven from 'raven-js'
import RavenVue from 'raven-js/plugins/vue'
import VueAnalytics from 'vue-analytics'

if (process.env.NODE_ENV === 'production') {
  Raven.config('https://5c9619998ba541a597a037ece72dafab@sentry.io/266872')
    .addPlugin(RavenVue, Vue)
    .install()
  Vue.use(VueAnalytics, {
    id: process.env.GA,
    router
  })
}

require('devices.css/dist/devices.css')
require('./libs/storage')

axios.defaults.baseURL = process.env.API_URL
Vue.use(Axios, axios)
Vue.config.productionTip = false

/* eslint-disable no-new */
const root = new Vue({
  router,
  store,
  provide: apolloProvider.provide(),
  components: { App },
  beforeCreate() {
    store.dispatch('pool/load', localStorage.getObject('pool.photos'))
  },
  template: '<App/>'
})

document.addEventListener('DOMContentLoaded', () => {
  root.$mount('#app')
})
