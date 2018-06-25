import { getters, mutations, actions } from '@/store/modules/sharedPool'

describe('sharedPool', () => {
  describe('getters', () => {
    it('shared pool is empty', () => {
      const state = {
        photos: []
      }

      expect(getters.hasItems(state)).toBe(false)
    })

    it('shared pool has 2 items', () => {
      const state = {
        photos: [1, 2]
      }

      expect(getters.hasItems(state)).toBe(true)
    })
  })

  describe('mutations', () => {
    it('adds photo', () => {
      const state = {
        photos: []
      }

      expect(state.photos.length).toBe(0)
      mutations.add(state, { photoId: 1 })
      expect(state.photos.length).toBe(1)
    })

    it('adds a group', () => {
      const state = {
        selectedGroups: []
      }

      expect(state.selectedGroups.length).toBe(0)
      mutations.addToGroup(state, { title: 'group 1' })
      expect(state.selectedGroups.length).toBe(1)
      expect(state.selectedGroups[0]).toBe('group 1')
    })

    it('clears the state', () => {
      const state = {
        photos: [1, 2, 3],
        selectedGroups: [1, 2, 3]
      }

      expect(state.photos.length).toBe(3)
      expect(state.selectedGroups.length).toBe(3)
      mutations.clear(state)
      expect(state.photos.length).toBe(0)
      expect(state.selectedGroups.length).toBe(0)
    })
  })

  describe('Actions', () => {
    it('loads a shared pool', () => {
      const state = {
        photos: [],
        selectedGroups: [],
        commit: jest.fn()
      }

      actions.share(state, {
        photos: [{ photoId: 1 }, { photoId: 2 }],
        selectedGroups: [{ groupId: 1 }, { groupId: 2 }]
      })

      expect(state.commit).toHaveBeenCalledTimes(4)
      expect(state.commit).toHaveBeenNthCalledWith(1, 'add', { photoId: 1 })
      expect(state.commit).toHaveBeenNthCalledWith(2, 'add', { photoId: 2 })
      expect(state.commit).toHaveBeenNthCalledWith(3, 'addToGroup', { groupId: 1 })
      expect(state.commit).toHaveBeenNthCalledWith(4, 'addToGroup', { groupId: 2 })
    })

    it('clears the pool', () => {
      const state = {
        commit: jest.fn()
      }

      actions.clear(state)

      expect(state.commit).toHaveBeenCalledTimes(1)
      expect(state.commit).toHaveBeenCalledWith('clear')
    })
  })
})
