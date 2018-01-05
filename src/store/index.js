let _ = require('lodash')
import Vue from 'vue'
import Vuex from 'vuex'
import createLogger from 'vuex/dist/logger'
import cognitoConfig from './cognito'
import CognitoAuth from 'vue-auth-cognito'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'
const devenv = process.env.NODE_ENV === 'dev'

export default new Vuex.Store({
  modules: {
    cognito: new CognitoAuth(cognitoConfig)
  },
  strict: debug,
  plugins: devenv ? [createLogger()] : [],
  state: {
    rightDrawer: window.innerWidth > 1260,
    pageTitle: '',
    pool: [],
    token: '',
    search: '',
    sharePool: [],
    position: 0
  },
  mutations: {
    loadPool (state, payload) {
      state.pool = payload.photos
    },
    addToPool (state, payload) {
      if (payload.add) {
        state.pool.push(payload.photo)
        state.pool = _.uniqBy(state.pool, 'id')
      } else {
        state.pool = _.filter(state.pool, function (o) { return o.id !== payload.photo.id })
      }
      localStorage.setObject('pool.photos', state.pool)
    },
    clearPool (state) {
      state.pool = []
      localStorage.setObject('pool.photos', [])
    },
    updateRightDrawer (state, message) {
      state.rightDrawer = message
    },
    updateSearch (state, value) {
      state.search = value.toLowerCase()
    },
    setPageTitle (state, value) {
      state.pageTitle = value
    },
    showDialog (state, value) {
      state.sharePool = value
    },
    hideDialog (state) {
      state.sharePool = []
    }
  },
  getters: {
    userId (state) {
      return decodeURIComponent(state.cognito.user.username)
    },
    isDesktop () {
      return window.innerWidth > 1260
    }
  }
})
