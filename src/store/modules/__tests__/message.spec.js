import { mutations, actions } from '@/store/modules/message'

describe('Message store', () => {
  describe('mutations', () => {
    it('adds a message', () => {
      const state = {
        stack: ['another message']
      }

      mutations.add(state, 'new message')
      expect(state.stack.length).toBe(2)
    })

    it('duplicated messages from value are not added', () => {
      const state = {
        stack: [],
        value: 'error'
      }

      mutations.add(state, 'error')
      expect(state.stack.length).toBe(0)
    })

    it('duplicated messages from stack are not added', () => {
      const state = {
        stack: ['error']
      }

      mutations.add(state, 'error')
      expect(state.stack.length).toBe(1)
    })

    it('shifts a message from the stack', () => {
      const state = {
        stack: ['message1', 'message2'],
        value: ''
      }

      mutations.shift(state)
      expect(state.value).toBe('message1')

      mutations.shift(state)
      expect(state.value).toBe('message2')

      mutations.shift(state)
      expect(state.value).toBe('')
    })

    it('switch status', () => {
      const state = {
        status: false,
        value: 'Something'
      }

      mutations.switchStatus(state, true)
      expect(state.status).toBe(true)
      expect(state.value).toBe('Something')
      mutations.switchStatus(state, false)
      expect(state.status).toBe(false)
      expect(state.value).toBe('')
    })
  })

  describe('actions', () => {
    it('adds a new message to stack', () => {
      const store = {
        state: {
          stack: [],
          active: false
        },
        commit: jest.fn(),
        dispatch: jest.fn()
      }

      actions.add(store, 'error')
      expect(store.commit).toHaveBeenCalledTimes(1)
      expect(store.commit).toHaveBeenNthCalledWith(1, 'add', 'error')
      expect(store.dispatch).toHaveBeenCalledTimes(1)
      expect(store.dispatch).toHaveBeenNthCalledWith(1, 'shift')
    })

    it('shifts a message from the stack', () => {
      const store = {
        state: {
          stack: ['message'],
          status: false
        },
        commit: jest.fn().mockImplementation(() => true)
      }

      actions.shift(store)
      expect(store.commit).toHaveBeenCalledTimes(2)
      expect(store.commit).toHaveBeenNthCalledWith(1, 'shift')
      expect(store.commit).toHaveBeenNthCalledWith(2, 'switchStatus', true)
    })

    it('does not shift a message from the stack', () => {
      const store = {
        state: {
          stack: ['message'],
          status: true
        },
        commit: jest.fn()
      }

      actions.shift(store)
      expect(store.commit).toHaveBeenCalledTimes(0)
    })

    it('changes status to inactive and not shift', () => {
      const store = {
        state: {
          stack: []
        },
        commit: jest.fn(),
        dispatch: jest.fn()
      }

      actions.switchStatus(store, false)
      expect(store.commit).toHaveBeenCalledTimes(1)
      expect(store.commit).toHaveBeenCalledWith('switchStatus', false)

      expect(store.dispatch).toHaveBeenCalledTimes(0)
    })

    it('changes status to inactive and shift a new message', () => {
      const store = {
        state: {
          stack: ['another message']
        },
        commit: jest.fn()
      }

      actions.switchStatus(store, false)
      expect(store.commit).toHaveBeenCalledTimes(1)
      expect(store.commit).toHaveBeenCalledWith('switchStatus', false)
    })
  })
})
