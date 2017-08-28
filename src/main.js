// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import VueAxios from 'vue-axios'
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import Photo from './components/Photo.vue'
import store from './store'

axios.defaults.baseURL = 'http://localhost:3000/'
Vue.use(VueAxios, axios)
Vue.use(BootstrapVue)
Vue.config.productionTip = false
Vue.component('photo', Photo)

Storage.prototype.setObject = function (key, value) {
  this.setItem(key, JSON.stringify(value))
}

Storage.prototype.getObject = function (key) {
  let value = this.getItem(key)
  return value && JSON.parse(value)
}

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: {App},
  created () {
    let photos = localStorage.getObject('pool.photos')
    if (photos !== null) {
      store.commit('loadPool', {
        photos: photos
      })
    }
  }
})
