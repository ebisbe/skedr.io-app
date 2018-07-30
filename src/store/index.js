import Vue from 'vue'
import Vuex from 'vuex'

import modules from './modules'
Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'
const store = new Vuex.Store({
  modules,
  strict: debug,
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
