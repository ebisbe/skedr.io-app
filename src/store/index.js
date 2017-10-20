let _ = require('lodash')
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    rightDrawer: false,
    pool: [],
    groups: [],
    selectedGroups: 0,
    token: ''
  },
  mutations: {
    loadPool (state, payload) {
      state.pool = payload.photos
    },
    addToPool (state, payload) {
      if (payload.add) {
        state.pool.unshift(payload.photo)
        state.pool = _.uniqBy(state.pool, 'id')
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
    updateRightDrawer (state, message) {
      state.rightDrawer = message
    }
  },
  getters: {
    activeFab (state, getter) {
      if (getter.addingPhotosToGroup) {
        return {'class': 'deep-orange', icon: 'add_to_photos', html: 'Add photos to group'}
      } else {
        return {'class': 'deep-purple', icon: 'add_a_photo', html: 'Search photos'}
      }
    },
    addingPhotosToGroup (state) {
      return state.selectedGroups > 0
    }
  }
})
