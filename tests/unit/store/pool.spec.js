import { getters, mutations, actions } from '@/store/modules/pool'

describe('Store pool.js', () => {
  describe('getters', () => {
    it('the pool is empty', () => {
      const state = { photos: [] }
      expect(getters.length(state)).toBe(0)
      expect(getters.isEmpty(state)).toBe(true)
    })

    it('the pool is not empty', () => {
      const state = {
        photos: [1, 2, 3]
      }
      expect(getters.length(state)).toBe(3)
      expect(getters.isEmpty(state)).toBe(false)
    })

    it('finds element in pool', () => {
      const state = {
        photos: [{ photoId: 1 }, { photoId: 2 }]
      }
      const wrapper = getters.inPool(state)
      expect(wrapper(2)).toBe(true)
    })

    it("don't finds element in pool", () => {
      const state = {
        photos: [{ photoId: 1 }, { photoId: 3 }]
      }
      const wrapper = getters.inPool(state)
      expect(wrapper(2)).toBe(false)
    })

    it('has a backup in pool', () => {
      const state = {
        backup: [{ photoId: 1 }, { photoId: 2 }]
      }
      const wrapper = getters.hasBackup(state)
      expect(wrapper).toBe(true)
    })

    it('backup is empty', () => {
      const state = {
        backup: []
      }
      const wrapper = getters.hasBackup(state)
      expect(wrapper).toBe(false)
    })
  })

  describe('mutations', () => {
    it('adds element to pool', () => {
      const state = {
        photos: []
      }
      expect(state.photos.length).toBe(0)
      mutations.add(state, { photoId: 1 })
      expect(state.photos.length).toBe(1)
    })

    it('removes element from pool', () => {
      const state = {
        photos: [{ photoId: 1 }]
      }
      expect(state.photos.length).toBe(1)
      mutations.remove(state, 1)
      expect(state.photos.length).toBe(0)
    })

    it('removes all elements from pool', () => {
      const state = {
        photos: [{ photoId: 1 }, { photoId: 2 }]
      }

      expect(state.photos.length).toBe(2)
      mutations.clear(state)
      expect(state.photos.length).toBe(0)
    })

    it('saves current pool as backup', () => {
      const state = {
        photos: [{ photoId: 1 }, { photoId: 2 }],
        backup: []
      }
      expect(state.backup.length).toBe(0)
      mutations.backup(state)
      expect(state.backup.length).toBe(2)
    })

    it('clears the current backup', () => {
      const state = {
        backup: [{ photoId: 1 }, { photoId: 2 }]
      }
      expect(state.backup.length).toBe(2)
      mutations.clearBackup(state)
      expect(state.backup.length).toBe(0)
    })
  })

  describe('actions', () => {
    it('loads 2 photos', () => {
      const store = {
        commit: jest.fn()
      }
      const photosToLoad = [{ photoId: 1 }, { photoId: 2 }]

      actions.load(store, photosToLoad)
      expect(store.commit).toHaveBeenCalledTimes(2)
    })

    it('adds 1 photo to pool', () => {
      const store = {
        commit: jest.fn(),
        dispatch: jest.fn(),
        getters: {
          inPool: photoId => photoId === 1
        }
      }

      actions.add(store, { photoId: 2 })
      expect(store.commit).toHaveBeenCalledWith('add', { photoId: 2 })
      expect(store.commit).toHaveBeenCalledWith('clearBackup')
      expect(store.dispatch).toHaveBeenCalledWith('savePool')
    })

    it("don't add the same photo to pool", () => {
      const store = {
        commit: jest.fn(),
        dispatch: jest.fn(),
        getters: {
          inPool: photoId => photoId === 1
        }
      }

      actions.add(store, { photoId: 1 })
      expect(store.commit).not.toHaveBeenCalledWith('add', { photoId: 1 })
      expect(store.dispatch).not.toHaveBeenCalledWith('savePool')
    })

    it('removes 1 photo from pool', () => {
      const store = {
        commit: jest.fn(),
        dispatch: jest.fn(),
        getters: {
          inPool: photoId => photoId === 1
        }
      }

      actions.remove(store, 1)
      expect(store.commit).toHaveBeenCalledWith('remove', 1)
      expect(store.dispatch).toHaveBeenCalledWith('savePool')
    })

    it("can't remove photo from pool", () => {
      const store = {
        commit: jest.fn(),
        dispatch: jest.fn(),
        getters: {
          inPool: photoId => photoId === 1
        }
      }

      actions.remove(store, 2)
      expect(store.commit).not.toHaveBeenCalled()
      expect(store.dispatch).not.toHaveBeenCalled()
    })

    it('clears pool', () => {
      const store = {
        commit: jest.fn(),
        dispatch: jest.fn()
      }

      actions.clearPool(store)

      expect(store.commit).toHaveBeenCalledWith('backup')
      expect(store.commit).toHaveBeenCalledWith('clear')
      expect(store.dispatch).toHaveBeenCalledWith('savePool')
    })

    it('restores the backup', () => {
      const store = {
        dispatch: jest.fn(),
        commit: jest.fn(),
        state: {
          backup: [{ photoId: 1 }]
        }
      }

      actions.restoreBackup(store)
      expect(store.dispatch).toHaveBeenCalledWith('load', store.state.backup)
      expect(store.commit).toHaveBeenCalledWith('clearBackup')
    })
  })
})
