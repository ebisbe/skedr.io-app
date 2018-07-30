import Store from '../store'
import { Auth } from 'aws-amplify'

const AuthFilter = async (to, from, next) => {
  try {
    const user = await Auth.currentAuthenticatedUser()
    const credentials = await Auth.currentCredentials()
    Store.commit('user/setUser', user)
    Store.commit('user/setUserId', credentials.identityId)
  } catch (err) {
    Store.commit('user/setUser', null)
    if (to.matched.some(record => record.meta.requiresAuth)) {
      next('/login')
      return
    }
  }
  next()
}

export default AuthFilter
