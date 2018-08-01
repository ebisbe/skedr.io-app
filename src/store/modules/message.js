export const state = {
  stack: [],
  status: false,
  value: null
}

export const mutations = {
  add: ({ stack, value }, message) => {
    if (stack.indexOf(message) === -1 && value !== message) {
      stack.push(message)
    }
  },
  shift: state => (state.value = state.stack.shift()),
  switchStatus: (state, newStatus) => {
    state.status = newStatus
    if (!newStatus) state.value = null
  }
}

export const actions = {
  add: ({ commit, dispatch }, message) => {
    commit('add', message)
    dispatch('shift')
  },
  shift: ({ commit, state }) => {
    if (!state.status && state.stack.length > 0) {
      commit('shift')
      commit('switchStatus', true)
    }
  },
  switchStatus: ({ commit }, newStatus) => {
    commit('switchStatus', newStatus)
  }
}
