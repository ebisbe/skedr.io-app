export const state = {
  photos: [],
  blockedGroups: []
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
  addGroups({ blockedGroups }, groups) {
    groups.forEach(group => blockedGroups.push(group.title))
  },
  clear({ photos, blockedGroups }) {
    photos.splice(0, photos.length)
    blockedGroups.splice(0, blockedGroups.length)
  }
}

export const actions = {
  share({ commit }, { photos, selectedGroups = [] }) {
    photos.forEach(photo => commit('add', photo))
    commit('addGroups', selectedGroups)
  },
  clear({ commit }) {
    commit('clear')
  }
}
