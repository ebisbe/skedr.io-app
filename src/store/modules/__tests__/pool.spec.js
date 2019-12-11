import { state as baseState, getters, mutations } from '../pool'

describe('Pool', () => {
  let state
  beforeEach(() => {
    state = baseState
  })

  describe('getters', () => {
    it('returns the length of the pool', () => {
      const relGetters = { ids: ['groupId1', 'groupId2'] }
      expect(getters.total(state, relGetters)).toBe(2)
    })

    it('gets the ordered array of groups by title', () => {
      state.pool = {
        g1: { title: 'Aca' },
        g2: { title: 'abc' },
        g3: { title: 'aba' },
        g4: { noTitle: 'noTitle' }
      }
      expect(getters.orderByTitle(state)).toMatchObject([
        { noTitle: 'noTitle' },
        { title: 'aba' },
        { title: 'abc' },
        { title: 'Aca' }
      ])
    })

    it('checks if there are items in the pool', () => {
      expect(getters.hasItems(state, { total: 1 })).toBe(true)
    })

    it('gets a ordered list of groups by title', () => {
      const relGetters = {
        orderByTitle: [
          {
            title: 'aba'
          },
          {
            title: 'abc'
          },
          {
            title: 'Aca'
          },
          {
            noTitle: 'noTitle'
          }
        ]
      }
      expect(getters.list(state, relGetters)).toBe('aba, abc, Aca')
    })

    it('checks if a group is already added', () => {
      state.pool = { g1: {} }
      expect(getters.inPool(state)('g1')).toBe(true)
      expect(getters.inPool(state)('g2')).toBe(false)
    })

    it('gets the id lists', () => {
      state.pool = { g1: {}, g2: {} }
      expect(getters.ids(state)).toMatchObject(['g1', 'g2'])
    })

    it('gets the items lists', () => {
      state.pool = { g1: { id: 'g1' }, g2: { id: 'g2' } }
      expect(getters.items(state)).toMatchObject([{ id: 'g1' }, { id: 'g2' }])
    })
  })
  describe('mutations', () => {
    it('adds a group', () => {
      mutations.add(state, { id: 'g1', item: { id: 'g1' } })
      expect(state.pool['g1']).toMatchObject({ id: 'g1' })
    })

    it('removes a group', () => {
      state.pool.g1 = { id: 'g1' }
      mutations.remove(state, 'sg1')
      expect(state.pool).toMatchObject({})
    })

    it('clears the pool', () => {
      state.pool.g1 = { id: 'g1' }
      mutations.clear(state)
      expect(state.pool).toMatchObject({})
    })
  })
})
