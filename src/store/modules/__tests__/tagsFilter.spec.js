import { state as baseState, getters, mutations } from '../tagsFilter'

describe('tags Filter store', () => {
  let state
  beforeEach(() => {
    state = baseState
  })

  describe('mutations', () => {
    it('adds a non existing tag', () => {
      mutations.upsert(state, 'tag')
      expect(state.items['tag']).toBe(true)
    })

    it('removes a existing tag', () => {
      state.items.tag = true
      mutations.upsert(state, 'tag')
      expect(state.items['tag']).toBe(false)
    })

    it('clears the state', () => {
      state.items = { tag: true, tag2: true }
      mutations.clear(state)
      expect(state.items).toMatchObject({})
    })
  })

  describe('getters', () => {
    it('checks that is empty', () => {
      state.items = { tag: false }
      expect(getters.isEmpty(state)).toBe(true)
    })
  })
})
