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
import { AwsCredentials } from './store/aws-lib'

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

router.beforeEach(async (to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    await store.dispatch('getCurrentUser')
      .then(() => AwsCredentials(store.state.cognito.user.tokens.IdToken))
      .catch(() => console.log('Not logged. Redirect to Login page'))
      .then(() => { console.log('Get AWS credentials OK') })

    if (store.state.cognito.user === null) {
      next({
        path: '/login',
        query: {redirect: to.fullPath}
      })
    }
  }
  next()
})

Vue.component('MyFetch', MyFetch)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: {App},
  beforeCreate () {
    let photos = localStorage.getObject('pool.photos')
    if (photos !== null) {
      store.commit('loadPool', {photos: photos})
    }
  }
})
