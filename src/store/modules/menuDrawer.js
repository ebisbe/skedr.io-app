export const state = {
  isVisible: false
}

export const mutations = {
  toggle: state => {
    state.isVisible = !state.isVisible
  },
  set: (state, newValue) => {
    state.isVisible = newValue
  }
}
