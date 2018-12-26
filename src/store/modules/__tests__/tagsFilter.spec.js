import { getters, mutations } from '../tagsFilter'
describe('tags Filter store', () => {
  describe('mutations', () => {
    it('adds a non existing tag', () => {
      const state = { items: {} }
      mutations.upsert(state, 'tag')
      expect(state.items['tag']).toBe(true)
    })
    it('removes a existing tag', () => {
      const state = { items: { tag: true } }
      mutations.upsert(state, 'tag')
      expect(state.items['tag']).toBe(false)
    })
    it('clears the state', () => {
      const state = { items: { tag: true, tag2: true } }
      mutations.clear(state)
      expect(state.items).toMatchObject({})
    })
  })

  describe('getters', () => {
    it('checks that is empty', () => {
      const state = { items: { tag: false } }
      expect(getters.isEmpty(state)).toBe(true)
    })
  })
})
