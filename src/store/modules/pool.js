export default {
  namespaced: true,
  state: {
    photos: []
  },
  getters: {
    length({ photos }) {
      return photos.length
    },
    inPool({ photos }) {
      return photoId => {
        return photos.findIndex(photo => photo.photoId === photoId) >= 0
      }
    },
    isEmpty({ photos }) {
      return photos.length === 0
    }
  },
  mutations: {
    add({ photos }, photo) {
      photos.push(photo)
    },
    remove({ photos }, photoId) {
      const index = photos.findIndex(photo => photo.photoId === photoId)
      photos.splice(index, 1)
    },
    clear({ photos }) {
      photos.splice(0, photos.length)
    }
  },
  actions: {
    load({ commit }, photos) {
      if (photos instanceof Array) {
        photos.forEach(photo => commit('add', photo))
      }
    },
    add({ commit, getters, dispatch }, photo) {
      if (!getters.inPool(photo.photoId)) {
        commit('add', photo)
        dispatch('savePool')
      }
    },
    remove({ commit, getters, dispatch }, photoId) {
      if (getters.inPool(photoId)) {
        commit('remove', photoId)
        dispatch('savePool')
      }
    },
    clearPool({ commit, dispatch }) {
      commit('clear')
      dispatch('savePool')
    },
    savePool({ state }) {
      localStorage.setObject('pool.photos', state.photos)
    }
  }
}
