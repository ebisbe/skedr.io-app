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
  const path = await Store.dispatch('user/getAuthenticated', to)
  if (path !== null) {
    next(path)
  } else {
    next()
  }
})

export default router
