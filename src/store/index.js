import Vue from 'vue'
import Vuex from 'vuex'

import modules from './modules'
Vue.use(Vuex)
import LogRocket from 'logrocket'
import createPlugin from 'logrocket-vuex'

const logrocketPlugin = createPlugin(LogRocket)
const debug = process.env.NODE_ENV !== 'production'

const store = new Vuex.Store({
  modules,
  plugins: [logrocketPlugin],
  strict: debug,
  state: {
    rightDrawer: window.innerWidth > 1260,
    window: {
      width: window.innerWidth,
      height: window.innerHeight
    },
    pageTitle: '',
    token: '',
    search: '',
    loading: 0
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
    },
    setLoading(state, value) {
      state.loading = value
    }
  },
  actions: {
    windowSize({ commit }, payload) {
      commit('window', payload)
    },
    updateRightDrawer({ commit }, payload) {
      commit('updateRightDrawer', payload)
    }
  }
})

export default store
