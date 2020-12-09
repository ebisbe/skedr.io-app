require('intersection-observer')
import Vue from 'vue'

import vuetify from './plugins/vuetify'
import './plugins/errorLoggin'
import apolloProvider from './plugins/apolloProvider'
import aws_exports from './plugins/aws-exports'
import i18n from './plugins/i18n'

import App from './App'
import router from './router'
import store from './store'
import Amplify from '@aws-amplify/core'

Amplify.configure(aws_exports)
Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  i18n,
  apolloProvider,
  render: h => h(App)
}).$mount('#app')
