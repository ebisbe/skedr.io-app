import uniqBy from 'lodash/uniqby'
import Vue from 'vue'
import Vuex from 'vuex'
import createLogger from 'vuex/dist/logger'
import cognitoConfig from './cognito'
import CognitoAuth from 'vue-auth-cognito'

import pool from './modules/pool'
import sharedPool from './modules/sharedPool'
//import pageLoader from './modules/pageLoader'
Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'
const devenv = process.env.NODE_ENV === 'dev'

export default new Vuex.Store({
  modules: {
    cognito: new CognitoAuth(cognitoConfig),
    pool,
    sharedPool
  },
  strict: debug,
  plugins: devenv ? [createLogger()] : [],
  state: {
    rightDrawer: window.innerWidth > 1260,
    window: {
      width: window.innerWidth,
      height: window.innerHeight
    },
    pageTitle: '',
    token: '',
    search: ''
  },
  mutations: {
    updateRightDrawer(state, message) {
      state.rightDrawer = message
    },
    updateSearch(state, value) {
      state.search = value.toLowerCase()
    },
    setPageTitle(state, value) {
      state.pageTitle = `Beta - ${value}`
    },
    window({ window }, payload) {
      window.width = payload.width
      window.height = payload.height
    }
  },
  getters: {
    userId(state) {
      return decodeURIComponent(state.cognito.user.username)
    },
    fullScreenDialog({ window }) {
      return window.width < 550
    },
    extendedToolbar({ window }) {
      return window.width < 900
    }
  },
  actions: {
    windowSize({ commit }, payload) {
      commit('window', payload)
    }
  }
})
