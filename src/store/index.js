import uniqBy from 'lodash/uniqby'
import Vue from 'vue'
import Vuex from 'vuex'
import createLogger from 'vuex/dist/logger'
import cognitoConfig from './cognito'
import CognitoAuth from 'vue-auth-cognito'

import pool from './modules/pool'
import sharedPool from './modules/sharedPool'
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
    pageTitle: '',
    token: '',
    search: '',
    position: 0
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
    }
  },
  getters: {
    userId(state) {
      return decodeURIComponent(state.cognito.user.username)
    },
    isDesktop() {
      return window.innerWidth > 1260
    }
  }
})
