// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import { ApolloClient } from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import VueApollo from 'vue-apollo'
import axios from 'axios'
import Axios from 'vue-axios'
import router from './router'
import Vuetify from 'vuetify'
import store from './store'
import MyFetch from './components/MyFetch'
import { authUser } from './libs/aws-lib'

require('./libs/storage')

import('../node_modules/vuetify/dist/vuetify.min.css')

Vue.use(Vuetify, {
  theme: {
    'primary': '#673AB7',
    'secondary': '#7E57C2',
    'accent': '#311B92',
    'error': '#F44336',
    'warning': '#ffeb3b',
    'info': '#2196F3',
    'success': '#4CAF50'
  }
})

Vue.use(Axios, axios)
Vue.config.productionTip = false

router.beforeEach(async (to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (store.state.cognito.user === null) {
      await store.dispatch('getCurrentUser')
        .then(() => authUser(store.state.cognito.user.tokens.IdToken))
        .catch(() => next({
          path: '/login',
          query: {redirect: to.fullPath}
        }))
    } else {
      authUser(store.state.cognito.user.tokens.IdToken)
    }
  }
  store.commit('setPageTitle', to.name)
  next()
})

const httpLink = new HttpLink({
  // You should use an absolute URL here
  uri: process.env.API_URL + 'graphql'
})

// Create the apollo client
const apolloClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
  connectToDevTools: true
})

const apolloProvider = new VueApollo({
  defaultClient: apolloClient
})

// Install the vue plugin
Vue.use(VueApollo)

Vue.component('MyFetch', MyFetch)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  apolloProvider,
  template: '<App/>',
  components: {App},
  beforeCreate () {
    let photos = localStorage.getObject('pool.photos')
    if (photos !== null) {
      store.commit('loadPool', {photos: photos})
    }
  }
})
