import Auth from '@aws-amplify/auth'
import LogRocket from 'logrocket'

export const state = {
  user: null,
  username: null,
  userId: null,
  userVerification: null
}

export const getters = {
  userId: state => state.username
}

export const mutations = {
  setUser(state, user) {
    state.user = user
    if (user !== null) {
      state.username = decodeURIComponent(user.username)
    } else {
      state.username = null
    }
  },
  setUserAttributes(state, attributes) {
    state.user.attributes = Object.assign({}, state.user.attributes, attributes)
  },
  setUserId: (state, userId) => (state.userId = userId),
  setUserVerification: (state, data) => {
    state.userVerification = data
  }
}

export const actions = {
  loginUser: async function({ state, commit }, { username, password }) {
    //the value of `username` is really an `email`
    const user = await Auth.signIn(username.toLowerCase(), password)
    commit('setUser', user)

    const data = await Auth.verifiedContact(user)
    commit('setUserVerification', data)

    const payload = {
      body: { userId: state.username, email: username }
    }
    return Object.keys(data.verified).length !== 0
  },
  currentAuthenticatedUser: async ({ commit, state }) => {
    try {
      const user = await Auth.currentAuthenticatedUser({ bypassCache: true })
      const credentials = await Auth.currentCredentials()
      commit('setUser', user)
      commit('setUserId', credentials.identityId)
      LogRocket.identify(state.username, {
        name: `${user.attributes.name} ${user.attributes.family_name}`,
        email: user.attributes.email
      })
      LogRocket.getSessionURL(sessionURL => {
        const indentifyUser = {
          name: `${user.attributes.name} ${user.attributes.family_name}`,
          email: user.attributes.email,
          sessionURL: sessionURL
        }
        Beacon('identify', indentifyUser)
      })
    } catch (err) {
      commit('setUser', null)
      return false
    }
    return true
  },
  updateUserAttributes: async ({ commit, state }) => {
    await Auth.updateUserAttributes(state.user, state.user.attributes)
    const user = await Auth.currentAuthenticatedUser({ bypassCache: true })
    commit('setUser', user)
  },
  confirmEmailCode: async ({ commit }, code) => {
    await Auth.verifyCurrentUserAttributeSubmit('email', code)
    const user = await Auth.currentAuthenticatedUser({ bypassCache: true })
    commit('setUser', user)
  },
  signOut: async ({ state }) => {
    if (state.user.attributes.email_verified === false) {
      throw { name: 'VerifyEmailError', message: 'To sign out first verify your email' }
    }
    await Auth.signOut()
    return true
  }
}
