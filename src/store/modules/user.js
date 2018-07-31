import { Auth, JS } from 'aws-amplify'

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
      //state.username = '69663264@N03'
    } else {
      state.username = null
    }
  },
  setUserId: (state, userId) => (state.userId = userId),
  setUserVerification: (state, data) => {
    state.userVerification = data
  }
}

export const actions = {
  loginUser: async function({ commit }, { username, password }) {
    const user = await Auth.signIn(username.toLowerCase(), password)
    commit('setUser', user)

    const data = await Auth.verifiedContact(user)
    commit('setUserVerification', data)
    return !JS.isEmpty(data.verified) ? true : false
  },
  getAuthenticated: async ({ commit }, to) => {
    try {
      const user = await Auth.currentAuthenticatedUser()
      const credentials = await Auth.currentCredentials()
      commit('setUser', user)
      commit('setUserId', credentials.identityId)
    } catch (err) {
      commit('setUser', null)
      if (to.matched.some(record => record.meta.requiresAuth)) {
        return '/login'
      }
    }
    return null
  }
}
