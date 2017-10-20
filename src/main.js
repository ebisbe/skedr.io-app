// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import axios from 'axios'
import Axios from 'vue-axios'
import router from './router'
import Vuetify from 'vuetify'
import store from './store'
import MyFetch from './components/MyFetch'

import('../node_modules/vuetify/dist/vuetify.min.css')

axios.defaults.baseURL = 'http://localhost:3000/'

Vue.use(Vuetify)
Vue.use(Axios, axios)
Vue.config.productionTip = false

Storage.prototype.setObject = function (key, value) {
  this.setItem(key, JSON.stringify(value))
}

Storage.prototype.getObject = function (key) {
  let value = this.getItem(key)
  return value && JSON.parse(value)
}

Vue.component('MyFetch', MyFetch)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: {App}
})
