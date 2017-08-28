let _ = require('lodash')
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    pool: [],
    poolVisible: false
  },
  mutations: {
    loadPool (state, payload) {
      state.pool = payload.photos
    },
    addToPool (state, payload) {
      if (payload.add) {
        state.pool.unshift(payload.photo)
        state.pool = _.uniq(state.pool)
      } else {
        state.pool = _.filter(state.pool, function (o) { return o.id !== payload.photo.id })
      }
      localStorage.setObject('pool.photos', state.pool)
    },
    removeFromPool (state, payload) {
      state.pool = _.filter(state.pool, function (o) { return o.id !== payload.photo.id })
      localStorage.setObject('pool.photos', state.pool)
    },
    clearPool (state) {
      state.pool = []
      localStorage.setObject('pool.photos', [])
    },
    togglePoolVisibility (state) {
      state.poolVisible = !state.poolVisible
    }
  }
})
