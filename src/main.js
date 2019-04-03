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
import Amplify from '@aws-amplify/core';

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
  apolloProvider,
  beforeCreate() {
    store.dispatch('pool/load', localStorage.getObject('pool.photos'))
  },
  render: h => h(App)
}).$mount('#app')
