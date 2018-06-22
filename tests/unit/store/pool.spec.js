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
  })

  describe('actions', () => {
    it('loads 2 photos', () => {
      const state = {
        commit: jest.fn()
      }
      const photosToLoad = [{ photoId: 1 }, { photoId: 2 }]

      actions.load(state, photosToLoad)
      expect(state.commit).toHaveBeenCalledTimes(2)
    })

    it('adds 1 photo to pool', () => {
      const state = {
        commit: jest.fn(),
        dispatch: jest.fn(),
        getters: {
          inPool: photoId => photoId === 1
        }
      }

      actions.add(state, { photoId: 2 })
      expect(state.commit).toHaveBeenCalledWith('add', { photoId: 2 })
      expect(state.dispatch).toHaveBeenCalledWith('savePool')
    })

    it("don't add the same photo to pool", () => {
      const state = {
        commit: jest.fn(),
        dispatch: jest.fn(),
        getters: {
          inPool: photoId => photoId === 1
        }
      }

      actions.add(state, { photoId: 1 })
      expect(state.commit).not.toHaveBeenCalledWith('add', { photoId: 1 })
      expect(state.dispatch).not.toHaveBeenCalledWith('savePool')
    })

    it('removes 1 photo from pool', () => {
      const state = {
        commit: jest.fn(),
        dispatch: jest.fn(),
        getters: {
          inPool: photoId => photoId === 1
        }
      }

      actions.remove(state, 1)
      expect(state.commit).toHaveBeenCalledWith('remove', 1)
      expect(state.dispatch).toHaveBeenCalledWith('savePool')
    })

    it("can't remove photo from pool", () => {
      const state = {
        commit: jest.fn(),
        dispatch: jest.fn(),
        getters: {
          inPool: photoId => photoId === 1
        }
      }

      actions.remove(state, 2)
      expect(state.commit).not.toHaveBeenCalled()
      expect(state.dispatch).not.toHaveBeenCalled()
    })

    it('clears pool', () => {
      const state = {
        commit: jest.fn(),
        dispatch: jest.fn()
      }

      actions.clearPool(state)

      expect(state.commit).toHaveBeenCalledWith('clear')
      expect(state.dispatch).toHaveBeenCalledWith('savePool')
    })
  })
})
