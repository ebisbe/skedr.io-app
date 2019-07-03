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
  Store.commit('setPageTitle', to.name)
  if (to.meta.requiresAuth === true) {
    const isAuthenticated = await Store.dispatch('user/currentAuthenticatedUser', to)
    if (!isAuthenticated) {
      next({ name: 'Login', query: { redirect: to.fullPath } })
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
