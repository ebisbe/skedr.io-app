import uniqBy from 'lodash/uniqBy'
import Vue from 'vue'
import Vuex from 'vuex'
import createLogger from 'vuex/dist/logger'

import modules from './modules'
Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'
const devenv = process.env.NODE_ENV === 'dev'
import AmplifyStore from '../amplify/AmplifyStore'
export default new Vuex.Store({
  modules,
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
      state.pageTitle = `${value}`
    },
    window({ window }, payload) {
      window.width = payload.width
      window.height = payload.height
    }
  },
  getters: {
    userId({ cognito }) {
      return AmplifyStore.state.username
    }
  },
  actions: {
    windowSize({ commit }, payload) {
      commit('window', payload)
    }
  }
})
