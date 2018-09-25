import { Auth, JS, API } from 'aws-amplify'
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
  loginUser: async function({ state, commit }, { username, password }) {
    //the value of `username` is really an `email`
    const user = await Auth.signIn(username.toLowerCase(), password)
    commit('setUser', user)

    const data = await Auth.verifiedContact(user)
    commit('setUserVerification', data)

    const payload = {
      body: { userId: state.username, email: username }
    }
    API.post(process.env.VUE_APP_API_NAME, '/oauth/user', payload)
    return !JS.isEmpty(data.verified) ? true : false
  },
  getAuthenticated: async ({ commit, state }, to) => {
    try {
      const user = await Auth.currentAuthenticatedUser()
      const credentials = await Auth.currentCredentials()
      commit('setUser', user)
      commit('setUserId', credentials.identityId)
      LogRocket.identify(state.username, {
        name: user.attributes.name,
        email: user.attributes.email
      })
    } catch (err) {
      commit('setUser', null)
      if (to.matched.some(record => record.meta.requiresAuth)) {
        return '/login'
      }
    }
    return null
  }
}
