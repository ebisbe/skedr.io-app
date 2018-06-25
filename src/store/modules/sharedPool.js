export const state = {
  photos: [],
  selectedGroups: []
}

export const getters = {
  hasItems({ photos }) {
    return photos.length > 0
  }
}

export const mutations = {
  add({ photos }, photo) {
    photos.push(photo)
  },
  addToGroup({ selectedGroups }, group) {
    selectedGroups.push(group.title)
  },
  clear({ photos, selectedGroups }) {
    photos.splice(0, photos.length)
    selectedGroups.splice(0, selectedGroups.length)
  }
}

export const actions = {
  share({ commit }, { photos, selectedGroups = [] }) {
    photos.forEach(photo => commit('add', photo))
    selectedGroups.forEach(group => commit('addToGroup', group))
  },
  clear({ commit }) {
    commit('clear')
  }
}
