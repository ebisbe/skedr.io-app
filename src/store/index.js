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
    search: '',
    photostream: {
      itemsPerPage: 6,
      offset: 6,
      showMoreEnabled: true
    }
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
    incrementOffset({ photostream }, { increment }) {
      photostream.offset = photostream.offset + increment
    },
    disableShowMore({ photostream }) {
      photostream.showMoreEnabled = false
    }
  },
  actions: {
    windowSize({ commit }, payload) {
      commit('window', payload)
    },
    updateRightDrawer({ commit }, payload) {
      commit('updateRightDrawer', payload)
    },
    showMore({ commit }, payload) {
      commit('incrementOffset', payload)
    },
    showMoreButtonStatus({ commit }, { length }) {
      if (length === 0) {
        commit('disableShowMore')
      }
    }
  }
})

export default store
