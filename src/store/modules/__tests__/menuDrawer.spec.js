import { state as baseState, mutations } from '../menuDrawer'

describe('Vuex - menuDrawer store', () => {
  let state
  beforeEach(() => {
    state = { ...baseState }
  })
  it('toggles the state', () => {
    expect(state.isVisible).toBe(false)
    mutations.toggle(state)
    expect(state.isVisible).toBe(true)
  })
  it('sets the state', () => {
    expect(state.isVisible).toBe(false)
    mutations.set(state, true)
    expect(state.isVisible).toBe(true)
  })
})
