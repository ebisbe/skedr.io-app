export const state = {
  photos: []
}

export const getters = {
  hasItems({ photos }) {
    return photos.length > 0
  },
  photoIds({ photos }) {
    return photos.map(({ id }) => id)
  }
}

export const mutations = {
  add({ photos }, photo) {
    photos.push(photo)
  },
  clear({ photos }) {
    photos.splice(0, photos.length)
  }
}

export const actions = {
  share({ commit }, { photos }) {
    commit('clear')
    photos.forEach(photo => commit('add', photo))
  },
  clear({ commit }) {
    commit('clear')
  }
}
