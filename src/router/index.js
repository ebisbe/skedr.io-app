import Vue from 'vue'
import Router from 'vue-router'
import Store from '../store'
import routes from './routes'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes
})

router.beforeEach(async (to, from, next) => {
  if (to.meta.hash) {
    Vue.prototype.$vuetify.theme.primary = to.meta.hash
  }
  Store.commit('setPageTitle', to.name)
  if (to.meta.requiresAuth === true) {
    const isAuthenticated = await Store.dispatch('user/currentAuthenticatedUser', to)
    if (!isAuthenticated) next({ name: 'Login' })
  }

  next()
})

export default router
