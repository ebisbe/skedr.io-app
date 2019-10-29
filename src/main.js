require('intersection-observer')
import Vue from 'vue'
const isProd = process.env.NODE_ENV === 'production'

import vuetify from './plugins/vuetify'
import './plugins/errorLoggin'
import apolloProvider from './plugins/apolloProvider'
import aws_exports from './plugins/aws-exports'
import i18n from './plugins/i18n'

import App from './App'
import router from './router'
import store from './store'
import VueAnalytics from 'vue-analytics'
import Amplify from '@aws-amplify/core'

// import API so Amplify can configure it on load
import API from '@aws-amplify/api'
Amplify.configure(aws_exports)
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
  vuetify,
  i18n,
  apolloProvider,
  render: h => h(App)
}).$mount('#app')
