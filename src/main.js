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
import { AwsCredentials } from './libs/aws-lib'

require('./libs/storage')

import('../node_modules/vuetify/dist/vuetify.min.css')

const api = 'https://v6ztnk31r9.execute-api.eu-west-1.amazonaws.com/dev/'
// const api = 'http://localhost:1337/'
axios.defaults.baseURL = api

Vue.use(Vuetify)
Vue.use(Axios, axios)
Vue.config.productionTip = false

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
  store.commit('setPageTitle', to.name)
  next()
})

const httpLink = new HttpLink({
  // You should use an absolute URL here
  uri: api + 'graphql'
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
