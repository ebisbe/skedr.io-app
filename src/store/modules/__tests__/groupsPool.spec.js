import { state as baseState, getters, mutations } from '../groupsPool'

describe('Groups Pool', () => {
  let state
  beforeEach(() => {
    state = baseState
  })

  describe('getters', () => {
    it('returns the length of the pool', () => {
      state.groups = { groupId1: {}, groupId2: {} }
      expect(getters.total(state)).toBe(2)
    })

    it('gets the ordered array of groups by title', () => {
      state.groups = { g1: { title: 'Aca' }, g2: { title: 'abc' }, g3: { title: 'aba' } }
      expect(getters.orderByTitle(state)).toMatchObject([{ title: 'aba' }, { title: 'abc' }, { title: 'Aca' }])
    })

    it('checks if there are items in the pool', () => {
      expect(getters.hasItems(state, { total: 1 })).toBe(true)
    })

    it('gets a ordered list of groups by title', () => {
      const relGetters = { orderByTitle: [{ title: 'aba' }, { title: 'abc' }, { title: 'Aca' }] }
      expect(getters.list(state, relGetters)).toBe('aba, abc, Aca')
    })

    it('checks if a group is already added', () => {
      state.groups = { g1: {} }
      expect(getters.inPool(state)('g1')).toBe(true)
      expect(getters.inPool(state)('g2')).toBe(false)
    })
  })
  describe('mutations', () => {
    it('adds a non existing group', () => {
      mutations.add(state, { id: 'g1' })
      expect(state.groups['g1']).toMatchObject({ id: 'g1' })
    })

    it('removes a existing group', () => {
      state.groups.g1 = { id: 'g1' }
      mutations.remove(state, 'sg1')
      expect(state.groups).toMatchObject({})
    })

    it('clears the existing pool', () => {
      state.groups.g1 = { id: 'g1' }
      mutations.clear(state)
      expect(state.groups).toMatchObject({})
    })
  })
})
