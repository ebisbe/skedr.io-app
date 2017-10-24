// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import VueAxios from 'vue-axios'
import Photo from './components/Photo.vue'
import store from './store'
import Notifications from 'vue-notification'
import velocity from 'velocity-animate'
import Vuetify from 'vuetify'

import('../node_modules/vuetify/dist/vuetify.min.css')

Vue.use(Vuetify)
Vue.use(Notifications, {velocity})
Vue.use(VueAxios, axios)
Vue.config.productionTip = false
Vue.component('photo', Photo)

Storage.prototype.setObject = function (key, value) {
  this.setItem(key, JSON.stringify(value))
}

Storage.prototype.getObject = function (key) {
  let value = this.getItem(key)
  return value && JSON.parse(value)
}

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (localStorage.getItem('token') === '') {
      next({
        path: '/login',
        query: {redirect: to.fullPath}
      })
    }
  }
  next()
})

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
      store.commit('loadPool', {
        photos: photos
      })
    }
    this.$store.state.token = localStorage.getItem('token')
  }
})
