import { getters, mutations, actions } from '@/store/modules/user'
import Auth from '@aws-amplify/auth'

jest.mock('@aws-amplify/auth', () => {
  let attributes = { name: 'name', email: 'email' }
  return {
    error: true,
    signIn(email, password) {
      return Promise.resolve({ user: `User-${email}`, password })
    },
    verifiedContact(user) {
      return Promise.resolve({ verified: { email: `Verified-${user.user}` } })
    },
    currentAuthenticatedUser() {
      if (this.error) throw new Error('Not authenticated')
      else return Promise.resolve({ user: 'enric', attributes })
    },
    currentCredentials() {
      return Promise.resolve({ identityId: '12345' })
    },
    updateUserAttributes(user, newAttributes) {
      attributes = newAttributes
    },
    verifyCurrentUserAttributeSubmit(attribute, value) {
      if (value === '123456') {
        attributes = { email_verified: true }
      }
    },
    signOut() {
      return true
    }
  }
})
jest.mock('@aws-amplify/api', () => ({
  post() {}
}))

describe('Store user.js', () => {
  describe('getters', () => {
    it('returns username', () => {
      const state = {
        username: '12345@N01'
      }

      expect(getters.userId(state)).toBe('12345@N01')
    })
  })

  describe('mutations', () => {
    it('triggers setUser mutation', () => {
      const state = {
        user: null,
        username: null
      }

      const user = { username: '144521588%40N08', name: 'Enric' }

      mutations.setUser(state, user)
      expect(state.user).toEqual(user)
      expect(state.username).toBe('144521588@N08')
    })

    it('user is undefined', () => {
      const state = {
        user: null,
        username: null
      }

      const user = null

      mutations.setUser(state, user)
      expect(state.user).toEqual(user)
      expect(state.username).toBe(null)
    })

    it('triggers setUserId mutation', () => {
      const state = {
        userId: null
      }

      mutations.setUserId(state, 'userId')
      expect(state.userId).toBe('userId')
    })

    it('triggers setUserVerification mutation', () => {
      const state = {}

      const verification = { verification: 'something' }
      mutations.setUserVerification(state, verification)
      expect(state.userVerification).toEqual(verification)
    })

    it('updates user attributes', () => {
      const state = {
        user: {}
      }
      const newAttributes = { name: 'Enric', family_name: 'Bisbe Gil' }
      mutations.setUserAttributes(state, newAttributes)
      expect(state.user.attributes).toMatchObject(newAttributes)
    })
  })

  describe('actions', () => {
    it('log in an authenticated user', async () => {
      const store = {
        state: {
          username: '12345@N01'
        },
        commit: jest.fn()
      }
      const user = { username: 'test@mail.com', password: '123456' }

      const response = await actions.loginUser(store, user)
      expect(store.commit).toHaveBeenCalledTimes(2)
      expect(store.commit).toHaveBeenNthCalledWith(1, 'setUser', {
        user: 'User-test@mail.com',
        password: '123456'
      })
      expect(store.commit).toHaveBeenNthCalledWith(2, 'setUserVerification', {
        verified: { email: 'Verified-User-test@mail.com' }
      })
      expect(response).toEqual(true)
    })

    it('validates current user is not authenticated', async () => {
      const store = {
        commit: jest.fn()
      }

      const response = await actions.currentAuthenticatedUser(store)
      expect(store.commit).toHaveBeenCalledTimes(1)
      expect(store.commit).toHaveBeenCalledWith('setUser', null)
      expect(response).toBe(false)
    })

    it('validates current user is still authenticated', async () => {
      const store = {
        commit: jest.fn(),
        state: {
          username: 'username'
        }
      }
      Auth.error = false
      const response = await actions.currentAuthenticatedUser(store, {})
      expect(store.commit).toHaveBeenCalledTimes(2)
      expect(store.commit).toHaveBeenNthCalledWith(1, 'setUser', {
        attributes: { email: 'email', name: 'name' },
        user: 'enric'
      })
      expect(store.commit).toHaveBeenNthCalledWith(2, 'setUserId', '12345')
      expect(response).toBe(true)
    })

    it('updates user attributes from AWS', async () => {
      const commit = jest.fn()
      const store = {
        commit,
        state: {
          user: {
            id: 'someId',
            attributes: {
              name: 'Enric',
              family_name: 'Bisbe Gil'
            }
          }
        }
      }

      await actions.updateUserAttributes(store)
      expect(commit).toHaveBeenCalledTimes(1)
      expect(commit).toHaveBeenCalledWith('setUser', {
        user: 'enric',
        attributes: { name: 'Enric', family_name: 'Bisbe Gil' }
      })
    })

    it('confirms the email with a code', async () => {
      const commit = jest.fn()
      const store = {
        commit,
        state: {
          user: {
            id: 'someId',
            attributes: {
              email_verified: false
            }
          }
        }
      }

      await actions.confirmEmailCode(store, '123456')
      expect(commit).toHaveBeenCalledTimes(1)
      expect(commit).toHaveBeenCalledWith('setUser', {
        user: 'enric',
        attributes: { email_verified: true }
      })
    })

    if (
      ('confirms the email with a wrong code',
      () => {
        const commit = jest.fn()
        const store = {
          commit,
          state: {
            user: {
              id: 'someId',
              attributes: {}
            }
          }
        }
      })
    ) {
      it('signs out if email is verified', async () => {
        const store = {
          state: { user: { attributes: { email_verified: true } } }
        }
        const response = await actions.signOut(store)
        expect(response).toBe(true)
      })
    }

    it('does not allows to sign out when email is not verified', async () => {
      const store = {
        state: { user: { attributes: { email_verified: false } } }
      }
      return expect(actions.signOut(store)).rejects.toMatchObject({
        name: 'VerifyEmailError',
        message: 'To sign out first verify your email'
      })
    })
  })
})
