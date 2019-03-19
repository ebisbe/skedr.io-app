require('intersection-observer')
import Vue from 'vue'
const isProd = process.env.NODE_ENV === 'production'

import './plugins/vuetify'
import './plugins/errorLoggin'
import apolloProvider from './plugins/apolloProvider'
import aws_exports from './plugins/aws-exports'

import App from './App'
import router from './router'
import store from './store'
import './libs/storage'
import VueAnalytics from 'vue-analytics'
import Amplify, { Auth, Logger } from 'aws-amplify'

Amplify.configure(aws_exports)
Amplify.Logger.LOG_LEVEL = isProd ? '' : '' // use DEBUG to show detailed logs from Amplify library
const logger = new Logger('main')
Auth.currentUserInfo()
  .then(user => logger.debug(user))
  .catch(err => logger.debug(err))


Vue.config.productionTip = false
Vue.use(VueAnalytics, {
  id: process.env.VUE_APP_GA,
  router,
  debug: {
    enabled: false,
    sendHitTask: isProd
  }
})

new Vue({
  router,
  store,
  apolloProvider,
  beforeCreate() {
    store.dispatch('pool/load', localStorage.getObject('pool.photos'))
  },
  render: h => h(App)
}).$mount('#app')
